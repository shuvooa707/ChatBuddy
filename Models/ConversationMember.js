const sequalize = require("../config/database_config");
const {DataTypes} = require("sequelize");


const ConversationMember = sequalize.define("conversation_members", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	conversation_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	member_user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
});




module.exports = ConversationMember;
