const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body

    if (!name) {
      req.flash('error_msg', "name didn't exist")
      return res.redirect('back')
    }

    return Restaurant.create({
      name,
      tel,
      address, 
      opening_hours, 
      description
    })
    .then(restaurant => {
      req.flash('success_mgs', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    const { id } = req.params

    return Restaurant.findByPk(id,{ raw: true })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant })
      })
  }

}

module.exports = adminController