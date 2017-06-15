import {http} from 'barbarojs-http';
import SocketService from './SocketService';

class LoginServiceClass {

    // request OTP, nodejs will send an email to the user
    requestOTP(email) {
        let conn = new http('/api/otp');
        return conn.post({email});
    }

    // send OTP to server and get JWT back
    requestToken(email, otp) {
        let conn = new http('/api/token');
        return conn
            .post({email, otp})
            .then(res => res.json())
            .then(data => {
                let {token} = data;
                // connect using the new token
                return SocketService.init(token);
            });
    }

}

const LoginService = new LoginServiceClass();

export default LoginService;