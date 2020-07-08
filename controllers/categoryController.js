const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => console.log(err))
  },

  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('warning_msg', 'Please enter a category name.')
      return res.redirect('back')
    } else {
      return Category.create({ name })
        .then(() => res.redirect('/admin/categories'))
        .catch(err => console.log(err))
    }
  }


}

module.exports = categoryController