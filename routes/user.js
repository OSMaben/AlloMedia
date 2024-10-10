const express = require('express');
const router = express.Router();
const userController =  require('../controllers/user');
const DashboardController =  require('../controllers/Dashboard');
const verifyOtp = require('../controllers/verifyOtp');
const verifyJwt = require('../middleware/verfiyOtpMiddleware');

router.post('/register', userController.signUp);
router.post('/login', userController.signIn);
router.post('/reset-password', userController.resetPassword)
router.post('/changePassword/:token', userController.changePassword)
router.get('/changePassword/:token', userController.changePassword)
router.get('/dashboard' ,verifyJwt, DashboardController.Dashboard);
router.post('/verify-otp', verifyJwt, verifyOtp);

module.exports = router;

