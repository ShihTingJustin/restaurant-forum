const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
  app.get('/', (req, res) => res.redirect('restaurants'))
  app.get('/restaurants', restController.getRestaurants)

  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminController.getRestaurants)

  app.get('/register', userController.registerPage)
  app.post('/register', userController.register)

  app.get('/login', userController.loginPage)
  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), userController.login)
  app.get('/logout', userController.logout)
}