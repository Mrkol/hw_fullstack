import { put, takeEvery, all } from 'redux-saga/effects';

import { ActionType, Action } from './boardActions'
import axios from 'axios'

function* fetchBoards() {
	const json = yield axios.get('/api/getBoards')
		.then(response => response.data)

	yield put({type: 'BOARDS_FETCHED', payload: json})
}

function* fetchThreads(action: Action<string>) {
	const json = yield axios.get(`/api/getBoardThreads?board=${action.payload}`)
		.then(response => response.data)

	yield put({type: "THREADS_FETCHED", payload: {board: action.payload, threads: json}})
}

export default function* rootSaga() {
	yield all([
		yield takeEvery(ActionType.FetchBoards, fetchBoards),
		yield takeEvery(ActionType.FetchThreads, fetchThreads)
	])
}
