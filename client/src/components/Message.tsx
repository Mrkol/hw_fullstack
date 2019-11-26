import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as O from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import { Link } from 'react-router-dom'

import * as State from '../state/MainState'
import { mapL } from '../util'
import './Message.css'

function BodyProcessor(text: String) {
	return text.split('\n').map((item, key) => <span key={key}>{item}<br/></span>);
}

const MessageImpl = ({entityOpt, isOppost, board, dispatch}:
		{entityOpt: O.Option<State.Message>, isOppost: boolean,
			board: string, dispatch: Dispatch}) => {

	if (O.isNone(entityOpt)) {
		return <div/>
	}
	let entity = entityOpt.value
	return (
		<div className={isOppost ? 'oppost' : 'message'}>
			<div className='messageHeader'>
				{ isOppost ?
				<Link to={`/${board}/${entity.number}`} className='id'>
					№{entity.number}
				</Link>
				:
				<span className='id'>
					№{entity.number}
				</span>
				}
				<span className='date'>{entity.date.toLocaleString()}</span>
				<span className='name'>{entity.author}</span>
			</div>
			<div className='messageBody'>
				<span>
					{BodyProcessor(entity.text)}
				</span>
			</div>
		</div>);
}

interface OwnProps {
	board: string
	number: number
	isOppost?: boolean
}

const mapStateToProps = ({board}: {board: State.MainState}, ownProps: OwnProps) => {
	return ({
		entityOpt: pipe(
			State.boardsO
				.compose(mapL<string, State.BoardState>(ownProps.board))
				.getOption(board),
			O.map(boardState => boardState.messages),
			O.map(mapL<number, State.Message>(ownProps.number).getOption),
			O.flatten
		),
		isOppost: ownProps.isOppost === undefined ? false : ownProps.isOppost,
		board: ownProps.board
	})
}

const Message = connect(mapStateToProps)(MessageImpl)

export default Message
