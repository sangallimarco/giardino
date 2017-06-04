import React, { Component } from 'react';
import {SocketServiceSingleton} from '../core';

export default class Controls extends Component {


    componentDidMount() {
        SocketServiceSingleton.subscribe('server', (data)=>{
            console.log(data);
        });
    }

    handleClick(evt) {
        console.log(evt);
        SocketServiceSingleton.next('client', {status: true});
    }

    render(){
        return (
            <button onClick={this.handleClick}>Test</button>
        );
    }
}