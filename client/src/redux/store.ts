import { configureStore } from '@reduxjs/toolkit'
import pointsReducer from './features/pointSlice'
import pathReducer from './features/pathSlice'

const store = configureStore({
  reducer: {
    pointReducer: pointsReducer,
    pathReducer: pathReducer
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch