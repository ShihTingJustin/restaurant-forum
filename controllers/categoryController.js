const db = require('../models')
const categoryService = require('../services/categoryService')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.render('admin/categories', data)
    })
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
  },

  putCategory: (req, res) => {
    const { name } = req.body
    const { id } = req.params
    if (!name) {
      req.flash('warning_msg', 'Please enter a category name.')
      return res.redirect('back')
    } else {
      return Category.findByPk(id)
        .then(category => {
          category.update(req.body)
        })
        .then(() => res.redirect('/admin/categories'))
        .catch(err => console.log(err))
    }
  },

  deleteCategory: (req, res) => {
    const { id } = req.params
    return Category.findByPk(id)
      .then(category => category.destroy())
      .then(() => res.redirect('/admin/categories'))
      .catch(err => console.log(err))
  }


}

module.exports = categoryController