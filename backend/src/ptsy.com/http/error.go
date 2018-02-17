package http

const (
	errCodeInternal = 200
	errCodeBadBody  = 1
)

type httpError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

var (
	suc        = httpError{}
	errBadBody = httpError{Code: errCodeBadBody}
)
