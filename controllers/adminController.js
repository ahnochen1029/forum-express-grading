const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminServices = require('../services/adminServices')

const adminController = {
  getRestaurants: (req, res) => {
    adminServices.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return res.render('admin/create', { categories })
      })
  },

  postRestaurant: (req, res) => {
    adminServices.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    adminServices.getRestaurant(req, res, data => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            return res.render('admin/create', {
              restaurant: restaurant.toJSON(),
              categories
            })
          })
      })
  },

  putRestaurant: (req, res) => {
    adminServices.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminServices.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('/admin/restaurants')
      }
    })
  },

  getUsers: (req, res) => {
    User.findAll({ raw: true, nest: true }).then(users => {
      res.render('admin/users', { users })
    })
  },

  putUsers: (req, res) => {
    User.findByPk(req.params.id)
      .then((user) => {
        user.isAdmin = !user.isAdmin
        user.save().then((user) => {
          req.flash('success_messages', `User ${user.name} was changed successfully！`)
          res.redirect('/admin/users')
        })
      })
      .catch(error => console.log(error))
  }
}

module.exports = adminController