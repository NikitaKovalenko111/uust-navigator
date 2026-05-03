import { configureStore } from '@reduxjs/toolkit'
import pointsReducer from './features/pointSlice'
import pathReducer from './features/pathSlice'
import createSagaMiddleware from 'redux-saga'
import runSagas from './saga/saga'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: {
    pointReducer: pointsReducer,
    pathReducer: pathReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
})

sagaMiddleware.run(runSagas)

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch