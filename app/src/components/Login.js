import React, {Component} from 'react';
import LoginService from '../core/LoginService';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Alert from 'antd/lib/alert';
import './login.css';
import {observer, inject} from 'mobx-react';

@inject('stores')
@observer
export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: null,
            otp: null,
            insertCode: false,
            error: null
        };
    }

    handleEmail(evt) {
        let email = evt.target.value;
        // check format here
        if (email) {
            this.setState(Object.assign(this.state, {email, error: false}));
            LoginService
                .requestOTP(email)
                .then(res => {
                    this.setState(Object.assign(this.state, {insertCode: true}));
                })
                .catch(err => {
                    this.setState(Object.assign(this.state, {error: 'Email Error'}));
                });
        }
    }

    handleSubmit(evt) {
        let otp = evt.target.value;
        let {email} = this.state;
        LoginService
            .requestToken(email, otp)
            .then(res => {

                // set token in the store
                this
                    .props
                    .stores
                    .user
                    .setToken(res);

                const location = {
                    pathname: '/controls',
                    state: {}
                };

                this
                    .props
                    .history
                    .push(location);
            })
            .catch(err => {
                this.setState(Object.assign(this.state, {error: 'Code Error'}));
            });
    }

    handleTest() {}

    renderEmail() {
        return (<Input
            type="email"
            name="email"
            id="email"
            autoFocus
            size="large"
            placeholder="Email"
            onPressEnter={(evt) => this.handleEmail(evt)}/>);
    }

    renderCode() {
        let autoFocus
        return (<Input
            type="number"
            defaultValue=""
            autoComplete="nope"
            autoFocus
            id="otp"
            name="otp"
            size="large"
            placeholder="Code"
            onPressEnter={(evt) => this.handleSubmit(evt)}/>);
    }

    renderError(message) {
        return (<Alert message={message} type="error" showIcon/>);
    }

    render() {

        let {insertCode, error} = this.state;
        let input = insertCode
            ? this.renderCode()
            : this.renderEmail();
        let alert = error
            ? this.renderError(error)
            : '';

        let {user} = this.props.stores;
        let {details} = user;

        return (
            <div className="login" onClick={() => this.handleTest()}>
                {user.details.email}
                <div className="login-card">
                    <div className="login-title">Please Login</div>
                    {input}
                    {alert}
                </div>
            </div>
        );
    }
}