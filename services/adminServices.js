const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminServices = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] }).then(restaurants => {
      return callback({ restaurants })
    })
  }
}

module.exports = adminServices