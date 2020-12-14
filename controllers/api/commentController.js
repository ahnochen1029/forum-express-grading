const commentServices = require('../../services/commentServices')

const commentController = {
  postComment: (req, res) => {
    commentServices.postComment(req, res, data => {
      return res.json(data)
    })
  },
  deleteComment: (req, res) => {
    commentServices.deleteComment(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = commentController