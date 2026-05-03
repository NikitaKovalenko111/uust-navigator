import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Point } from '../../types/types'

interface PointState {
  foundPoints: Point[]
  currentPoint: Point | null
}

const initialState: PointState = {
  foundPoints: [],
  currentPoint: null
}

export const pointSlice = createSlice({
  name: 'point',
  initialState,
  reducers: {
    setPoints: (state, action: PayloadAction<Point[]>) => {
      state.foundPoints = action.payload
    },
    setCurrentPoint: (state, action: PayloadAction<Point>) => {
      state.currentPoint = action.payload
    },
    fetchPoints: (_state, _action: PayloadAction<string>) => {},
    fetchPointById: (_state, _action: PayloadAction<string>) => {},
    fetchAllPoints: (_state, _action: PayloadAction<{setLoading: (value: boolean) => void, setError: (value: string) => void, mounted: boolean}>) => {}
  },
})

export const { setPoints, setCurrentPoint, fetchPoints, fetchPointById, fetchAllPoints } = pointSlice.actions

export default pointSlice.reducer