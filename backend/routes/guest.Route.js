const express = require('express');
const router = express.Router();
const {createGuest,getAllGuest} = require('../controllers/guest.Controller')
const {authMiddleware} = require('../middleware/auth.Middleware')

router.post('/create-guest',authMiddleware,createGuest)
router.get('/getAll-guest',authMiddleware,getAllGuest)
module.exports = router;