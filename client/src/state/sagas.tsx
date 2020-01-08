import { put, takeEvery, all, select, take, call } from 'redux-saga/effects'
import { pipe } from 'fp-ts/es6/pipeable'
import { flow } from 'fp-ts/es6/function'
import { Optional } from 'monocle-ts'

import * as Actions from './boardActions'
import axios from 'axios'
import * as M from './MainState'
import RootState from './RootState'
import * as Ls from './lenses'

type BooleanSelector = (arg0: RootState) => boolean

const optToBoolSelector = <V,>(opt: Optional<M.MainState, V>) =>
	pipe(opt, Ls.focusOptionalFromRoot, Ls.isSome)

function readFileRaw(file: Blob) {
	return new Promise<ArrayBuffer>((resolve, reject) => {
		const reader  = new FileReader();
		reader.onload = () => resolve(reader.result as ArrayBuffer)
		reader.onerror = reject
		reader.readAsArrayBuffer(file)
	})
}


function* waitFor(selector: BooleanSelector) {
  while (true) {
    if (yield select(selector)) return;
    yield take('*');
  }
}

function parallel<T>(saga1: (arg0: Actions.Action<T>) => any,
	saga2: (arg0: Actions.Action<T>) => any) {

	return function*(action: Actions.Action<T>) {
		yield all([call(saga1, action), call(saga2, action)])
	}
}

function fetch<T extends object>(from: string,
	resultActionType: Actions.ActionType, dependencySelector?: (arg0: T) => BooleanSelector) {

	return function*(action: Actions.Action<T>) {
		const json = yield axios.get(from + '?' +
			Object.keys(action.payload)
				.map(key => `${key}=${Reflect.get(action.payload, key)}`)
				.join('&'))
			.then(resp => resp.data)

		if (!!dependencySelector) {
			yield call(waitFor, dependencySelector(action.payload))
		}

		yield put({type: resultActionType, payload: {...action.payload, response: json}})
	}
}

function fetchOnce<T, V>(
	checker: (arg: T) => Optional<M.MainState, V>,
	saga: (action: Actions.Action<T>) => void) {
	return function*(action: Actions.Action<T>) {
		if (yield select(optToBoolSelector(checker(action.payload)))) {
			return
		}
		yield saga(action);
	}
}

const fetchBoards =
	fetch<{}>('/api/getBoards', Actions.ActionType.BoardsFetched)

const fetchBoardsOnce = fetchOnce(Ls.boards, fetchBoards)

const fetchThreads =
	fetch<Actions.FetchThreadsPayload>('/api/getBoardThreads',
		Actions.ActionType.ThreadsFetched, flow(Ls.boards, optToBoolSelector))

const fetchThreadsOnce = parallel(fetchBoardsOnce, fetchOnce(Ls.threads, fetchThreads))

const fetchThread =
	fetch<Actions.FetchThreadPayload>('/api/getThreadMessages',
		Actions.ActionType.ThreadFetched, flow(Ls.threads, optToBoolSelector))

const fetchThreadOnce = parallel(fetchThreadsOnce, fetchOnce(Ls.thread, fetchThread))


function* postFormSubmit(action: Actions.Action<Actions.PostFormSubmitPayload>) {
	var msg = action.payload.message

	if (msg.media instanceof FileList) {
		var uuids: string[] = []
		for (let file of msg.media) {
			let content = yield call(readFileRaw, file)

			let result = yield axios.post(`/api/postContent`, content, {
				headers:{
					'Content-Type': 'application/octet-stream'
				}
			})
			uuids.push(result.data)
		}
		msg.media = uuids
	}

	if (!action.payload.thread) {
		yield axios.post(`/api/postThread?board=${action.payload.board}`, msg)

		yield put({type: Actions.ActionType.FetchThreads,
			payload: {board: action.payload.board} as Actions.FetchThreadsPayload})
	} else {
		yield axios.post(`/api/postMessage?board=${action.payload.board}`
			+`&thread=${action.payload.thread}`, msg)

		yield put({type: Actions.ActionType.FetchThread,
			payload: {board: action.payload.board,
				thread: action.payload.thread} as Actions.FetchThreadsPayload})
	}
}

export default function* rootSaga() {
	yield all([
		yield takeEvery(Actions.ActionType.FetchBoards, fetchBoards),
		yield takeEvery(Actions.ActionType.FetchBoardsOnce, fetchBoardsOnce),

		yield takeEvery(Actions.ActionType.FetchThreads, fetchThreads),
		yield takeEvery(Actions.ActionType.FetchThreadsOnce, fetchThreadsOnce),

		yield takeEvery(Actions.ActionType.FetchThread, fetchThread),
		yield takeEvery(Actions.ActionType.FetchThreadOnce, fetchThreadOnce),

		yield takeEvery(Actions.ActionType.PostFormSubmit, postFormSubmit)
	])
}
