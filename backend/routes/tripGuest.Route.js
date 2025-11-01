const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/auth.Middleware')
const {allTripInfo,addTripGuests,getAllTripGuests} = require('../controllers/tripGuest.Controller');
router.get('/trip-Info',allTripInfo)

router.get('/getAll-tripGuests/:tripId',authMiddleware,getAllTripGuests)
router.post('/create-tripGuests',authMiddleware,addTripGuests)

module.exports = router;
