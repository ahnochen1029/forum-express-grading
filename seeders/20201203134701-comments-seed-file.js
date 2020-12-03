'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', [
      {
        text: 'test1',
        UserId: Math.floor(Math.random() * 3) + 1,
        RestaurantId: Math.floor(Math.random() * 49) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'test2',
        UserId: Math.floor(Math.random() * 3) + 1,
        RestaurantId: Math.floor(Math.random() * 49) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'test3',
        UserId: Math.floor(Math.random() * 3) + 1,
        RestaurantId: Math.floor(Math.random() * 49) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'test4',
        UserId: Math.floor(Math.random() * 3) + 1,
        RestaurantId: Math.floor(Math.random() * 49) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'test5',
        UserId: Math.floor(Math.random() * 3) + 1,
        RestaurantId: Math.floor(Math.random() * 49) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'test6',
        UserId: Math.floor(Math.random() * 3) + 1,
        RestaurantId: Math.floor(Math.random() * 49) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'test7',
        UserId: Math.floor(Math.random() * 3) + 1,
        RestaurantId: Math.floor(Math.random() * 49) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'test8',
        UserId: Math.floor(Math.random() * 3) + 1,
        RestaurantId: Math.floor(Math.random() * 49) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'test9',
        UserId: Math.floor(Math.random() * 3) + 1,
        RestaurantId: Math.floor(Math.random() * 49) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'test10',
        UserId: Math.floor(Math.random() * 3) + 1,
        RestaurantId: Math.floor(Math.random() * 49) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
