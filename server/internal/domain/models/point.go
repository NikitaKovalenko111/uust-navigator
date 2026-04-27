package models

type Point struct {
	Description string   `json:"description"`
	Cabinets    []string `json:"nums"`
	Tags        []string `json:"tags"`
	Photo       string   `json:"photo"`
}
