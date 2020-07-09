'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: DataTypes.STRING,
    UserId: DataTypes.STRING,
    RestaurantId: DataTypes.STRING
  }, {});
  Comment.associate = function (models) {
    Comment.belongsTo(models.Restaurant)
    Comment.belongsTo(models.User)
  };
  return Comment;
};