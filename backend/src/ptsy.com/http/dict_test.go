package http

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"ptsy.com/config"
	"ptsy.com/dict"
)

type findResult struct {
	Total int         `json:"total"`
	Words []dict.Word `json:"words"`
}

func TestDict(t *testing.T) {
	s, err := NewHTTPServer(&config.HTTP{Version: "v1"})
	if err != nil {
		t.Fatal(err)
	}

	httpSrv = httptest.NewServer(s)
	defer httpSrv.Close()

	runCases([]testCase{
		{
			desc:       "add",
			method:     http.MethodPost,
			path:       "/v1/dict",
			body:       []byte(`{"ch":"ch","en":"en","origin":"origin"}`),
			statusCode: http.StatusOK,
		},
		{
			desc:       "list",
			method:     http.MethodGet,
			path:       "/v1/dict?offset=0&limit=2&ch=ch",
			statusCode: http.StatusOK,
			expected: &findResult{
				Total: 1,
				Words: []dict.Word{
					{Ch: "ch", En: "en", Origin: "origin"},
				},
			},
		},
		{
			desc:       "add 1",
			method:     http.MethodPost,
			path:       "/v1/dict",
			body:       []byte(`{"ch":"ch1","en":"en1","origin":"origin1"}`),
			statusCode: http.StatusOK,
		},
		{
			desc:       "add 2",
			method:     http.MethodPost,
			path:       "/v1/dict",
			body:       []byte(`{"ch":"ch2","en":"en2","origin":"origin2"}`),
			statusCode: http.StatusOK,
		},
		{
			desc:       "list",
			method:     http.MethodGet,
			path:       "/v1/dict?offset=0&limit=2&ch=ch",
			statusCode: http.StatusOK,
			expected: &findResult{
				Total: 3,
				Words: []dict.Word{
					{Ch: "ch", En: "en", Origin: "origin"},
					{ID: 1, Ch: "ch1", En: "en1", Origin: "origin1"},
				},
			},
		},
		{
			desc:       "update 2",
			method:     http.MethodPut,
			path:       "/v1/dict",
			body:       []byte(`{"ch":"ch new","en":"en2","origin":"origin2","id":2}`),
			statusCode: http.StatusOK,
		},
		{
			desc:       "update not exist",
			method:     http.MethodPut,
			path:       "/v1/dict",
			body:       []byte(`{"ch":"ch new","en":"en2","origin":"origin2","id":3}`),
			statusCode: http.StatusBadRequest,
			err:        httpError{Code: errCodeNoWord},
		},
		{
			desc:       "list",
			method:     http.MethodGet,
			path:       "/v1/dict?offset=2&limit=1&ch=ch",
			statusCode: http.StatusOK,
			expected: &findResult{
				Total: 3,
				Words: []dict.Word{
					{ID: 2, Ch: "ch new", En: "en2", Origin: "origin2"},
				},
			},
		},
		{
			desc:       "delete 1",
			method:     http.MethodDelete,
			path:       "/v1/dict/0",
			statusCode: http.StatusOK,
		},
		{
			desc:       "delete not exist",
			method:     http.MethodDelete,
			path:       "/v1/dict/-1",
			statusCode: http.StatusBadRequest,
			err:        httpError{Code: errCodeNoWord},
		},
		{
			desc:       "list",
			method:     http.MethodGet,
			path:       "/v1/dict?offset=1&limit=2&ch=ch",
			statusCode: http.StatusOK,
			expected: &findResult{
				Total: 2,
				Words: []dict.Word{
					{ID: 2, Ch: "ch new", En: "en2", Origin: "origin2"},
				},
			},
		},
	}, t)
}
