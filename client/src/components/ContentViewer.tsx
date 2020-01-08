import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as State from '../state/MainState'
import * as Actions from '../state/boardActions'

import './ContentViewer.css'

const ContentViewerImpl = ({uuid, state, close, update}:
	{uuid: string, state: State.ViewerState,
		close: () => void, update: (arg0: State.ViewerState) => void}) => {

	// This is a bit scuffed
	let imageStyle: React.CSSProperties = {
		pointerEvents: 'all',
	    position: 'absolute',
	    transform: `translate(calc(${state.x}px - 50%), calc(${state.y}px - 50%)) scale(${state.scale})`,
	}

	return !!uuid ? (
		<div className='overlay'>
			<div className='wrapperHack'>
				<img src={`/api/getContent?uuid=${uuid}`} style={imageStyle}
					onDragStart={e => e.preventDefault()}
					onMouseDown={e => { if (e.button === 0) update({
						...state,
						move: true,
						anchorX: e.clientX,
						anchorY: e.clientY,
						distanceMoved: 0
					}) }}
					onMouseMove={e => {
						if (state.move) {
							let [deltaX, deltaY] = [e.clientX - state.anchorX, e.clientY - state.anchorY]
							update({
								...state,
								x: state.x + deltaX,
								y: state.y + deltaY,
								anchorX: e.clientX,
								anchorY: e.clientY,
								distanceMoved: state.distanceMoved + Math.abs(deltaX) + Math.abs(deltaY)
							})
						}
					}}
					onMouseUp={e => {
						update({...state, move: false})
						if (e.button === 0 && state.distanceMoved < 6) {
							close()
						}
					}}
					onWheel={e => {
						// F U C K   T H I S   S H I T
						let newscale = Math.max(state.scale + e.deltaY * 0.01, 0.01)
						let mouseX = e.clientX - window.innerWidth/2
						let mouseY = e.clientY - window.innerHeight/2

						update({...state,
							scale: newscale,
							x: mouseX + (state.x - mouseX)/state.scale*newscale,
							y: mouseY + (state.y - mouseY)/state.scale*newscale
						})
					}}
					onMouseOut={e => update({...state, move: false})}/>
			</div>
		</div>
	) : null
}

const mapStateToProps = ({board}: {board: State.MainState}) => ({
	uuid: State.viwerContentUuidL.get(board),
	state: State.viewerPositionL.get(board)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	close: () => dispatch({type: Actions.ActionType.ViewerContentUpdate, payload: ""}),
	update: (state: State.ViewerState) => dispatch({type: Actions.ActionType.ViewerUpdate, payload: state})
})

const ContentViewer = connect(mapStateToProps, mapDispatchToProps)(ContentViewerImpl)

export default ContentViewer
