import type { PayloadAction } from "@reduxjs/toolkit"
import type { AxiosResponse } from "axios"
import type { Path } from "../../../types/types"
import { call, put, takeLatest } from "redux-saga/effects"
import { fetchPath, setPath } from "../../features/pathSlice"
import { getPath } from "../../../api/api"
import { saveRoute } from "../../../utils/routesStorage"

function* findPathWorker(action: PayloadAction<{startId: string, endId: string}>) {
    const res: AxiosResponse<Path> = yield call(getPath, action.payload.startId, action.payload.endId)

    try {
        const entry = {
            id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            ts: Date.now(),
            fromId: action.payload.startId,
            fromDesc: res.data.path[0].description,
            toId: action.payload.endId,
            toDesc: res.data.path[res.data.depth].description,
            depth: res.data.depth,
            path: res.data
        }
        saveRoute(entry)
    } catch (error) {
        console.warn('Не удалось сохранить маршрут в localStorage', error)
    }

    yield put(setPath(res.data))
}

export function* findPathWatcher() {
    yield takeLatest(fetchPath.type, findPathWorker)
}