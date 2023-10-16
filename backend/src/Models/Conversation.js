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
	name: {
		type: DataTypes.STRING,
		defaultValue: "",
	},
	image: {
		type: DataTypes.STRING,
		defaultValue: "https://img.icons8.com/?size=512&id=KOAbbUbnRJBw&format=png"
	},
	type: {
		type: DataTypes.ENUM("Private", "Group"),
		defaultValue: "Private"
	}
});




module.exports = Conversation;
