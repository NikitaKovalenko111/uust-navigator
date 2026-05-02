package models

type Path struct {
	Depth      int    `json:"d"`
	PathString string `json:"path"`
}

type PathResponse struct {
	Depth     int      `json:"path_depth"`
	PathArray []Point `json:"path"`
}
