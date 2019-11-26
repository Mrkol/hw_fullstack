import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { pipe } from 'fp-ts/es6/pipeable'
import * as O from 'fp-ts/es6/Option'
import { takeRight } from 'fp-ts/es6/Array'
import { toArray } from 'fp-ts/es6/Set'
import { ordNumber } from 'fp-ts/es6/Ord'
import * as Actions from '../../state/boardActions'

import Message from '../Message'
import * as State from '../../state/MainState'
import { mapL } from '../../util'
import './Thread.css'

const ThreadImpl =
	({boardShortName, oppost, preview, dispatch}:
		{boardShortName: string,
		oppost: number,
		preview: O.Option<number[]>,
		dispatch: Dispatch}) => {

	React.useEffect(() => {
		dispatch({type: Actions.ActionType.FetchThreadOnce,
			payload: {board: boardShortName, thread: oppost} as Actions.FetchThreadPayload})
	}, [boardShortName, oppost, dispatch, O.isNone(preview)])

	if (O.isNone(preview)) {
		return <div/>
	}

	return (
		<div>
			<div className='separator'/>
			<Message board={boardShortName} number={oppost} isOppost={true}/>
			<div className='previewBlock'>
				{preview.value.map(i =>
					<Message board={boardShortName} number={i} key={i}/>)}
			</div>
		</div>
	)
}

interface OwnProps {
	number: number,
	board: string
}

const mapStateToProps = ({board}: {board: State.MainState}, ownProps: OwnProps) => {
	return {
		boardShortName: ownProps.board,
		oppost: ownProps.number,
		preview: pipe(
			board,
			State.boardsO
				.compose(mapL(ownProps.board))
				.compose(State.threadsO)
				.compose(mapL(ownProps.number))
				.compose(State.repliesO).getOption,
			O.map(toArray(ordNumber)),
			O.map(takeRight(3))
		)
	}
}

const Thread = connect(mapStateToProps)(ThreadImpl)

export default Thread
