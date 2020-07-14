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
    categoryService.postCategory(req, res, data => {
      if (data.status === 'error') {
        req.flash('warning_msg', data.message)
        return res.redirect('back')
      }
      req.flash('success_msg', data.message)
      return res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res) => {
    categoryService.putCategory(req, res, data => {
      if (data.status === 'error') {
        req.flash('warning_msg', data.message)
        return res.redirect('back')
      }
      req.flash('success_msg', data.message)
      return res.redirect('/admin/categories')
    })
  },

  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, data => {
      req.flash('success_msg', data.message)
      return res.redirect('/admin/categories')
    })
  }


}

module.exports = categoryController