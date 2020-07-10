const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

let userController = {
  registerPage: (req, res) => {
    return res.render('register')
  },

  register: (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = []

    if (!email && !password && !confirmPassword) {
      errors.push({ message: 'Please fill in Email, password and confirm password.' })
    } else if (!email) {
      errors.push({ message: 'Please fill in Email.' })
    } else if (!password) {
      errors.push({ message: 'Please fill in password.' })
    } else if (!confirmPassword) {
      errors.push({ message: 'Please fill in confirm password.' })
    }

    if ((password.length && confirmPassword.length) && (password !== confirmPassword)) {
      errors.push({ message: 'Password or confirm password incorrect.' })
    }

    if (errors.length) {
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          errors.push({ message: 'This email is registered.' })
          return res.render('register', {
            name,
            email,
            password,
            confirmPassword
          })
        }
        return User.create({
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        }).then(user => {
          req.flash('success_msg', 'Register successfully.')
          return res.redirect('/register')
        })
          .catch(err => console.log(err))
      })
  },

  loginPage: (req, res) => {
    return res.render('login')
  },

  login: (req, res) => {
    req.flash('success_msg', "Login successfully.")
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_msg', 'Logout successfully')
    req.logout()
    res.redirect('/login')
  },

  getUser: (req, res) => {
    const isIdOwner = Number(req.params.id) === req.user.id ? true : false
    return User.findByPk(req.params.id, {
      raw: true,
      nest: true,
    })
      .then(otherUser => {
        Comment.findAndCountAll({
          where: { UserId: req.params.id },
          raw: true,
          nest: true,
          include: [User, Restaurant],
          limit: 10
        })
          .then(comments => {
            return res.render('profile', {
              user: req.user,
              otherUser,
              isIdOwner,
              commentCounter: comments.count,
              comments: comments.rows
            })
          })
      })
      .catch(err => console.log(err))
  },

  editUser: (req, res) => {
    if (Number(req.params.id) === req.user.id) {
      return User.findByPk(req.params.id)
        .then(user => res.render('editProfile', { user: user.toJSON() }))
        .catch(err => console.log(err))
    } else {
      req.flash('error_msg', 'You can only edit your own profile.')
      return res.redirect(`/users/${req.user.id}`)
    }
  },

  putUser: (req, res) => {
    if (Number(req.params.id) === req.user.id) {
      if (!req.body.name) {
        req.flash('warning_msg', 'Please enter user name.')
        return res.redirect('back')
      }
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, (err, img) => {
          if (err) console.log(`[ERROR]: ${err}`)
          return User.findByPk(req.params.id)
            .then(user => {
              user.update({
                name: req.body.name,
                image: img.data.link
              })
            })
            .then(() => {
              req.flash('success_msg', 'Your profile was successfully updated')
              return res.redirect(`/users/${req.user.id}`)
            })
            .catch(err => console.log(err))
        })
      } else {
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name,
              image: user.image
            })
          })
          .then(() => {
            req.flash('success_msg', 'Your profile was successfully updated')
            return res.redirect(`/users/${req.user.id}`)
          })
          .catch(err => console.log(err))
      }
    } else {
      req.flash('error_msg', 'You can only edit your own profile.')
      return res.redirect(`/users/${req.user.id}`)
    }
  }
}

module.exports = userController