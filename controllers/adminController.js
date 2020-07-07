const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const imgur = require('imgur-node-api')
const category = require('../models/category')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
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
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_msg', "name didn't exist")
      return res.redirect('back')
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
            req.flash('success_mgs', 'restaurant was successfully created')
            res.redirect('/admin/restaurants')
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
          req.flash('success_mgs', 'restaurant was successfully created')
          res.redirect('/admin/restaurants')
        })
        .catch(err => console.log(err))
    }

  },

  getRestaurant: (req, res) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant })
      })
      .catch(err => console.log(err))
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
    const { id } = req.params
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash(req.flash('error_msg', "name didn't exist"))
      return res.redirect('back')
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
                req.flash('success_msg', 'restaurant was successfully updated')
                res.redirect('/admin/restaurants')
              })
          })
          .catch(err => console.log(err))
      })
    } else {
      return Restaurant.findByPk(id)
        .then(restaurant => {
          restaurant.update(
            {
              name,
              tel,
              address,
              opening_hours,
              description,
              image: restaurant.image,
              CategoryId: req.body.categoryId
            }
          )
            .then(() => {
              req.flash('success_msg', 'restaurant was successfully updated')
              res.redirect('/admin/restaurants')
            })
        })
        .catch(err => console.log(err))
    }
  },

  deleteRestaurant: (req, res) => {
    const { id } = req.params
    return Restaurant.destroy({ where: { id } })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => console.log(err))
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then(users => {
        res.render('admin/users', { users })
      })
  },

  putUser: (req, res) => {
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
                })
                  .then(user => {
                    req.flash('success_msg', `The authority of user "${user.email}" was successfully updated`)
                    return res.redirect('/admin/users')
                  })
                  .catch(err => console.log(err))
              })
              .catch(err => console.log(err))
          } else {
            return User.findByPk(id)
              .then(user => {
                req.flash('warning_msg', `Unable to adjust authority of user "${user.email}", at least one admin must be there.`)
                return res.redirect('/admin/users')
              })
              .catch(err => console.log(err))
          }
        })
        .catch(err => console.log(err))
    }

    if (switches) {
      return User.findByPk(id)
        .then(user => {
          user.update({
            isAdmin: 1
          })
            .then(user => {
              req.flash('success_msg', `The authority of user "${user.email}" was successfully updated`)
              return res.redirect('/admin/users')
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }
  }

}

module.exports = adminController