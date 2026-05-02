import axios from 'axios'

export const apiInstance = axios.create({
    baseURL: 'http://localhost:3001'
})

export const findPoints = (query: string) => {
    const res = apiInstance.get(`/points/?query=${query}`)

    return res
}

export const getPath = (start: string, end: string) => {
    const res = apiInstance.get(`/path/navigate?start=${start}&end=${end}`)

    return res
}

export const getAllPoints = () => {
    const res = apiInstance.get('/points/all')

    return res
}