package http

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"

	"ptsy.com/config"
	"ptsy.com/dict"

	"github.com/julienschmidt/httprouter"
)

type parser func(req *http.Request) (interface{}, httpError)
type handle func(param httprouter.Params, obj interface{}) (
	status int, ret interface{},
)

func newParser(createObjPtr func() interface{}) parser {
	return parser(func(req *http.Request) (interface{}, httpError) {
		o := createObjPtr()
		ct := req.Header.Get("Content-Type")
		var err error
		switch ct {
		case "application/x-www-form-urlencoded":
			err = parseForm(req, o)
		default:
			err = parseJSON(req, o)
		}

		if err == nil {
			return o, suc
		}
		return nil, errBadBody
	})
}

func parseForm(req *http.Request, o interface{}) error {
	err := req.ParseForm()
	if err != nil {
		return err
	}

	err = FormUnMarshal(req.Form, o)
	if err != nil {
		return err
	}
	return nil
}

func parseJSON(req *http.Request, o interface{}) error {
	data, err := ioutil.ReadAll(req.Body)
	if err != nil {
		return err
	}
	err = json.Unmarshal(data, o)
	return err
}

func newParseFromQuery(createObjPtr func() interface{}) parser {
	return func(req *http.Request) (interface{}, httpError) {
		o := createObjPtr()
		err := FormUnMarshal(req.URL.Query(), o)

		if err == nil {
			return o, suc
		}
		return nil, errBadBody
	}
}

func emptyParser(req *http.Request) (ret interface{}, err httpError) {
	return
}

// Server the http server for the dict
type Server struct {
	config.HTTP
	dict   dictOper
	logger *log.Logger
	*httprouter.Router
}

// Start start the http server
func (s *Server) Start() error {
	err := s.dict.Start()
	if err != nil {
		return err
	}

	l, err := net.Listen("tcp", ":"+strconv.Itoa(s.Port))
	if err != nil {
		return err
	}

	return http.Serve(l, s)
}

// Shutdown shutdown the http server
func (s *Server) Shutdown() {
	s.dict.Shutdown()
}

func (s *Server) registerRouter(method, path string, p parser, h handle) {
	s.logger.Printf("[INFO] register %s %s\n", method, path)
	s.Handle(method, path, func(w http.ResponseWriter, req *http.Request, param httprouter.Params) {
		w.Header().Set("Content-Type", "application/json")
		o, err := p(req)
		if err.Code != 0 {
			w.WriteHeader(http.StatusBadRequest)
			writeResponse(w, err)
			return
		}

		status, ret := h(param, o)
		w.WriteHeader(status)
		if ret != nil {
			writeResponse(w, ret)
		}
	})
}

func internalErrorResponse(w http.ResponseWriter) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte(`{"code":200,"message":"internal error"}`))
}

func writeResponse(w http.ResponseWriter, o interface{}) {
	d, err := json.Marshal(o)
	if err != nil {
		internalErrorResponse(w)
		return
	}
	w.Write(d)
}

func (s *Server) path(paths ...string) string {
	return "/" + s.Version + strings.Join(paths, "/")
}

// NewHTTPServer creates http server
func NewHTTPServer(conf *config.HTTP) (*Server, error) {
	dict := dict.NewSimpleDict()
	err := dict.Start()
	if err != nil {
		return nil, err
	}

	s := &Server{
		HTTP:   *conf,
		dict:   dict,
		logger: log.New(os.Stderr, "[HTTP]", log.LstdFlags),
		Router: httprouter.New(),
	}

	registerDictRouter(s)

	return s, nil
}
