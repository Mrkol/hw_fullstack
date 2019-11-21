import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Link } from 'react-router-dom'
import { collect } from 'fp-ts/es6/Map'
import { ordString } from 'fp-ts/es6/Ord'
import { pipe } from 'fp-ts/es6/pipeable'
import * as O from 'fp-ts/es6/Option'

import * as State from '../state/MainState'
import Board from '../state/Board'
import * as Actions from '../state/boardActions'
import './StartPage.css'


const StartPageImpl = ({boardList, dispatch}: {boardList: O.Option<Board[]>, dispatch: Dispatch}) => {
	React.useEffect(() => {
		dispatch({type: Actions.ActionType.FetchBoards, payload: undefined})
	}, [dispatch]);

	if (O.isNone(boardList)) {
		return <span>Loading...</span>
	}

	return (
		<div className='page'>
			<div className='boardList'>
				{boardList.value.map((board: Board) =>
					<Link to={board.shortName} key={board.id} className='boardLink'>
						/{board.shortName}/ {board.name} -- {board.description}
					</Link>
				)}
			</div>
		</div>
	)
}

const mapStateToProps = ({board}: {board: State.MainState}) => ({
	boardList: pipe(
			State.boardsO.getOption(board),
			O.map(collect(ordString)((k, v) => v.board))
		)
})

const StartPage = connect(mapStateToProps)(StartPageImpl)

export default StartPage
