import { call, put, debounce, takeLatest, select } from "redux-saga/effects";
import { fetchAllPoints, fetchPointById, fetchPoints, setCurrentPoint, setPoints } from "../../features/pointSlice";
import { findPointById, findPoints, getAllPoints, type APIPointResponse } from "../../../api/api";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import type { Path, Point } from "../../../types/types";
import type { RootState } from "../../store";

function* findPointWorker(action: PayloadAction<string>) {
    const q = (action.payload || "").trim();
    if (!q) {
        yield put(setPoints([]));
        return;
    }

    const res: AxiosResponse<Point[]> = yield call(findPoints, action.payload)

    yield put(setPoints(res.data))
}

function* findPointByIdWorker(action: PayloadAction<string>) {
    const path: Path = yield select((state: RootState) => state.pathReducer.currentPath)
    const step: number = yield select((state: RootState) => state.pathReducer.currentStep)

    try {
        const res: AxiosResponse<APIPointResponse> = yield call(findPointById, action.payload)

        const dataUrl = res.data.photo_base64 ? `data:image/png;base64,${res.data.photo_base64}` : ''

        yield put(setCurrentPoint({
            id: res.data.point.id,
            description: res.data.point.description,
            nums: res.data.point.nums,
            tags: res.data.point.tags,
            photo: res.data.point.photo,
            photoBase64: dataUrl
        }))
    } catch (error) {
        console.error('Ошибка при загрузке фото точки:', error)

        if (path.path.length > 0) {
            yield put(setCurrentPoint(path.path[step - 1]))
        }
    }
}

function* findAllPointsWorker(action: PayloadAction<{
      setLoading: (value: boolean) => void,
      setError: (value: string) => void,
      mounted: boolean
    }>) {
    const { setLoading, setError, mounted } = action.payload

    yield setLoading(true)
    yield setError("")

    try {
        const res: AxiosResponse<Point[]> = yield call(getAllPoints)
        if (!mounted) return
        yield put(setPoints(Array.isArray(res.data) ? res.data : []))
    } catch (err) {
        console.error("Ошибка загрузки точек:", err)
        if (!mounted) return
        yield setError("Не удалось загрузить точки. Попробуйте позже.")
    } finally {
        if (mounted) yield setLoading(false)
    }
}

export function* findPointsWatcher() {
    yield debounce(300, fetchPoints.type, findPointWorker)
}

export function* findPointByIdWatcher() {
    yield takeLatest(fetchPointById.type, findPointByIdWorker)
}

export function* findAllPointsWatcher() {
    yield takeLatest(fetchAllPoints.type, findAllPointsWorker)
}