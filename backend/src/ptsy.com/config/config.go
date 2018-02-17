package config

// Config the configurations
type Config struct {
	HTTP `json:"http"`
}

// HTTP http configurations
type HTTP struct {
	Port    int    `json:"port"`
	Version string `json:"version"`
}
