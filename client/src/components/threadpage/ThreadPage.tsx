import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RouteComponentProps } from 'react-router-dom'
import * as O from 'fp-ts/es6/Option'

import * as State from '../../state/MainState'
import * as Actions from '../../state/boardActions'
import Message from '../Message'
import { mapL } from '../../util'
import BoardHeader from '../BoardHeader'
import PostForm from '../PostForm'

import './ThreadPage.css'

const ThreadPageImpl = ({boardShortName, threadNumber, board, replies, dispatch}:
	{boardShortName: string, threadNumber: number, board: O.Option<State.Board>,
		replies: O.Option<Set<number>>, dispatch: Dispatch}) => {

	const repliesLoaded = O.isNone(replies)
	React.useEffect(() => {
		dispatch({type: Actions.ActionType.FetchThreadOnce,
			payload: {board: boardShortName, thread: threadNumber} as Actions.FetchThreadPayload})
	}, [boardShortName, threadNumber, repliesLoaded, dispatch])

	if (O.isNone(replies) || O.isNone(board)) {
		return <span>Loading...</span>
	}

	return (
		<div>
			<BoardHeader board={board.value}/>

			<div className='postFormWrapper'>
				<div className='postForm'>
					<PostForm board={boardShortName} thread={threadNumber}/>
				</div>
			</div>

			<div>
				<Message board={boardShortName} number={threadNumber} isOppost={true}/>
			</div>

			<div>
				{Array.from(replies.value).map(id =>
					<Message board={boardShortName} number={id} key={id}/>)}
			</div>
		</div>
	)
}

interface UrlParams {
	board: string,
	thread: string
}

interface OwnProps extends RouteComponentProps<UrlParams> { }

const mapStateToProps = ({board}: {board: State.MainState}, ownProps: OwnProps) => {
	let boardName = ownProps.match.params.board
	let threadNum = Number(ownProps.match.params.thread)
	let boardLens = State.boardsO.compose(mapL<string, State.BoardState>(boardName))
	return ({
		boardShortName: boardName,
		threadNumber: threadNum,
		board: boardLens.composeLens(State.boardL).getOption(board),
		replies: boardLens
			.compose(State.threadsO)
			.compose(mapL<number, State.ThreadState>(threadNum))
			.compose(State.repliesO).getOption(board)
	})
}

const ThreadPage = connect(mapStateToProps)(ThreadPageImpl)

export default ThreadPage
