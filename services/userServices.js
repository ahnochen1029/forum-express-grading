const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userServices = {
  getProfile: (req, res, callback) => {
    const UserId = req.params.id
    User.findByPk(UserId, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Comment, include: [Restaurant] },
        { model: Restaurant, as: 'FavoritedRestaurants' }
      ]
    }).then(user => {
      const profile = user.toJSON()
      profileComments = user.toJSON().Comments.map(r => r.Restaurant)
      const uniqueComment = profileComments.filter((element, index, array) => {
        return array.findIndex(ele => ele.RestaurantId === element.RestaurantId) === index
      })
      return callback({ profile, profileComments: uniqueComment })
    })
  },
  getProfileEdit: (req, res, callback) => {
    User.findByPk(req.params.id)
      .then(user => {
        return callback({ user: user.toJSON() })
      })
  },
  putProfile: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "Name didn't exist" })
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image,
            })
              .then((user) => {
                return callback({ status: 'success', message: "User was successfully to update" })
              })
          })
      })
    }
    else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image,
          })
            .then((user) => {
              return callback({ status: 'success', message: "User was successfully to update" })
            })
        })
    }
  },
  addFavorite: (req, res, callback) => {
    Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return callback({ status: 'success', message: "Restaurant was successfully to add in your favorite list" })
    })
  },
  removeFavorite: (req, res, callback) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      favorite.destroy()
        .then(restaurant => {
          return callback({ status: 'success', message: "Restaurant was successfully to remove from your favorite list" })
        })
    })
  },
  likeRestaurant: (req, res, callback) => {
    Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return callback({ status: 'success', message: `Like restaurant` })
    })
  },
  unlikeRestaurant: (req, res, callback) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    }).then(like => {
      like.destroy()
        .then(restaurant => {
          return callback({ status: 'success', message: `Dislike restaurant` })
        })
    })
  },
  getTopUser: (req, res, callback) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return callback({ users })
    })
  },
  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
    }).then(followship => {
      return callback({ status: 'success', message: `Add Following` })
    })
  },
  removeFollowing: (req, res, callback) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    }).then(followship => {
      followship.destroy()
        .then(followship => {
          return callback({ status: 'success', message: `Remove Following` })
        })
    })
  }
}
module.exports = userServices