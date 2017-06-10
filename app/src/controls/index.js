import React, { Component } from 'react';
import {SocketServiceSingleton} from '../core';
import Progress from 'antd/lib/progress';
import Button from 'antd/lib/button';
import './index.css';
import Layout from 'antd/lib/layout';
const { Header, Footer, Sider, Content } = Layout;

export default class Controls extends Component {

    constructor(props){
        super(props);
        this.state = {
            status: false,
            percent: 0
        };
        this.actions = {};
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
                console.log(percent);
                this.setState(Object.assign(this.state, {percent}));
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

    renderIcon(value) {
        return value ? 'iconOn': 'iconOff';
    }

    render(){
        let {status, percent} = this.state;
        let icon = this.renderIcon(status);

        return (
            <div>
                <Layout>
                    <Header>Fun Watering! 2</Header>
                    <Content><Progress type="dashboard" percent={percent} /></Content>
                    <Footer><Button type="primary" onClick={this.handleClick}>Test</Button></Footer>
                </Layout>
            </div>
        );
    }
}