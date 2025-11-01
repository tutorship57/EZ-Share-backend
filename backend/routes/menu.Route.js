const express = require('express');
const router = express.Router();

const {createMenu,getAllMenu} = require('../controllers/menu.Controller')

router.post('/:mealId/createMenu',createMenu)
router.get('/:mealId/getAllMenu',getAllMenu)



module.exports = router ;