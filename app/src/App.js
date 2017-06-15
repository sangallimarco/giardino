import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Controls from './components/Controls';
import Login from './components/Login';
import {Router, Route} from 'react-router';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" component={Login}/>
        <Route path="/controls" component={Controls}/>
      </div>
    );
  }
}

export default App;
