const express = require('express');
const router = express.Router();
const {createMenuShare,getMenuShareInfo,getParticipantSummary,editMenuShare} = require('../controllers/menuShare.Controller')
const {authMiddleware} = require('../middleware/auth.Middleware')


router.post('/createMenuShare',authMiddleware,createMenuShare)
router.get('/:mealId/getMenuShareInfo',authMiddleware,getMenuShareInfo)
router.get('/:mealId/getParticipantSummarySplit',authMiddleware,getParticipantSummary)
router.patch('/editMenuShare',authMiddleware,editMenuShare)

module.exports = router ;