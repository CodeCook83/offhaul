const express = require('express');
const router = express.Router();

const migrationController = require('../controller/migration');
const userController = require('../controller/user');

//router.get('/dashboard', userController.ensureAuthenticated, homeController.dashboard);
router.get('/dashboard', migrationController.dashboardGet);
router.post('/dashboard', migrationController.dashboardPost);
router.get('/mainmenu', migrationController.mainGet);
router.post('/mainmenu', migrationController.mainPost);
router.get('/imap', migrationController.imapGet);
router.post('/imap', migrationController.imapPost);
router.get('/selectfolder', migrationController.selectFolderGet);
router.post('/selectfolder', migrationController.selectFolderPost);

router.get('/testconnection', migrationController.testConnectionGet);

module.exports = router;