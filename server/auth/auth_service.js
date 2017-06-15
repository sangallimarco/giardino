const config = require('config');
const TOTP = require('onceler').TOTP;
const Mailer = require('../libs/mailer');
const JWT = require('jsonwebtoken');
const secret = config.get('SECRET');

class AuthService {

    getOTP() {
        return new TOTP(config.get('TOTP'), null, 120);
    }

    requestOTP(email) {
        if (config.get('ALLOWED').includes(email)) {
            let otp = this.getOTP();
            let token = otp.now();
            let sender = new Mailer();
            sender.send('sangalli.marco@gmail.com', email, 'password', {
                token
            }, 'otp.html');
            return true;
        } else {
            return false;
        }
    }

    verifyOTP(token) {
        let otp = this.getOTP();
        return otp.verify(token);
    }

    generateJWT(email) {
        return JWT.sign({
            email
        }, secret);
    }

    verifyJWT(token) {
        JWT.verify(token, secret);
    }

}

module.exports = new AuthService();