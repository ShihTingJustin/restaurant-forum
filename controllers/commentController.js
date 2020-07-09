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
  }

}

module.exports = commentController