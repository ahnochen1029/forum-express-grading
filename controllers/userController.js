const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userServices = require('../services/userServices')

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
    userServices.getProfile(req, res, data => {
      return res.render('profile', data)
    })
  },

  getProfileEdit: (req, res) => {
    userServices.getProfileEdit(req, res, data => {
      return res.render('profileEdit', data)
    })
  },

  putProfile: (req, res) => {
    userServices.putProfile(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect(`/users/${user.id}`)
    })
  },

  addFavorite: (req, res) => {
    userServices.addFavorite(req, res, data => {
      req.flash('success_messages', data['message'])
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    userServices.removeFavorite(req, res, data => {
      req.flash('success_messages', data['message'])
      return res.redirect('back')
    })
  },

  likeRestaurant: (req, res) => {
    userServices.likeRestaurant(req, res, data => {
      req.flash('success_messages', data['message'])
      return res.redirect('back')
    })
  },

  unlikeRestaurant: (req, res) => {
    userServices.unlikeRestaurant(req, res, data => {
      req.flash('success_messages', data['message'])
      return res.redirect('back')
    })
  },

  getTopUser: (req, res) => {
    userServices.getTopUser(req, res, data => {
      return res.render('topUser', data)
    })
  },

  addFollowing: (req, res) => {
    userServices.addFollowing(req, res, data => {
      req.flash('success_messages', data['message'])
      return res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    userServices.removeFollowing(req, res, data => {
      req.flash('success_messages', data['message'])
      return res.redirect('back')
    })
  }
}
module.exports = userController