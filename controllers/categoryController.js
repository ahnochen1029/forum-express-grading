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
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }
    return Category.create({ name: req.body.name })
      .then(category => {
        res.redirect('/admin/categories')
      })
  },

  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }
    return Category.findByPk(req.params.id)
      .then(category => {
        category.update(req.body)
          .then(category => {
            res.redirect('/admin/categories')
          })
      })
  },

  deleteCategory: (req, res) => {
    Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(() => res.redirect('/admin/categories'))
      })
  }

}

module.exports = categoryController