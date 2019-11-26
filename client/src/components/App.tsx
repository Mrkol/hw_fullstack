import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import ThreadPage from './threadpage/ThreadPage'
import BoardPage from './boardpage/BoardPage'
import StartPage from './startpage/StartPage'


const App = ({store, history}: any) => (
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<Switch>
				<Route path="/:board/:id" component={ThreadPage}/>
				<Route path="/:board" component={BoardPage}/>
				<Route path="/" component={StartPage}/>
			</Switch>
		</ConnectedRouter>
	</Provider>
)

export default App
