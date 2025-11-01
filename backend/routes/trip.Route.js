const express = require('express');
const router = express.Router();
const {register,login,tokenRecover} = require('../controllers/authControllers')
const { PrismaClient } = require('../generated/prisma')
const {createTrip,getTripByUserID} =require('../controllers/trip.Controller')
const {authMiddleware} = require('../middleware/auth.Middleware')
const prisma = new PrismaClient();
// router.post('/login',register)
router.post('/create-trip',authMiddleware,createTrip)
router.get('/getTrip',authMiddleware,getTripByUserID)
// router.post()
module.exports = router;