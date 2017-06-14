import React, {Component} from 'react';
import LoginService from './LoginService';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: null,
            otp: null
        };
    }

    handleEmail(evt) {
        let email = evt.target.value;
        let state = Object.assign(this.state, {email});
        this.setState(state);

        if (evt.key === 'Enter') {
            LoginService.requestOTP(email);
        }
    }

    handleSubmit() {
        // LoginService.requestOTP();
    }

    render() {
        return (<input
            type="email"
            name="email"
            placeholder="Email"
            onKeyPress={(evt) => this.handleEmail(evt)}/>);
    }

}