const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controller/user');

router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);
router.get('/logout', userController.ensureAuthenticated, userController.logout);  
router.get('/signup', userController.signupGet);
router.post('/signup', userController.signupPost);
router.get('/forgot', userController.forgotGet);
router.post('/forgot', userController.forgotPost);
router.get('/reset/:token', userController.resetGet);
router.post('/reset/:token', userController.resetPost);
router.get('/account', userController.ensureAuthenticated, userController.accountGet);
router.put('/account', userController.ensureAuthenticated, userController.accountPut);
router.delete('/account',userController.ensureAuthenticated,  userController.accountDelete);
router.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);


module.exports = router;