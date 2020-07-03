const fs = require('fs')
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
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log(`[ERROR]: ${err}`)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: `/upload/${file.originalname}`
          })
            .then(() => {
              req.flash('success_mgs', 'restaurant was successfully created')
              res.redirect('/admin/restaurants')
            })
            .catch(err => console.log(err))
        })
      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null
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
    return Restaurant.findByPk(id, { raw: true })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant })
      })
      .catch(err => console.log(err))
  },

  editRestaurant: (req, res) => {
    const { id } = req.params
    return Restaurant.findByPk(id, { raw: true })
      .then(restaurant => {
        return res.render('admin/create', { restaurant })
      })
      .catch(err => console.log(err))
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
      fs.readFile(file.path, (err, data) => {
        if (err) console.log(`[ERROR]: ${err}`)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.findByPk(id)
            .then(restaurant => {
              restaurant.update({
                name,
                tel,
                address,
                opening_hours,
                description,
                image: `/upload/${file.originalname}`
              })
                .then(() => {
                  req.flash('success_messages', 'restaurant was successfully updated')
                  res.redirect('/admin/restaurants')
                })
            })
            .catch(err => console.log(err))
        })
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
              image: restaurant.image
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
  }

}

module.exports = adminController