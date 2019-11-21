import React from "react";
import ReactDOM from "react-dom";

import App from './components/App'
import './index.css'
import { store, history } from './state/store'


ReactDOM.render(
	<App store={store} history={history}/>,
	document.getElementById("root"));
