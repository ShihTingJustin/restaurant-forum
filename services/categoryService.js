const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    const { id } = req.params
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (id) {
        Category.findByPk(id)
          .then(category => {
            return res.render('admin/categories',
              {
                categories,
                category: category.toJSON()
              })
          }).catch(err => console.log(err))
      } else {
        callback({ categories })
      }
    }).catch(err => console.log(err))
  },

  postCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      callback({ status: 'error', message: 'Please enter a category name.' })
    } else {
      return Category.create({ name })
        .then(() => {
          callback({ status: 'success', message: 'Category was successfully created' })
        })
        .catch(err => console.log(err))
    }
  },

  putCategory: (req, res, callback) => {
    const { name } = req.body
    const { id } = req.params
    if (!name) {
      callback({ status: 'error', message: 'Please enter a category name.' })
    } else {
      return Category.findByPk(id)
        .then(category => {
          return category.update({ name })
        })
        .then(() => callback({ status: 'success', message: 'Category was successfully updated' }))
        .catch(err => console.log(err))
    }
  },

  deleteCategory: (req, res, callback) => {
    const { id } = req.params
    return Category.findByPk(id)
      .then(category => category.destroy())
      .then(() => callback({ status: 'success', message: 'Category was successfully deleted'}))
      .catch(err => console.log(err))
  }

}

module.exports = categoryService