import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import boardReducer from './boardReducer'

const createRootReducer = (history: any) => combineReducers({
	router: connectRouter(history),
	board: boardReducer
})

export default createRootReducer
