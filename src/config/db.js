const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.DB_DATABASE, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  logging: console.log,
  dialectOptions: {
    socketPath: env.DB_SOCKET, // Use XAMPP socket
  },
});

module.exports = sequelize;