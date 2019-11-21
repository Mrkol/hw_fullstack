import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Dispatch } from 'redux'
import * as O from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'

import * as State from '../state/MainState'
import * as Actions from '../state/boardActions'
import Message from './Message'
import { mapL } from '../util'


const BoardPageImpl =
	({boardShortName, threads, dispatch}:
		{boardShortName: string,
		threads: O.Option<number[]>,
		dispatch: Dispatch}) => {

	React.useEffect(() => {
			dispatch({type: Actions.ActionType.FetchThreads, payload: boardShortName})
		}, [dispatch, boardShortName]);

	if (O.isNone(threads)) {
		return <span>Loading...</span>
	}

	return (
		<div>
			{threads.value.map((id: number) =>
				<Message key={id} board={boardShortName} number={id}/>
			)}
		</div>
	)
}

interface UrlParams {
	board: string
}

interface OwnProps extends RouteComponentProps<UrlParams> { }

const mapStateToProps = ({board}: {board: State.MainState}, ownProps: OwnProps) => {
	console.log(ownProps)
	return ({
		boardShortName: ownProps.match.params.board,
		threads: pipe(
				State.boardsO
					.compose(mapL<string, State.BoardState>(ownProps.match.params.board))
					.getOption(board),
				O.map((s: State.BoardState) => s.threads),
				O.flatten,
				O.map((map: Map<number, State.ThreadState>) => Array.from(map.keys()))
			)
	})
}

const BoardPage = connect(mapStateToProps)(BoardPageImpl)

export default BoardPage
