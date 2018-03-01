const express = require('express');
const router = express.Router();

const homeController = require('../controller/home');
const userController = require('../controller/user');

router.get('/', homeController.index);
router.get('/about', homeController.about);

module.exports = router;