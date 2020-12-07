const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminServices = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] }).then(restaurants => {
      return callback({ restaurants })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then((restaurant) => {
      return callback({ restaurant: restaurant.toJSON() })
    })
  },
  getCategories: (req, res, callback) => {
    return Category.findAll({ raw: true, nest: true })
      .then(categories => {
        if (req.params.id) {
          Category.findByPk(req.params.id)
            .then(category => { return callback({ categories, category: category.toJSON() }) })
        } else {
          return callback({ categories })
        }
      })
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then(() => {
            callback({ status: 'success', message: '' })
          })
      })
  },
}

module.exports = adminServices