export interface Point {
    id: string
    description: string
    nums: string[]
    tags: string[]
    photo: string
    photoBase64: string | null
}

export interface Path {
    depth: number
    path: Point[]
}

export interface PointValue {
    id: string
    value: string
}