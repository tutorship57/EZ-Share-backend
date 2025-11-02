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
router.get("/getTokenTest", (req, res) => {
        const {user_id}= req.body
        try {
          const accessToken = jwt.sign({ id: user_id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
          res.status(200).json({ accessToken });
        } catch (error) {
          res.status(500).json({ message: "Internal server error" });
        }
});

module.exports = router;
