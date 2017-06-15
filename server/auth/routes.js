const {Router} = require('express');
const router = Router();
const AuthService = require('./auth_service');

router.post('/otp', (req, res, next) => {
    let {email} = req.body;
    AuthService.requestOTP(email);
    res.json({});
});

router.post('/token', (req, res, next) => {
    let {email, otp} = req.body;
    let verified = AuthService.verifyOTP(otp);

    if (verified) {
        let token = AuthService.generateJWT(email);
        res.json({token});
    } else {
        res
            .status(403)
            .json({});
    }

});

module.exports = router;