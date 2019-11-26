import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Dispatch } from 'redux'
import * as O from 'fp-ts/es6/Option'
import * as A from 'fp-ts/es6/Array'
import { Ord, ordNumber } from 'fp-ts/es6/Ord'
import { pipe } from 'fp-ts/es6/pipeable'
import { monoidAny, fold } from 'fp-ts/es6/Monoid'

import * as State from '../../state/MainState'
import * as Actions from '../../state/boardActions'
import { mapL } from '../../util'
import Thread from './Thread'
import PostForm from '../PostForm'

import './BoardPage.css'



const BoardPageImpl =
	({boardShortName, board, threads, dispatch}:
		{boardShortName: string,
		board: O.Option<State.Board>,
		threads: O.Option<number[]>,
		dispatch: Dispatch}) => {

	React.useEffect(() => {
			dispatch({type: Actions.ActionType.FetchThreadsOnce,
				payload: {board: boardShortName} as Actions.FetchThreadsPayload})
		}, [dispatch, boardShortName]);

	if (O.isNone(threads) || O.isNone(board)) {
		return <span>Loading...</span>
	}

	return (
		<div>
			<div className='header'>
				<div className='boardTitle'>
					<div className='title'>
						<span>{board.value.name}</span>
					</div>
					<div className='description'>
						<span>{board.value.description}</span>
					</div>
				</div>
			</div>
			<div>
				<PostForm board={board.value.shortName}/>
			</div>
			<div>
			{threads.value.map((id: number) =>
				<Thread key={id} board={board.value.shortName} number={id}/>
			)}
			</div>
		</div>
	)
}

interface UrlParams {
	board: string
}

interface OwnProps extends RouteComponentProps<UrlParams> { }

const mapStateToProps = ({board}: {board: State.MainState}, ownProps: OwnProps) => {
	let boardLens =
		State.boardsO.compose(mapL<string, State.BoardState>(ownProps.match.params.board))

	return ({
		boardShortName: ownProps.match.params.board,
		board: boardLens.composeLens(State.boardL).getOption(board),
		// This is fubar
		// TODO: something
		threads: pipe(
				boardLens.getOption(board),
				O.map((s: State.BoardState) => s.threads),
				O.flatten,
				O.map((map: Map<number, State.ThreadState>) => Array.from(map.keys())),
				O.map(arr => {
					let opt = boardLens.composeLens(State.messagesL).getOption(board)
					if (O.isNone(opt)) { return O.none }
					return O.some({ids: arr, messages: opt.value})
				}),
				O.flatten,
				O.map(({ids, messages}) => ids.map(id => messages.get(id) as any as State.Message)),
				O.map(A.sort({
					compare: (x, y) => -ordNumber.compare(x.date.getTime(), y.date.getTime())
				} as Ord<State.Message>)),
				O.map(A.map(message => message.number))
			)
	})
}

const BoardPage = connect(mapStateToProps)(BoardPageImpl)

export default BoardPage
