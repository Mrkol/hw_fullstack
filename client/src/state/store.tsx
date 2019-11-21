import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware, compose } from 'redux'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'

import createRootReducer from './rootReducer'
import rootSaga from './sagas'


const sagaMiddleware = createSagaMiddleware()
export const history = createBrowserHistory()

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
	createRootReducer(history),
	composeEnhancers(applyMiddleware(sagaMiddleware),
		applyMiddleware(routerMiddleware(history))))

sagaMiddleware.run(rootSaga)
