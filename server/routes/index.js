const {Router} = require('express');
const router = Router();

router.post('/otp', (req, res, next) => {
    console.log(req);
});


router.post('/auth', (req, res, next) => {
    console.log(req);
});

module.exports = router;