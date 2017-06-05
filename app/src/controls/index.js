import React, { Component } from 'react';
import {SocketServiceSingleton} from '../core';
import './index.css';

export default class Controls extends Component {
    constructor(props){
        super(props);
        this.state = {
            status: false
        };
        this.actions = {};
    }

    componentDidMount() {

        this.actions  = {
            '/status': payload => {
                let {status} = payload;
                console.log('start', status);
                this.setState({...this.state, status});
            }, 
            '/queue': payload => {
                console.log(payload);
            }
        };

        SocketServiceSingleton.dispatch(this.actions);
    }

    componentWillUnmount() {
        SocketServiceSingleton.destroy(this.actions);
    }

    handleClick(evt) {
        console.log(evt);
        SocketServiceSingleton.next('/start', {status: true});
    }

    renderIcon(value) {
        return value ? 'iconOn': 'iconOff';
    }

    render(){
        let {status} = this.state;
        let icon = this.renderIcon(status);

        return (
            <div>
                <button onClick={this.handleClick}>Test</button>
                <div>{icon}</div>
            </div>
        );
    }
}