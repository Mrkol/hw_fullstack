import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as State from '../state/MainState'
import * as Actions from '../state/boardActions'

import './PostForm.css'

const PostFormImpl = ({message, board, thread, update, submit}:
	{message: State.Message, board: string, thread?: number,
		update: (arg0: State.Message) => void,
		submit: (arg0: State.Message, arg1: string, arg2?: number) => void}) => {

	return (
		<div className='wrapper'>
			<div className='top'>
				<input className='author' type='text' placeholder='Имя'
					onBlur={e => update({...message, author: e.target.value})}/>
			</div>
			<div>
				<textarea className='text' placeholder='Комментарий'
					onBlur={e => update({...message, text: e.target.value})}/>
			</div>
			<div className='bottom'>
				<button className='send' onClick={e => submit(message, board, thread)}>Отправить</button>
			</div>
		</div>
	)
}

interface OwnProps {
	board: string,
	thread?: number
}

const mapStateToProps = ({board}: {board: State.MainState}, ownProps: OwnProps) => ({
	message: State.postFormMessageL.get(board)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	update: (message: State.Message) => dispatch(
		{type: Actions.ActionType.PostFormUpdate, payload: message}),
	submit: (message: State.Message, board: string, thread?: number) => dispatch(
		{type: Actions.ActionType.PostFormSubmit,
			payload: {message: message, board: board, thread: thread} as
				Actions.PostFormSubmitPayload})
})

const PostForm = connect(mapStateToProps, mapDispatchToProps)(PostFormImpl)


export default PostForm
