const commentServices = require('../services/commentServices')

const commentController = {
  postComment: (req, res) => {
    commentServices.postComment(req, res, data => {
      req.flash('success_messages', data['message'])
      res.redirect(`/restaurants/${data['RestaurantId']}`)
    })
  },
  deleteComment: (req, res) => {
    commentServices.deleteComment(req, res, data => {
      req.flash('success_messages', data['message'])
      res.redirect(`/restaurants/${data['RestaurantId']}`)
    })
  }
}

module.exports = commentController