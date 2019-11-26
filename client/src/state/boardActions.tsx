import * as State from '../state/MainState'

export enum ActionType {
	FetchBoards = 'FETCH_BOARDS',
	FetchBoardsOnce = 'FETCH_BOARDS_ONCE',
	BoardsFetched = 'BOARDS_FETCHED',

	FetchThreads = 'FETCH_THREADS',
	FetchThreadsOnce = 'FETCH_THREADS_ONCE',
	ThreadsFetched = 'THREADS_FETCHED',

	FetchThread = 'FETCH_THREAD',
	FetchThreadOnce = 'FETCH_THREAD_ONCE',
	ThreadFetched = 'THREAD_FETCHED',

	PostFormUpdate = 'POST_FORM_UPDATE',
	PostFormSubmit = 'POST_FORM_SUBMIT'
}

export interface Action<T> {
	type: ActionType,
	payload: T
}

export interface FetchThreadsPayload { board: string }
export interface FetchThreadPayload { board: string, thread: number }
export interface PostFormSubmitPayload { message: State.Message, board: string, thread?: number}
