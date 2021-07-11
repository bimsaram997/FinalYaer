const express = require('express');
const loadTrialController = require('../controller/LoadTrialController');
const router = express.Router();

router.post('/saveLoadTrial', loadTrialController.saveLoadTrial);
router.get('/getAllLoadTrial', loadTrialController.getAllLoadTrial);
router.get('/getOneLoad/:id', loadTrialController.getOneLoad);
router.put('/addComment', loadTrialController.addComment);
module.exports = router;