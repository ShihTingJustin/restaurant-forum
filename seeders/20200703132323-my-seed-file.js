'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker');


module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})

    queryInterface.bulkInsert('Categories',
      ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理'].map((item, index) =>
        ({
          id: index + 1,
          name: item,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      )
    )

    return queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }).map(d =>
        ({
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: 'https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}',
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date(),
          CategoryId: Math.floor(Math.random() * 5) + 1
        })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Categories', null, {})
    return queryInterface.bulkDelete('Restaurants', null, {})
  }
};
