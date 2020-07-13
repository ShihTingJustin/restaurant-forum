const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      callback({ restaurants })
    }).catch(err => console.log(err))
  },

  getRestaurant: (req, res, callback) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurant => {
      callback({ restaurant })
    }).catch(err => console.log(err))
  }
}

module.exports = adminService