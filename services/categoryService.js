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
  }
}

module.exports = categoryService