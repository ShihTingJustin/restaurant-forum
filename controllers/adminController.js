const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        return res.render('admin/create', { categories })
      })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_msg', data.message)
        return res.redirect('back')
      }
      req.flash('success_msg', data.message)
      return res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    const { id } = req.params
    Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        return Restaurant.findByPk(id, { raw: true })
          .then(restaurant => {
            return res.render('admin/create', { restaurant, categories })
          })
          .catch(err => console.log(err))
      })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_msg', data.message)
        return res.redirect('back')
      }
      req.flash('success_msg', data.message)
      return res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  getUsers: (req, res) => {
    adminService.getUsers(req, res, data => {
      return res.render('admin/users', data)
    })
  },

  putUser: (req, res) => {
    adminService.putUser(req, res, data => {
      if (data.status === 'error') {
        req.flash('warning_msg', data.message)
        return res.redirect('/admin/users')
      }

      if (data.status === 'success') {
        req.flash('success_msg', data.message)
        return res.redirect('/admin/users')
      }
    })
  }

}

module.exports = adminController