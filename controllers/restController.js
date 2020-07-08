const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ raw: true, nest: true, include: Category })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          categoryName: r.Category.name
        }))
        return res.render('restaurants', {
          restaurants: data
        })
      })
  },

  getRestaurant: (req, res) => {
    const { id } = req.params
    return Restaurant.findByPk(id, { include: Category })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
  }



}

module.exports = restController