const express = require('express');
const ScheduleController = require('../controller/ScheduleController');
const router = express.Router();
router.post('/saveSchedule', ScheduleController.saveSchedule);
router.get('/getAllSchedules', ScheduleController.getAllSchedules);
router.get('/getAllScheduleAssigned', ScheduleController.getAllScheduleAssigned);
router.get('/getAllCompSchedule', ScheduleController.getAllCompSchedule);
router.delete('/deleteSchedule', ScheduleController.deleteSchedule);
router.put('/updateSchedule', ScheduleController.updateSchedule);
router.get('/getDraftCount', ScheduleController.getDraftCount);
router.get('/getAcceptCount', ScheduleController.getAcceptCount);
router.get('/getCount', ScheduleController.getCount);
router.get('/getSample', ScheduleController.getMySampleData);
router.get('/getSchedule/:customerNic', ScheduleController.getSchedule);
router.post('/sendSMS', ScheduleController.sendSMS);
router.get('/sendOneSchedule/:scheduleNo', ScheduleController.sendOneSchedule);
router.patch('/patchMileage/:scheduleNo/:progressValue', ScheduleController.patchMileage);
router.get('/getProSchedule/:id', ScheduleController.getProSchedule);
router.get('/getOneSchedule/:scheduleNo', ScheduleController.getOneSchedule);
router.get('/getCurrentScheduleByLocoNumber/:locoNumber', ScheduleController.getCurrentScheduleByLocoNumber);

router.put('/changeScheduleSeven', ScheduleController.changeScheduleSeven);
router.put('/assignedLoadTrial', ScheduleController.assignedLoadTrial);
router.post('/scheduleEmail', ScheduleController.scheduleEmail);
router.post('/scheduleLapseEmail', ScheduleController.scheduleLapseEmail);
router.get('/getAllScheduleCalendar', ScheduleController.getAllScheduleCalendar);
router.get('/getAllScheduleAssignedManager', ScheduleController.getAllScheduleAssignedManager);

//next Schedule
router.post('/saveNextSchedule', ScheduleController.saveNextSchedule);
router.post('/nextScheduleEmail', ScheduleController.nextScheduleEmail);
router.get('/getAllNextSchedules/:locoNumberNextSchedule', ScheduleController.getAllNextSchedules);
router.get('/getAllNextSchedulesNotFilter', ScheduleController.getAllNextSchedulesNotFilter);
router.get('/sendOneNextSchedule/:nxtSchId', ScheduleController.sendOneNextSchedule);
router.get('/getNxtScheduleByLocoNoAndStatus/:locoNumber/:nxtSchStatus', ScheduleController.getNxtScheduleByLocoNoAndStatus);
router.get('/updateDraftNextSchedules/:locoNumber', ScheduleController.updateDraftNextSchedules);
router.put('/changeStatusNextSchedule', ScheduleController.changeStatusNextSchedule);
router.get('/getNextAllSchedules', ScheduleController.getNextAllSchedules);
module.exports = router