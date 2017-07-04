import React, {Component} from 'react';
import Progress from 'antd/lib/progress';
import Button from 'antd/lib/button';
import Layout from 'antd/lib/layout';
import './controls.css';
import {inject, observer} from 'mobx-react';

const {
    Header,
    Footer,
    Sider,
    Content,
    Row,
    Col
} = Layout;

@inject('CommandsStore', 'UserStore') 
@observer
export default class Controls extends Component {

    handlePlay() {
        this
            .props
            .CommandsStore
            .start();
    }

    handleStop() {
        this
            .props
            .CommandsStore
            .stop();
    }

    render() {
        let {CommandsStore, UserStore} = this.props;
        let {status, percent} = CommandsStore;
        let {email} = UserStore;
        let icon = status
            ? 'sync'
            : 'caret-right';

        return (
            <div className="controls">
                <h1>{email}</h1>
                <div className="controls-container">
                    <Progress className="controls-progress" type="dashboard" percent={percent}/>
                </div>
                <div className="controls-container">
                    <Button
                        icon={icon}
                        className="controls-button"
                        type="primary"
                        onClick={(evt) => this.handlePlay()}></Button>
                </div>
                <div className="controls-container">
                    <Button
                        icon="close"
                        className="controls-button controls-button-danger"
                        type="danger"
                        onClick={(evt) => this.handleStop()}></Button>
                </div>
            </div>
        );
    }
}