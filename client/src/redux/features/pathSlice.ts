import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Path, Point } from '../../types/types'

interface PathState {
  currentPath: Point[]
  pathDepth: number
  currentStep: number
}

const initialState: PathState = {
  currentPath: [],
  pathDepth: 0,
  currentStep: 1
}

export const pathSlice = createSlice({
  name: 'path',
  initialState,
  reducers: {
    setPath: (state, action: PayloadAction<Path>) => {
      state.currentPath = action.payload.path
      state.pathDepth = action.payload.depth
      state.currentStep = 1
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
  },
})

export const { setPath, setCurrentStep } = pathSlice.actions

export default pathSlice.reducer