const express = require('express');
const router = express.Router();
const {createMenuShare,getMenuShareInfo,getParticipantSummary,editMenuShare,deleteMenuShare} = require('../controllers/menuShare.Controller')
const {authMiddleware} = require('../middleware/auth.Middleware')


router.post('/createMenuShare',authMiddleware,createMenuShare)
router.get('/:mealId/getMenuShareInfo',authMiddleware,getMenuShareInfo)
router.get('/:mealId/shareCount',authMiddleware,getMenuShareInfo)
router.get('/:mealId/getParticipantSummarySplit',authMiddleware,getParticipantSummary)
router.patch('/editMenuShare',authMiddleware,editMenuShare)
router.delete('/:menuId/deleteMenuShare',authMiddleware,deleteMenuShare)
module.exports = router ;