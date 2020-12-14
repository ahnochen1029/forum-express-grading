const db = require('../models')
const Comment = db.Comment

const commentServices = {
  postComment: (req, res, callback) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    })
      .then(comment => {
        return callback({ status: 'success', message: "Comment was successfully to upload", RestaurantId: comment.RestaurantId })
      })
  },
  deleteComment: (req, res, callback) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
          .then(() => {
            return callback({ status: 'success', message: "Comment was successfully to delete", RestaurantId: comment.RestaurantId })
          })
      })
  }
}

module.exports = commentServices