import { flow } from 'fp-ts/es6/function'
import * as O from 'fp-ts/es6/Option'

import * as State from './MainState'
import * as Actions from './boardActions'
import Board from './Board'
import Message from './Message'
import { mapMerge, optionMapMerge, mapL } from '../util'


const mainState: State.MainState = {
	boards: O.none,
	loading: false
}

function boardReducer(state: State.MainState = mainState,
	action: Actions.Action<any>): State.MainState {

	switch (action.type) {
		case Actions.ActionType.FetchThreads:
		case Actions.ActionType.FetchBoards: {
			return State.loadingL.set(true)(state)
		}

		case Actions.ActionType.BoardsFetched: {
			let newBoardMap =
				new Map((action.payload as Board[])
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
			let {board, threads} =
				action.payload as {board: string, threads: Message[]}

			let newMessageMap =
				new Map(threads.map(message =>
					[message.number, message]))

			let newThreadMap =
				new Map(threads.map(message =>
					[message.number,
						{oppost: message.number, messages: O.none} as State.ThreadState]))

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
	}

	return state
}

export default boardReducer
