const db = require('../models')
const helpers = require('../_helpers')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite

const pageLimit = 12

const restServices = {
  getRestaurants: (req, res, callback) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.categoryId = categoryId
    }
    Restaurant.findAndCountAll(
      {
        include: Category,
        where: whereQuery,
        offset,
        limit: pageLimit
      }
    )
      .then(result => {
        // data for pagination
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

        // clean up restaurant data
        const data = result.rows.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.dataValues.Category.name,
          isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLiked: helpers.getUser(req).LikeRestaurants.map(d => d.id).includes(r.id)
        }))
        Category.findAll({
          raw: true,
          nest: true
        }).then(categories => {
          return callback({
            restaurants: data,
            categories,
            categoryId,
            page,
            totalPage,
            prev,
            next
          })
        })
      })
  },
  getRestaurant: (req, res, callback) => {
    const ID = req.params.id
    Restaurant.findByPk(ID, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    })
      .then(restaurant => {
        const USERID = helpers.getUser(req).id
        restaurant.viewCounts = restaurant.viewCounts + 1
        restaurant.save().then(restaurant => {
          const isLiked = restaurant.LikedUsers.map(e => e.id).includes(USERID)
          const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(USERID)
          return callback({ restaurant: restaurant.toJSON(), isFavorited, isLiked })
          // return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
        })
      })
  },
  getFeeds: (req, res, callback) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      return callback({ restaurants, comments })
    })
  },
  getDashboard: (req, res, callback) => {
    const restaurantId = req.params.id
    Promise.all([
      Restaurant.findByPk(restaurantId, {
        raw: true,
        nest: true,
        include: [
          Category,
        ],
      }),
      Comment.findAndCountAll({
        raw: true,
        nest: true,
        where: { restaurantId },
        include: Restaurant
      }),
      Favorite.findAndCountAll({
        raw: true,
        nest: true,
        where: { restaurantId },
      })
    ]).then(([restaurant, comments, favorite]) => {
      return callback({ restaurant, commentsCount: comments.count, favoriteCount: favorite.rows.length })
      // return res.render('restDashboard', { restaurant, commentsCount: comments.count, favoriteCount: favorite.rows.length })
    })
  },
  getTopRestaurant: (req, res, callback) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurants => {
      restaurants = restaurants.map(d => (
        {
          ...d.dataValues,
          description: d.description.substring(0, 50),
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(d.id),
          FavoriteCount: d.FavoritedUsers.length
        }
      ))
      restaurants = restaurants.sort((a, b) => a.FavoriteCount < b.FavoriteCount ? 1 : -1).slice(0, 10)
      return callback({ restaurants, isAuthenticated: req.isAuthenticated })
    })
  }
}

module.exports = restServices