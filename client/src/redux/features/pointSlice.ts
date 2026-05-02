import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Point } from '../../types/types'

interface PointState {
  foundPoints: Point[]
}

const initialState: PointState = {
  foundPoints: []
}

export const pointSlice = createSlice({
  name: 'point',
  initialState,
  reducers: {
    setPoints: (state, action: PayloadAction<Point[]>) => {
        state.foundPoints = action.payload
    },
  },
})

export const { setPoints } = pointSlice.actions

export default pointSlice.reducer