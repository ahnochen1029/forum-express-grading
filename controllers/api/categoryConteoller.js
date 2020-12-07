const adminServices = require('../../services/adminServices')

const categoryController = {
  getCategories: (req, res) => {
    adminServices.getCategories(req, res, data => {
      return res.json(data)
    })
  },
  postCategories: (req, res) => {
    adminServices.postCategories(req, res, data => {
      return res.json(data)
    })
  },
  putCategory: (req, res) => {
    adminServices.putCategory(req, res, data => {
      return res.json(data)
    })
  },
  deleteCategory: (req, res) => {
    adminServices.deleteCategory(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = categoryController