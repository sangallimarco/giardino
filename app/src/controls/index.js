import React, { Component } from 'react';
import {StreamManager, StreamComponent} from 'react-rxjs-stream';
import {SocketServiceSingleton} from '../core';
import Streams from '../Streams';
import Progress from 'antd/lib/progress';
import Button from 'antd/lib/button';
import Layout from 'antd/lib/layout';
import './controls.css';
const { Header, Footer, Sider, Content, Row, Col} = Layout;

export default class Controls extends StreamComponent {

    constructor(props){
        super(props);
        this.state = {
            status: false,
            percent: 0,
            icon: 'play-circle'
        };
    }

    componentDidMount() {

        this.actions  = {
            '/status': payload => {
                let {status} = payload;
                console.log('start', status);
                this.setState(Object.assign(this.state, {status}));
            }, 
            '/queue': payload => {
                let {queued, items} = payload;
                let percent = ((items - queued) / items) * 100;
                let icon = 'sync';
                console.log(percent);
                this.setState(Object.assign(this.state, {percent, icon}));
            },
            '/end': payload => {
                let icon = 'play-circle';
                this.setState(Object.assign(this.state, {icon}));
            }
        };

        SocketServiceSingleton.dispatch(this.actions);
    }

    componentWillUnmount() {
        SocketServiceSingleton.destroy(this.actions);
    }

    handleClick(evt) {
        SocketServiceSingleton.next('/start', {status: true});
    }

    render(){
        let {status, percent, icon} = this.state;

        return (
            <div className="controls">
                <div className="controls-container">
                    <Progress className="controls-progress" type="dashboard" percent={percent} />
                </div>
                <div className="controls-container">
                    <Button icon={icon} className="controls-button" type="primary" onClick={this.handleClick}></Button>
                </div>
            </div>
        );
    }
}