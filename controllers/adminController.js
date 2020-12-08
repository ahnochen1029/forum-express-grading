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
    adminServices.createRestaurant(req, res, data => {
      return res.render('admin/create', data)
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
    adminServices.editRestaurant(req, res, data => {
      return res.render('admin/create', data)
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
    adminServices.getUsers(req, res, data => {
      return res.render('admin/users', data)
    })
  },

  putUsers: (req, res) => {
    adminServices.putUsers(req, res, data => {
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/users')
    })
  }
}

module.exports = adminController