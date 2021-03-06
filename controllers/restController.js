const restServices = require('../services/restServices')

const restController = {
  getRestaurants: (req, res) => {
    restServices.getRestaurants(req, res, data => {
      return res.render('restaurants', data)
    })
  },
  getRestaurant: (req, res) => {
    restServices.getRestaurant(req, res, data => {
      return res.render('restaurant', data)
    })
  },
  getFeeds: (req, res) => {
    restServices.getFeeds(req, res, data => {
      return res.render('feeds', data)
    })
  },
  getDashboard: (req, res) => {
    restServices.getDashboard(req, res, data => {
      return res.render('restDashboard', data)
    })
  },
  getTopRestaurant: (req, res) => {
    restServices.getTopRestaurant(req, res, data => {
      res.render('topRestaurants', data)
    })
  },
}

module.exports = restController