// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database_config');
const User = require("../Models/User");

const AuthToken = sequelize.define('auth_tokens', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	token: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	status: {
		type: DataTypes.ENUM("Alive", "Dead"),
		allowNull: false,
		defaultValue: "Alive"
	}
});




module.exports = AuthToken;
