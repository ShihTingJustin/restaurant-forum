const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let whereQuery = {}  //傳給 findAll 的參數 需要包裝成物件格式
    let categoryId = ''
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }
    Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit
    })
      .then(result => {
        let page = Number(req.query.page) || 1
        let pages = Math.ceil(result.count / pageLimit)
        let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        let prev = page - 1 < 1 ? 1 : page - 1
        let next = page + 1 > pages ? pages : page + 1
        const data = result.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          categoryName: r.Category.name
        }))
        Category.findAll({ raw: true, nest: true })
          .then(categories => {
            return res.render('restaurants', {
              restaurants: data,
              categories,
              categoryId,
              page,
              totalPage,
              prev,
              next
            })
          })

      })
  },

  getRestaurant: (req, res) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    })
      .then(restaurant => {
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
  }



}

module.exports = restController