import { all, fork } from "redux-saga/effects"
import { findAllPointsWatcher, findPointByIdWatcher, findPointsWatcher } from "./sagas/points"
import { findPathWatcher } from "./sagas/path"

function* runSagas() {
    yield all([
        fork(findPointsWatcher),
        fork(findPointByIdWatcher),
        fork(findAllPointsWatcher),
        fork(findPathWatcher),
    ])
}

export default runSagas