'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'isAdmin', {
      type: Sequelize.BOOLEAN,
      defaultValue: 0
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'isAdmin')
  }
};
