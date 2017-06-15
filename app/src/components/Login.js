import React, {Component} from 'react';
import LoginService from './LoginService';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import './login.css';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: null,
            otp: null,
            insertCode: false
        };
    }

    handleEmail(evt) {
        let email = evt.target.value;
        // check format here
        if (email) {
            let state = Object.assign(this.state, {email, insertCode: true});

            this.setState(state);
            LoginService.requestOTP(email);
        }
    }

    handleSubmit(evt) {
        let otp = evt.target.value;
        let {email} = this.state;
        LoginService.requestToken(email, otp);
    }

    render() {

        let {insertCode} = this.state;

        return (
            <div className="login">
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onPressEnter={(evt) => this.handleEmail(evt)}/>
                <Input
                    type="text"
                    name="otp"
                    disabled={!insertCode}
                    placeholder="Code (check your email)"
                    onPressEnter={(evt) => this.handleSubmit(evt)}/>
            </div>
        );
    }
}