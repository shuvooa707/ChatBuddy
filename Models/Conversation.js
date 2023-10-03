const sequalize = require("../config/database_config");
const User = require("./User.js");
const Message = require("./Message.js");
const {DataTypes} = require("sequelize");


const Conversation = sequalize.define("conversations", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	type: {
		type: DataTypes.ENUM("Private", "Group"),
		defaultValue: "Private"
	}
});




module.exports = Conversation;
