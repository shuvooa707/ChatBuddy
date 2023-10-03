const sequalize = require("../config/database_config");
const {DataTypes} = require("sequelize");
const User = require("./User.js");
const Conversation = require("./Conversation");

const Message = sequalize.define("messages",    {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	message: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	conversation_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	sender_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	receiver_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
});




module.exports = Message;