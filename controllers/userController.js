const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password } = req.body
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', "信箱已經被註冊！")
          return res.redirect('/signup')
        } else {
          User.create({
            name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },

  getProfile: (req, res) => {
    const UserId = req.params.id
    User.findByPk(req.params.id)
      .then(user => {
        Comment.findAndCountAll({
          raw: true,
          nest: true,
          include: Restaurant,
          where: { UserId }
        }).then(result => {
          const commentOfRest = result.rows.map(commentsOfRest => commentsOfRest.Restaurant)
          res.render('profile', {
            user: user.toJSON(),
            count: result.count,
            commentOfRest
          })
        })
      })
  },
  getProfileEdit: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        res.render('profileEdit')
      })
  },
  putProfile: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
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
                req.flash('success_messages', 'User was successfully to update')
                res.redirect(`/users/${user.id}`)
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
              req.flash('success_messages', 'User was successfully to update')
              res.redirect(`/users/${user.id}`)
            })
        })
    }
  },
  addFavorite: (req, res) => {
    Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return res.redirect('back')
    })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      favorite.destroy()
        .then(restaurant => {
          return res.redirect('back')
        })
    })
  }
}
module.exports = userController