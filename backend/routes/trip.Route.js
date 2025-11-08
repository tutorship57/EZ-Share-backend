const express = require('express');
const router = express.Router();
const {register,login,tokenRecover} = require('../controllers/authControllers')
const { PrismaClient } = require('../generated/prisma')
const {createTrip,getTripByUserID,deleteTrip} =require('../controllers/trip.Controller')
const {authMiddleware} = require('../middleware/auth.Middleware')
const prisma = new PrismaClient();

router.post('/create-trip',authMiddleware,createTrip)
router.get('/getTrip',authMiddleware,getTripByUserID)
router.delete('/delete-trip/:tripId',authMiddleware,deleteTrip)

module.exports = router;