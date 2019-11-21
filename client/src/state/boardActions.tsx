export enum ActionType {
	FetchBoards = 'FETCH_BOARDS',
	BoardsFetched = 'BOARDS_FETCHED',
	FetchThreads = 'FETCH_THREADS',
	ThreadsFetched = 'THREADS_FETCHED'
}

export interface Action<T> {
	type: ActionType,
	payload: T
}
