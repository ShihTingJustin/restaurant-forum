let adminController = {
  getRestaurants: (req, res) => {
    return res.render('admin/restaurants')
  }
}

module.exports = adminController