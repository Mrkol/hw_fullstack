import { RouterState } from 'connected-react-router'
import { Lens } from 'monocle-ts'

import { MainState } from './MainState'

export default interface RootState {
	board: MainState,
	router: RouterState
}
export const mainL = Lens.fromProp<RootState>()('board')
