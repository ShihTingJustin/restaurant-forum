const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.json(data)
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  putRestaurant: (req, res, data) => {
    adminService.putRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  getUsers: (req, res) => {
    adminService.getUsers(req, res, data => {
      return res.json(data)
    })
  },

  putUser: (req, res) => {
    adminService.putUser(req, res, data => {
      return res.json(data)
    })
  }
}
module.exports = adminController