import {http} from 'barbarojs-http';

class LoginService {

    // request OTP, nodejs will send an email to the user
    requestOTP(email) {
        let conn = new http('/otp');
        return conn.post({email});
    }

    // send OTP to server and get JWT back
    requestToken(otp) {
        let conn = new http('/token');
        return conn.post({otp});
    }

}

const singleton = new LoginService();
export default {
    LoginService : singleton
};