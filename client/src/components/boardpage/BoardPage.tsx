import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Dispatch } from 'redux'
import * as O from 'fp-ts/es6/Option'
import * as A from 'fp-ts/es6/Array'
import { Ord, ordNumber } from 'fp-ts/es6/Ord'
import { pipe } from 'fp-ts/es6/pipeable'

import * as State from '../../state/MainState'
import * as Actions from '../../state/boardActions'
import { mapL } from '../../util'
import Thread from './Thread'
import PostForm from '../PostForm'
import BoardHeader from '../BoardHeader'
import ContentViewer from '../ContentViewer'

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
			<BoardHeader board={board.value}/>
			<div className='postFormWrapper'>
				<div className='postForm'>
					<PostForm board={board.value.shortName}/>
				</div>
			</div>
			<div>
			{threads.value.map((id: number) =>
				<Thread key={id} board={board.value.shortName} number={id}/>
			)}
			</div>
			<ContentViewer/>
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
				O.map((map: Map<number, State.ThreadState>) => Array.from(map.values())),
				O.map(A.sort({
					compare: (x, y) => -ordNumber.compare(x.latestReply, y.latestReply)
				} as Ord<State.ThreadState>)),
				O.map(A.map(thread => thread.oppost))
			)
	})
}

const BoardPage = connect(mapStateToProps)(BoardPageImpl)

export default BoardPage
