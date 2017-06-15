const {Router} = require('express');
const router = Router();
const config = require('config');
const TOTP = require('onceler').TOTP;
const Mailer = require('../libs/mailer');

router.post('/otp', (req, res, next) => {
    console.log(req.body);
    let {email} = req.body;

    if (config.get('ALLOWED').includes(email)) {
        let token = new TOTP(config.get('TOTP')).now();

        let sender = new Mailer();
        sender.send('sangalli.marco@gmail.com', email, 'password', {
            token
        }, 'otp.html');

        res.json({status: true});
    } else {
        res
            .status(403)
            .json({});
    }

});

router.post('/auth', (req, res, next) => {
    console.log(req);
});

module.exports = router;