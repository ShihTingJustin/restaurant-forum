const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { Restaurant, Category, User } = db


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
      callback({ status: 'error', message: `name didn't exist` })
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

  putRestaurant: (req, res, callback) => {
    const { id } = req.params
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(`[ERROR]: ${err}`)
        return Restaurant.findByPk(id)
          .then(restaurant => {
            restaurant.update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: img.data.link,
              CategoryId: req.body.categoryId
            })
              .then(() => {
                callback({ status: 'success', message: 'restaurant was successfully updated' })
              })
          }).catch(err => console.log(err))
      })
    } else {
      return Restaurant.findByPk(id)
        .then(restaurant => {
          restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
            .then(() => {
              callback({ status: 'success', message: 'restaurant was successfully updated' })
            })
        }).catch(err => console.log(err))
    }
  },

  deleteRestaurant: (req, res, callback) => {
    const { id } = req.params
    return Restaurant.destroy({ where: { id } })
      .then(() => callback({ status: 'success', message: '' }))
      .catch(err => console.log(err))
  },

  getUsers: (req, res, callback) => {
    return User.findAll({ raw: true })
      .then(users => callback({ users }))
      .catch(err => console.log(err))
  },

  putUser: (req, res, callback) => {
    const { id } = req.params
    const switches = req.body.switch

    if (!switches) {
      return User.findAll({ where: { isAdmin: 1 } })
        .then(users => {
          if (users.length > 1) {
            return User.findByPk(id)
              .then(user => {
                user.update({
                  isAdmin: 0
                }).then(user => callback({ status: 'success', message: `The authority of user "${user.email}" was successfully updated` }))
                  .catch(err => console.log(err))
              }).catch(err => console.log(err))
          } else {
            return User.findByPk(id)
              .then(user => callback({ status: 'error', message: `Unable to adjust authority of user "${user.email}", at least one admin must be there.` }))
              .catch(err => console.log(err))
          }
        }).catch(err => console.log(err))
    }

    if (switches) {
      return User.findByPk(id)
        .then(user => user.update({ isAdmin: 1 }))
        .then(user => callback({ status: 'success', message: `The authority of user "${user.email}" was successfully updated` }))
        .catch(err => console.log(err))
    }
  }


}


module.exports = adminService