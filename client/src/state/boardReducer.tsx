import { flow } from 'fp-ts/es6/function'
import * as O from 'fp-ts/es6/Option'

import * as State from './MainState'
import * as Actions from './boardActions'
import { mapMerge, optionMapMerge, mapL, optionSetMerge } from '../util'


const mainState: State.MainState = {
	boards: O.none,
	loading: false,
	postFormMessage: {text: '', author: ''} as State.Message
}

function fixMessageDateTime(message: State.Message) {
	let serverDate = message.date as any
	return ({...message, date:
		new Date(
			serverDate.year,
			serverDate.monthValue,
			serverDate.dayOfMonth,
			serverDate.hour,
			serverDate.minute,
			serverDate.second,
			0)} as State.Message)
}

function boardReducer(state: State.MainState = mainState,
	action: Actions.Action<any>): State.MainState {

	switch (action.type) {
		case Actions.ActionType.FetchThreads:
		case Actions.ActionType.FetchBoards:
		case Actions.ActionType.FetchThread: {
			return State.loadingL.set(true)(state)
		}

		case Actions.ActionType.BoardsFetched: {
			let newBoardMap =
				new Map((action.payload.response as State.Board[])
					.map(board =>
						[board.shortName, {
							board: board,
							threads: O.none,
							messages: new Map()
						} as State.BoardState]))

			return flow(
				State.boardsL
					.modify(flow(optionMapMerge(newBoardMap), O.some)),
				State.loadingL
					.set(true)
				)(state)
		}

		case Actions.ActionType.ThreadsFetched: {
			let {board, response} =
				action.payload as {board: string, response: State.Message[]}

			let messageList = response.map(fixMessageDateTime)

			let newMessageMap =
				new Map(messageList.map(message =>
					[message.number, message]))

			let newThreadMap =
				new Map(messageList.map(message =>
					[message.number,
						{oppost: message.number, replies: O.none} as State.ThreadState]))

			return flow(
				State.boardsO
					.composeOptional(mapL<string, State.BoardState>(board))
					.composeLens(State.threadsL)
					.modify(flow(optionMapMerge(newThreadMap), O.some)),
				State.boardsO
					.composeOptional(mapL<string, State.BoardState>(board))
					.composeLens(State.messagesL)
					.modify(mapMerge(newMessageMap)),
				State.loadingL
					.set(false)
				)(state)
		}

		case Actions.ActionType.ThreadFetched: {
			let {board, thread, response} =
				action.payload as {board: string, thread: number, response: State.Message[]}

			let messageList = response.map(fixMessageDateTime)

			let newMessageMap =
				new Map(messageList.map(message =>
					[message.number, message]))

			let newReplies = new Set(messageList
				.map(message => message.number)
				.filter(id => id !== thread))

			return flow(
				State.boardsO
					.compose(mapL<string, State.BoardState>(board))
					.composeLens(State.messagesL)
					.modify(mapMerge(newMessageMap)),
				State.boardsO
					.compose(mapL<string, State.BoardState>(board))
					.compose(State.threadsO)
					.compose(mapL<number, State.ThreadState>(thread))
					.composeLens(State.repliesL)
					.modify(flow(optionSetMerge(newReplies), O.some)),
				State.loadingL
					.set(false)
				)(state)
		}

		case Actions.ActionType.PostFormUpdate: {
			return State.postFormMessageL.set(action.payload)(state)
		}
	}

	return state
}

export default boardReducer
