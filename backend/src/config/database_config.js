// config.js
const { Sequelize } = require('sequelize');
require('dotenv').config({path: ".env"});


const sequelize = new Sequelize({
	dialect: process.env.DATABASE_DIALECT ?? "mysql",
	host: process.env.DATABASE_HOST ?? "localhost",     // Your MySQL host
	username: process.env.DATABASE_USERNAME ?? "root",      // Your MySQL username
	password: process.env.DATABASE_PASSWORD ?? "",  // Your MySQL password
	database: process.env.DATABASE_NAME ?? "mollychat",      // Your MySQL database name

	logging: true
});


module.exports = sequelize;
