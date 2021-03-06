const express = require('express');
const UserController = require('../controller/UserController');
const router = express.Router();
router.post('/signUp', UserController.register);
router.get('/getAllUsers', UserController.getAllUsers);
router.get('/getMangers', UserController.getManagers);
router.get('/loginUser', UserController.loginUser);
router.get('/getUser/:id', UserController.getUser);
router.get('/getUserByNic/:userNic', UserController.getUserByNic);
router.post('/sendMails', UserController.sendMails);
router.post('/req-reset-password', UserController.requestPassword);
router.post('/newPass', UserController.newPassword);
router.post('/valid-password-token', UserController.validPasswordToken);
router.post('/sendPassEmail', UserController.sendPassEmail);
router.get('/getUsers', UserController.getAllUserNew);
router.delete('/deleteUser', UserController.deleteUser);
router.put('/updateUser', UserController.updateUser);

router.get('/getOneMan/:managerName', UserController.getOneMan);
router.get('/getOneSup/:supervisorName', UserController.getOneSup);
router.get('/getUserInfo', UserController.getUserInfo);
router.put('/editUser', UserController.editUser);
router.get('/getOneUser/:id', UserController.getOneUser);
module.exports = router;