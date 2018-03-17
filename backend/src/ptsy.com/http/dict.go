package http

import (
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"

	"ptsy.com/dict"
)

type dictOper interface {
	Add(w *dict.Word) error
	Update(w *dict.Word) error
	Search(keyword string) ([]*dict.Word, error)
	Delete(id int32) error
	Find(w *dict.Word, offset, limit int) (ret []*dict.Word, total int, err error)
	Start() error
	Shutdown()
}

const (
	errCodeEmptyID = 10
	errCodeBadID   = 11
	errCodeNoWord  = 12
)

var (
	errEmptyID = httpError{Code: errCodeEmptyID}
	errBadID   = httpError{Code: errCodeBadID}
	errNoWord  = httpError{Code: errCodeNoWord}
)

func (s *Server) addWord(_ httprouter.Params, obj interface{}) (int, interface{}) {
	w := obj.(*dict.Word)
	err := s.dict.Add(w)
	if err != nil {
		return http.StatusInternalServerError, &httpError{Code: errCodeInternal, Message: err.Error()}
	}

	return http.StatusOK, nil
}

func (s *Server) deleteWord(p httprouter.Params, _ interface{}) (int, interface{}) {
	id := p.ByName("id")

	if id == "" {
		return http.StatusBadRequest, errEmptyID
	}

	idi, err := strconv.Atoi(id)
	if err != nil {
		s.logger.Printf("[ERROR] bad id:%s\n", id)
		return http.StatusBadRequest, errBadID
	}

	err = s.dict.Delete(int32(idi))
	if err == nil {
		return http.StatusOK, nil
	}

	s.logger.Printf("[ERROR] delete word:%s error:%s\n", id, err)
	if err == dict.ErrNoWord {
		return http.StatusBadRequest, errNoWord
	}

	return http.StatusInternalServerError, httpError{Code: errCodeInternal, Message: err.Error()}
}

func (s *Server) updateWord(_ httprouter.Params, o interface{}) (int, interface{}) {
	w := o.(*dict.Word)

	err := s.dict.Update(w)
	if err == nil {
		return http.StatusOK, nil
	}

	s.logger.Printf("[ERROR] update word error:%s\n", err)
	if err == dict.ErrNoWord {
		return http.StatusBadRequest, errNoWord
	}

	return http.StatusInternalServerError, httpError{Code: errCodeInternal, Message: err.Error()}
}

type findRequest struct {
	Ch       string `json:"ch"`
	En       string `json:"en"`
	Examples string `json:"examples"`
	Source   string `json:"source"`
	Origin   string `json:"origin"`
	Position string `json:"Position"`
	Comment  string `json:"Comment"`
	Offset   int    `json:"offset"`
	Limit    int    `json:"limit"`
}

func (s *Server) findWord(_ httprouter.Params, o interface{}) (int, interface{}) {
	q := o.(*findRequest)
	ws, total, err := s.dict.Find(&dict.Word{
		Ch:       q.Ch,
		En:       q.En,
		Examples: q.Examples,
		Source:   q.Source,
		Origin:   q.Origin,
		Position: q.Position,
		Comment:  q.Comment,
	}, q.Offset, q.Limit)

	if err != nil {
		return http.StatusInternalServerError, httpError{Code: errCodeInternal, Message: err.Error()}
	}

	return http.StatusOK, map[string]interface{}{"total": total, "words": ws}
}

type searchRequest struct {
	Keyword string `json:"s"`
}

func (s *Server) search(_ httprouter.Params, o interface{}) (int, interface{}) {
	key := o.(*searchRequest)
	ws, err := s.dict.Search(key.Keyword)

	if err != nil {
		return http.StatusInternalServerError, httpError{Code: errCodeInternal, Message: err.Error()}
	}

	return http.StatusOK, map[string]interface{}{"words": ws}
}

const (
	dictPrefix = "/dict"
)

func registerDictRouter(s *Server) {
	root, r := s.path(dictPrefix), s.registerRouter
	r(http.MethodPost, root, newParser(func() interface{} { return &dict.Word{} }), s.addWord)
	r(http.MethodPut, root, newParser(func() interface{} { return &dict.Word{} }), s.updateWord)
	r(http.MethodDelete, s.path(dictPrefix, ":id"), emptyParser, s.deleteWord)
	r(http.MethodGet, root, newParseFromQuery(func() interface{} { return &findRequest{} }), s.findWord)
	r(
		http.MethodGet,
		s.path(dictPrefix, "search"),
		newParseFromQuery(func() interface{} { return &searchRequest{} }),
		s.search,
	)
}
