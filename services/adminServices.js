const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminServices = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] }).then(restaurants => {
      return callback({ restaurants })
    })
  },
  createRestaurant: (req, res, callback) => {
    return Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return callback({ categories })
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
  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          return callback({ status: 'success', message: 'restaurant was successfully created' })
        })
      })
    }
    else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then((restaurant) => {
        return callback({ status: 'success', message: 'restaurant was successfully created' })
      })
    }
  },
  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
              .then((restaurant) => {
                return callback({ status: 'success', message: 'restaurant was successfully to update' })
              })
          })
      })
    }
    else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
            .then((restaurant) => {
              return callback({ status: 'success', message: 'restaurant was successfully to update' })
            })
        })
    }
  },
  postCategories: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "category didn't exist" })
    }
    return Category.create({ name: req.body.name })
      .then(category => {
        return callback({ status: 'success', message: `create new category: ${category.name}` })
      })
  },
  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "category didn't exist" })
    }
    return Category.findByPk(req.params.id)
      .then(category => {
        category.update(req.body)
          .then(category => {
            return callback({ status: 'success', message: `update category: ${category.name}` })
          })
      })
  },
  deleteCategory: (req, res, callback) => {
    Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(() => {
            return callback({ status: 'success', message: '' })
          })
      })
  },
  editRestaurant: (req, res, callback) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            return callback({ restaurant: restaurant.toJSON(), categories })
          })
      })
  },
  getUsers: (req, res, callback) => {
    User.findAll({ raw: true, nest: true }).then(users => {
      console.log('users', users)
      return callback({ users })
    })
  },
  putUsers: (req, res, callback) => {
    User.findByPk(req.params.id)
      .then((user) => {
        user.isAdmin = !user.isAdmin
        user.save().then((user) => {
          return callback({ status: 'success', message: `User ${user.name} was changed successfully！` })
        })
      })
  },
}

module.exports = adminServices