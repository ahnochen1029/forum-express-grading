const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminServices = require('../../services/adminServices')

const adminController = {
  getRestaurants: (req, res) => {
    adminServices.getRestaurants(req, res, data => {
      return res.json(data)
    })
  },
  getRestaurant: (req, res) => {
    adminServices.getRestaurant(req, res, data => {
      return res.json(data)
    })
  },
  postRestaurant: (req, res) => {
    adminServices.postRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteRestaurant: (req, res) => {
    adminServices.deleteRestaurant(req, res, data => {
      return res.json(data)
    })
  },
  putRestaurant: (req, res) => {
    adminServices.putRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  editRestaurant: (req, res) => {
    adminServices.editRestaurant(req, res, data => {
      return res.json(data)
    })
  },
  createRestaurant: (req, res) => {
    adminServices.createRestaurant(req, res, data => {
      return res.json(data)
    })
  },
}

module.exports = adminController