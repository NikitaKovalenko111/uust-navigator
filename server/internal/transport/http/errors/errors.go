package http_errors

type HTTPError struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
}
