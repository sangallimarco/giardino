import React, { Component } from 'react';
import {SocketServiceSingleton} from '../core';
import './index.css';

export default class Controls extends Component {
    constructor(props){
        super(props);
        this.state = {
            status: false
        };
    }

    componentDidMount() {
        SocketServiceSingleton.subscribe('/start', payload => {
            let {status} = payload;
            console.log(status);
            this.setState({...this.state, status});
        });
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