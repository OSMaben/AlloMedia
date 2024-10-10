const express = require('express');
const router = express.Router();
const EmailController =  require('../controllers/Emailverification');
// const emailValidation  = require('../controllers/emailValidation');


router.get('/emailverification/:token', EmailController.VerifyIfUserIsValid);
// router.post('/checkOtp', emailValidation.emailValidation);



module.exports = router;