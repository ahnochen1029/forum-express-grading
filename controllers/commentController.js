const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    })
      .then(comment => {
        // res.redirect(`/restaurants/${req.body.restaurantId}`)
        res.redirect(`/restaurants/${comment.RestaurantId}`)
      })
  },
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        console.log('comment', comment)
        comment.destroy()
          .then(comment => {
            console.log('comment2', comment)
            res.redirect(`/restaurants/${comment.RestaurantId}`)
          })
      })
  }
}

module.exports = commentController