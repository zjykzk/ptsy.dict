package http

import (
	"bytes"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"
)

var httpSrv *httptest.Server

type testCase struct {
	desc        string
	method      string
	path        string
	body        []byte
	statusCode  int
	err         httpError
	expected    interface{}
	contentType string
	form        url.Values
}

func runCases(cs []testCase, t *testing.T) {
	t.Logf("====== Total %d CASE\n", len(cs))
	for i := range cs {
		c := &cs[i]
		t.Logf("CASE %d %s", i+1, c.desc)
		runCase(c, t)
	}
}

func runCase(c *testCase, t *testing.T) {
	body := c.body
	req, err := http.NewRequest(c.method, httpSrv.URL+c.path, bytes.NewBuffer(body))
	if c.method != http.MethodGet {
		ct := c.contentType
		if ct == "" {
			ct = "application/json"
		}
		req.Header.Set("Content-Type", ct)
	}

	if err != nil {
		t.Fatal(err)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}

	assert.Equal(t, c.statusCode, resp.StatusCode)

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil && err != io.EOF {
		t.Fatal(err)
	}
	resp.Body.Close()

	if c.statusCode != resp.StatusCode {
		t.Log("request:", string(body))
		t.Log("response:", string(data))
	}

	if c.statusCode != 200 {
		hr := httpError{}
		if err = json.Unmarshal(data, &hr); err != nil {
			t.Fatal(err)
		}
		assert.Equal(t, c.err.Code, hr.Code)
		if c.err != hr {
			t.Log(string(data))
			t.Log(string(c.body))
		}
	}

	if c.expected == nil {
		return
	}

	typ := reflect.TypeOf(c.expected)
	var actual interface{}
	if typ.Kind() == reflect.Ptr {
		actual = reflect.New(typ.Elem()).Interface()
	} else {
		actual = reflect.New(typ).Interface()
	}

	if err = json.Unmarshal(data, actual); err != nil {
		t.Fatal(err)
	}
	assert.Equal(t, c.expected, actual)
}
