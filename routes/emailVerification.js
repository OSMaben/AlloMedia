const express = require('express');
const router = express.Router();
const EmailController =  require('../controllers/Emailverification');

router.get('/emailverification/:token', EmailController.VerifyIfUserIsValid);




module.exports = router;