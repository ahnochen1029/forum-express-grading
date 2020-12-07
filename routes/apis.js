const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryConteoller')

router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurant/:id', adminController.getRestaurant)
router.get('/admin/categories', categoryController.getCategories)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

module.exports = router