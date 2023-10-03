// sync-db.js
const sequelize = require('../config/database_config.js');
const User = require("../Models/User");
const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");
const AuthToken = require("../Models/AuthToken");

require("../Models/_relationMapping");

async function syncDatabase() {
	try {
		await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
		await sequelize.sync({ force: true }); // This will drop and recreate tables
		console.log('Database synchronized successfully.');
		await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

	} catch (error) {
		console.error('Error synchronizing database:', error);
	} finally {
		sequelize.close(); // Close the database connection
	}
}

syncDatabase();
