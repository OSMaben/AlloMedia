const express = require('express');
const router = express.Router();
const userController =  require('../controllers/user');
const DashboardController =  require('../controllers/Dashboard');
const IsLoginValid = require('../middleware/IsLoginValid');



router.post('/register', userController.signUp);
router.post('/login', userController.signIn);

router.get('/dashboard' ,IsLoginValid, DashboardController.Dashboard);


module.exports = router;