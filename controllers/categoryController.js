const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    })
    .then(categories => res.render('admin/categories', { categories }))
  }


}

module.exports = categoryController