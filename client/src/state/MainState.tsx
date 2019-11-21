import { Option } from 'fp-ts/es6/Option'
import { Lens, Optional } from 'monocle-ts'

import Board from './Board'
import Message from './Message'


export interface MainState {
	boards: Option<Map<string, BoardState>>
	loading: boolean
}
export const loadingL = Lens.fromProp<MainState>()('loading')
// This ignores "none"
export const boardsO = Optional.fromOptionProp<MainState>()('boards')
// This allows to change "none"
export const boardsL = Lens.fromProp<MainState>()('boards')

export interface BoardState {
	board: Board
	threads: Option<Map<number, ThreadState>>
	messages: Map<number, Message>
}
export const boardL = Lens.fromProp<BoardState>()('board')
export const threadsO = Optional.fromOptionProp<BoardState>()('threads')
export const threadsL = Lens.fromProp<BoardState>()('threads')
export const messagesL = Lens.fromProp<BoardState>()('messages')

export interface ThreadState {
	oppost: number
	messages: Option<number[]>
}