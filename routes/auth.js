const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controller/user');

router.get('/google', passport.authenticate('google', { scope: 'profile email' }));
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/migration/dashboard', failureRedirect: '/user/login' }));
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/migration/dashboard', failureRedirect: '/user/login' }));
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { successRedirect: '/migration/dashboard', failureRedirect: '/user/login' }));

module.exports = router;