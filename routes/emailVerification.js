const express = require('express');
const router = express.Router();
const EmailController =  require('../controllers/Emailverification');
const  IsTokenValid  =  require('../middleware/CheckJWTifvalide');


router.get('/emailverification/:token',IsTokenValid.IsTokenValid, EmailController.VerifyIfUserIsValid);

module.exports = router;