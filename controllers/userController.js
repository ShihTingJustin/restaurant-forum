const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

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
  }
}

module.exports = userController