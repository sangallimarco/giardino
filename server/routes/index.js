const {Router} = require('express');
const router = Router();
const config = require('config');

router.post('/otp', (req, res, next) => {
    console.log(req.body);

    res.json({});
});

router.post('/auth', (req, res, next) => {
    console.log(req);
});

module.exports = router;