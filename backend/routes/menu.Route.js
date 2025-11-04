const express = require('express');
const router = express.Router();

const {createMenu,getAllMenu} = require('../controllers/menu.Controller');
const { authMiddleware } = require('../middleware/auth.Middleware');

router.post('/:mealId/createMenu',authMiddleware,createMenu)
router.get('/:mealId/getAllMenu',authMiddleware,getAllMenu)



module.exports = router ;