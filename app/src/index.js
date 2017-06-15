import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import createHistory from 'history/createBrowserHistory';
import {Router, Route} from 'react-router';
const hashHistory = createHistory();

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
    </Router>
), document.getElementById('root'));
registerServiceWorker();
