package models

type Point struct {
	Description string   `json:"description"`
	Cabinets    []string `json:"nums"`
	Tags        []string `json:"tags"`
	Photo       string   `json:"photo"`
}

type PointResponse struct {
	PhotoEnc string `json:"photo_base64"`
	Point    *Point `json:"point"`
}
