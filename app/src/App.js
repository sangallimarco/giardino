import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Controls from './components/Controls';
import Login from './components/Login';
import {Router, Route} from 'react-router';
import {Provider} from 'mobx-react';
import {UserStore, CommandsStore} from './stores';
import DevTools from 'mobx-react-devtools';

const stores = {
  UserStore,
  CommandsStore
};

class App extends Component {
  render() {
    return (
      <div>
        <Provider {...stores}>
          <div className="App">
            <Route exact path="/" component={Login}/>
            <Route path="/controls" component={Controls}/>
          </div>
        </Provider>
        <DevTools/>
      </div>
    );
  }
}

export default App;
