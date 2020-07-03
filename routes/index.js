const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {

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

  app.get('/', authenticated, (req, res) => res.redirect('restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)

  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  app.get('/register', userController.registerPage)
  app.post('/register', userController.register)

  app.get('/login', userController.loginPage)
  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), userController.login)
  app.get('/logout', userController.logout)
}