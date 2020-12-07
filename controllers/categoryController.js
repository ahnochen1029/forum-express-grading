const db = require('../models')
const Category = db.Category

const adminServices = require('../services/adminServices')

const categoryController = {
  getCategories: (req, res) => {
    adminServices.getCategories(req, res, data => {
      return res.render('admin/categories', data)
    })
  },

  postCategories: (req, res) => {
    adminServices.postCategories(req, res, data => {
      if (data['status' === 'error']) {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res) => {
    adminServices.putCategory(req, res, data => {
      if (data['status' === 'error']) {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  },

  deleteCategory: (req, res) => {
    adminServices.deleteCategory(req, res, data => {
      if (data['status'] === 'success') {
        res.redirect('/admin/categories')
      }
    })
  }

}

module.exports = categoryController