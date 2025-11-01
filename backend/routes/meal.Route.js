const express = require('express');
const router = express.Router();

const {authMiddleware} = require('../middleware/auth.Middleware')
const {createMeal,getAllMeals} =require('../controllers/meal.Controller');
// router.post('/login',register)
router.post('/create-meal/:tripId',authMiddleware,createMeal)
router.get('/getAll-meals/:tripId',authMiddleware,getAllMeals)

module.exports =  router 