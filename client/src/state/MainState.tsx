import { Option } from 'fp-ts/es6/Option'
import { Lens, Optional } from 'monocle-ts'


export interface ViewerState {
	x: number
	y: number
	scale: number
	move: boolean
	anchorX: number
	anchorY: number
	distanceMoved: number
}

export interface MainState {
	boards: Option<Map<string, BoardState>>
	loading: boolean
	postFormMessage: Message
	viewerContentUuid: string
	viewerPosition: ViewerState
}
export const loadingL = Lens.fromProp<MainState>()('loading')
// This ignores "none"
export const boardsO = Optional.fromOptionProp<MainState>()('boards')
// This allows to change "none"
export const boardsL = Lens.fromProp<MainState>()('boards')
export const postFormMessageL = Lens.fromProp<MainState>()('postFormMessage')
export const viwerContentUuidL = Lens.fromProp<MainState>()('viewerContentUuid')
export const viewerPositionL = Lens.fromProp<MainState>()('viewerPosition')

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
	latestReply: number
	replies: Option<Set<number>>
}
export const latestReplyL = Lens.fromProp<ThreadState>()('latestReply')
export const repliesO = Optional.fromOptionProp<ThreadState>()('replies')
export const repliesL = Lens.fromProp<ThreadState>()('replies')

export interface Message {
	number: number
	author: string
	text: string
	tripcode: string
	date: Date
	replies: number[]
	media: FileList | string[]
}

export const textL = Lens.fromProp<Message>()('text')

export interface Board {
	id: number
	shortName: string
	name: string
	description: string
}

