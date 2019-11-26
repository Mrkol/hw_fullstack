import React from 'react'
import { Link } from 'react-router-dom'

import * as State from '../state/MainState'
import './BoardHeader.css'

const BoardHeader = ({board}: {board: State.Board}) => {
	return (
		<div className='header'>
			<div className='boardTitle'>
				<div className='title'>
					<Link to={`/${board.shortName}`}>
						{board.name}
					</Link>
				</div>
				<div className='description'>
					<span>{board.description}</span>
				</div>
			</div>
		</div>
	)
}

export default BoardHeader
