const db = require('../models')
const helpers = require('../_helpers.js')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite

const pageLimit = 12

const restController = {
  getRestaurants: (req, res) => {
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
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit
    })
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
          return res.render('restaurants', {
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
  getRestaurant: (req, res) => {
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
          return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
        })
      })
  },
  getFeeds: (req, res) => {
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
      return res.render('feeds', {
        restaurants,
        comments
      })
    })
  },
  getDashboard: (req, res) => {
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
      return res.render('restDashboard', { restaurant, commentsCount: comments.count, favoriteCount: favorite.rows.length })
    })
  },
  getTopRestaurant: (req, res) => {
    Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurants => {
      restaurants = restaurants.map(r => ({
        ...r.dataValues,
        description: r.description.substring(0, 50),
        topRestaurantCount: r.FavoritedUsers.length,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))
      restaurants = restaurants.sort((a, b) => b.topRestaurantCount - a.topRestaurantCount)
      restaurants = restaurants.slice(0, 10)
      return res.render('topRestaurants', { restaurants })
    })
  }
}

module.exports = restController