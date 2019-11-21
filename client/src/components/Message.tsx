import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as O from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'

import MessageEntity from '../state/Message'
import * as State from '../state/MainState'
import { mapL } from '../util'
import './Message.css'

function BodyProcessor(text: String) {
	return text.split('\n').map((item, key) => <span key={key}>{item}<br/></span>);
}

const MessageImpl = ({entityOpt, dispatch}: {entityOpt: O.Option<MessageEntity>, dispatch: Dispatch}) => {
	if (O.isNone(entityOpt)) {
		return <div/>
	}
	let entity = entityOpt.value
	return (
		<div className="message">
			<div className="messageHeader">
				<span className="id">№{entity.number}</span>
				<span className="name">{entity.author}</span>
			</div>
			<div className="separator"/>
			<span className="messageBody">
				{BodyProcessor(entity.text)}
			</span>
		</div>);
}

interface OwnProps {
	board: string
	number: number
}

const mapStateToProps = ({board}: {board: State.MainState}, ownProps: OwnProps) => {
	return ({
		entityOpt: pipe(
			State.boardsO
				.compose(mapL<string, State.BoardState>(ownProps.board))
				.getOption(board),
			O.map(boardState => boardState.messages),
			O.map(mapL<number, MessageEntity>(ownProps.number).getOption),
			O.flatten
		)
	})
}

const Message = connect(mapStateToProps)(MessageImpl)

export default Message
