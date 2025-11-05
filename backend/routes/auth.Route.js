const express = require('express');
const router = express.Router();
const {register,login,tokenRecover,logout} = require('../controllers/authControllers')
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();
// router.post('/login',register)
router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.post('/refreshToken',tokenRecover)

module.exports = router;
