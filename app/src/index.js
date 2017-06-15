import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {MemoryRouter, Route} from 'react-router';
import {httpProvider} from 'barbarojs-http';

// setting middlewares
httpProvider.use(req => {
    return new Promise((resolve, reject) => {
        if (req.status >= 400) {
            reject(req);
        } else {
            resolve(req);
        }
    });
});

ReactDOM.render((
    <MemoryRouter>
        <Route path="/" component={App}></Route>
    </MemoryRouter>
), document.getElementById('root'));
registerServiceWorker();
