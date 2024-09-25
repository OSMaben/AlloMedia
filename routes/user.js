const express = require('express');
const router = express.Router();
const userControler =  require('../controllers/user');

router.post('/register', userControler.signUp);
router.post('/login', userControler.signIn);

module.exports = router;