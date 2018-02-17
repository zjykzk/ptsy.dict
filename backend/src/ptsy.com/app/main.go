package main

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"log"
	"os"
	"os/signal"
	"syscall"

	"ptsy.com/config"
	"ptsy.com/http"
)

var (
	configFile string
)

func init() {
	flag.StringVar(&configFile, "c", "", "configure file name")
}

func main() {
	flag.Parse()

	if configFile == "" {
		log.Println("no configure file")
		return
	}

	data, err := ioutil.ReadFile(configFile)
	if err != nil {
		log.Printf("read file error:%s\n", err)
		return
	}

	var conf config.Config
	err = json.Unmarshal(data, &conf)
	if err != nil {
		log.Printf("unmarshal error:%s\n", err)
		return
	}

	srv, err := http.NewHTTPServer(&conf.HTTP)
	if err != nil {
		log.Printf("new http server error:%s\n", err)
		return
	}

	err = srv.Start()
	if err != nil {
		log.Printf("start http server error:%s\n", err)
		return
	}

	log.Printf("server listen on %d\n", conf.HTTP.Port)

	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)
	select {
	case <-signalChan:
	}

	log.Println("shutdown server")
	srv.Shutdown()
}
