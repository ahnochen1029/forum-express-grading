const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const { use } = require('chai')
const ExtractJWT = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.JwtStrategy

const userServices = require('../../services/userServices')

let userController = {
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: 'required fields did not exist' })
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.email
    let password = req.body.password

    User.findOne({ where: { email: username } })
      .then(user => {
        if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ status: 'error', message: 'passwords did not match' })
        }
        // 簽發 token
        var paylod = { id: user.id }
        var token = jwt.sign(paylod, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
          }
        })
      })
  },
  signUp: (req, res) => {
    const { name, email, password } = req.body
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      User.findOne({ where: { email: email } }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: '信箱已被註冊！' })
        } else {
          User.create({
            name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: '成功註冊帳號！' })
          })
        }
      })
    }
  },
  getProfile: (req, res) => {
    userServices.getProfile(req, res, data => {
      return res.json(data)
    })
  },
  getProfileEdit: (req, res) => {
    userServices.getProfileEdit(req, res, data => {
      return res.json(data)
    })
  },
  putProfile: (req, res) => {
    userServices.putProfile(req, res, data => {
      return res.json(data)
    })
  },
  addFavorite: (req, res) => {
    userServices.addFavorite(req, res, data => {
      return res.json(data)
    })
  },
  removeFavorite: (req, res) => {
    userServices.removeFavorite(req, res, data => {
      return res.json(data)
    })
  },
  likeRestaurant: (req, res) => {
    userServices.likeRestaurant(req, res, data => {
      return res.json(data)
    })
  },
  unlikeRestaurant: (req, res) => {
    userServices.unlikeRestaurant(req, res, data => {
      return res.json(data)
    })
  },
  getTopUser: (req, res) => {
    userServices.getTopUser(req, res, data => {
      return res.json(data)
    })
  },
  addFollowing: (req, res) => {
    userServices.addFollowing(req, res, data => {
      return res.json(data)
    })
  },
  removeFollowing: (req, res) => {
    userServices.removeFollowing(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = userController