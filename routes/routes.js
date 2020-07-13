const express = require('express')
const router = express.Router()

const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const commentController = require('../controllers/commentController')
const passport = require('../config/passport')

const multer = require('multer')
const categoryController = require('../controllers/categoryController')
const { authenticate } = require('passport')
const upload = multer({ dest: 'temp/' })

  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/login')
  }
  //前台頁面
  router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
  router.get('/restaurants/feeds', authenticated, restController.getFeeds)
  router.get('/', authenticated, (req, res) => res.redirect('restaurants'))
  router.get('/restaurants', authenticated, restController.getRestaurants)
  router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
  router.get('/restaurants/:id', authenticated, restController.getRestaurant)

  router.post('/comments', authenticated, commentController.postComment)
  router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  router.get('/users/top', authenticated, userController.getTopUser)
  router.get('/users/:id', authenticated, userController.getUser)
  router.get('/users/:id/edit', authenticated, userController.editUser)
  router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

  router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
  router.post('/like/:restaurantId', authenticated, userController.addLike)
  router.delete('/like/:restaurantId', authenticated, userController.removeLike)
  router.post('/following/:userId', authenticated, userController.addFollowing)
  router.delete('/following/:userId', authenticated, userController.removeFollowing)

  // 後台頁面
  router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
  router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  router.put('/admin/users/:id', authenticatedAdmin, adminController.putUser)
  router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  router.get('/admin/categories/:id/edit', authenticatedAdmin, categoryController.getCategories)
  router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  // 登入頁面
  router.get('/register', userController.registerPage)
  router.post('/register', userController.register)

  router.get('/login', userController.loginPage)
  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), userController.login)

  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  }))
  router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

  router.get('/logout', userController.logout)

  
  module.exports = router