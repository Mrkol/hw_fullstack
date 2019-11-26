import * as O from 'fp-ts/es6/Option'
import { Lens, Optional } from 'monocle-ts'
import { flow } from 'fp-ts/es6/function'

import * as M from './MainState'
import * as R from './RootState'
import { mapL } from '../util'


// High-level lenses and selectors

export const boards = () => M.boardsO

export const threads = ({board}: {board: string}) =>
	M.boardsO
		.compose(mapL<string, M.BoardState>(board))
		.compose(M.threadsO)

export const thread = ({board, thread}: {board: string, thread: number}) =>
	M.boardsO
		.compose(mapL<string, M.BoardState>(board))
		.compose(M.threadsO)
		.compose(mapL<number, M.ThreadState>(thread))
		.compose(M.repliesO)

export const focusFromRoot =
	<T,>(lens: Lens<M.MainState, T>) => R.mainL.compose(lens)

export const focusOptionalFromRoot =
	<T,>(lens: Optional<M.MainState, T>) => R.mainL.composeOptional(lens)

export const isSome =
	<S, T>(lens: Optional<S, T>) => flow(lens.getOption, O.isSome)
