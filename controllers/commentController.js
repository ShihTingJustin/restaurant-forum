const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    })
    .then(() => res.redirect(`/restaurants/${req.body.restaurantId}`))
    .catch(err => console.log(err))
  },

  deleteComment: (req, res) => {
    const { id } = req.params
    return Comment.findByPk(id)
      .then(comment => comment.destroy())
      .then(comment => res.redirect(`/restaurants/${comment.RestaurantId}`))
  }

}

module.exports = commentController