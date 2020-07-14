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
          callback({ status: 'success', message: 'Category was successfully created'})
        })
        .catch(err => console.log(err))
    }
  },

}

module.exports = categoryService