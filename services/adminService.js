const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
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

  postRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      callback({
        status: 'error', message: `name didn't exist`
      })
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(`[ERROR]: ${err}`)
        return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: img.data.link,
          CategoryId: req.body.categoryId
        })
          .then(() => {
            callback({ status: 'success', message: 'restaurant was successfully created' })
          })
          .catch(err => console.log(err))
      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null,
        CategoryId: req.body.categoryId
      })
        .then(() => {
          callback({ status: 'success', message: 'restaurant was successfully created' })
        })
        .catch(err => console.log(err))
    }

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
  },

  deleteRestaurant: (req, res, callback) => {
    const { id } = req.params
    return Restaurant.destroy({ where: { id } })
      .then(() => callback({ status: 'success', message: '' }))
      .catch(err => console.log(err))
  }

}


module.exports = adminService