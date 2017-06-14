const {Router} = require('express');
const router = Router();
const config = require('config');
const oneceler = require('onceler');
const mailer = require('../libs/mailer');

router.post('/otp', (req, res, next) => {
    console.log(req.body);
    let {email} = req.body;

    if (config.get('ALLOWED').includes(email)) {
        let token = oneceler.TOTP(config.get('TOTP'));
        let sender = new mailer('garder@local', email);
        sender.
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