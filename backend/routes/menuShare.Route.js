const express = require('express');
const router = express.Router();


const {createMenuShare,getMenuShareInfo,getParticipantSummary} = require('../controllers/menuShare.Controller')
const {authMiddleware} = require('../middleware/auth.Middleware')
router.post('/createMenuShare',authMiddleware,createMenuShare)
router.get('/:mealId/getMenuShareInfo',getMenuShareInfo)
router.get('/:mealId/getParticipantSummarySplit',getParticipantSummary)
module.exports = router ;