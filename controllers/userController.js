const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant, Comment, Favorite, Like, Followship } = db

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
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Comment, include: [Restaurant] },
        { model: Restaurant, as: 'FavoritedRestaurants' }
      ]
    }).then(user => {
      // 已評論餐廳：一個餐廳只能計入一則評論
      // 取出所有 comments
      const comments = user.toJSON().Comments
      // 比對 comment 的 RestaurantId
      const filteredComments = comments.reduce((res, itm) => {
        let result = res.find(item => item.RestaurantId === itm.RestaurantId)
        if(!result) return res.concat(itm)
        return res
      }, [])

      return res.render('profile', {
        userYouClick: user.toJSON(),
        user: req.user,
        followers: user.toJSON().Followers,
        followings: user.toJSON().Followings,
        comments: filteredComments,
        favoritedRestaurants: user.toJSON().FavoritedRestaurants,
        isIdOwner
      })
    })
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
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(() => {
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      favorite.destroy()
    }).then(() => res.redirect('back'))
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(() => {
      return res.redirect('back')
    }).catch(err => console.log(err))
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(like => {
      console.log(like.toJSON())
      like.destroy()
    }).then(() => res.redirect('back'))
      .catch(err => console.log(err))
  },

  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users })
    }).catch(err => console.log(err))
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(() => res.redirect('back'))
  },

  removeFollowing: (req, res) => {
    console.log(123, req.params.userId)
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => followship.destroy())
      .then(() => res.redirect('back'))
      .catch(err => console.log(err))
  }

}

module.exports = userController