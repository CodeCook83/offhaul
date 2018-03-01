const express = require('express');
const router = express.Router();

const providerController = require('../controller/provider');
const userController = require('../controller/user');

//router.get('/dashboard', userController.ensureAuthenticated, homeController.dashboard);
router.get('/', providerController.index);
router.get('/:id', providerController.providerSingleGet);
router.put('/addorupdate', providerController.addOrUpdatePut);
router.delete('/:id', providerController.providerDelete);

module.exports = router;