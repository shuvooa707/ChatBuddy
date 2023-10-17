const path = require("path");
const { parse } = require("cookie");

const MessageRepository = require("../Repository/MessageRepository");
const User = require("../Models/User");
const UserService = require("../services/UserService");
const AuthService = require("../services/AuthService");
const ConversationService = require("../services/ConversationService");
const MessageService = require("../services/MessageService");
const { Sequelize, DataTypes, Op, QueryTypes} = require('sequelize');
const Conversation = require("../Models/Conversation");
require("../Models/_relationMapping");
const ConversationMember = require("../Models/ConversationMember");
const sequelize = require("../config/database_config");

function UserController() {
	return {
		async searchUsers(req, res) {
			let token = req.headers.token ?? null;
			if ( !token ) {
				res.send({
					"status": "failed",
					"message": "Unauthorized"
				});
				return;
			}
			let user = await AuthService.getUser(token);
			if ( !user ) {
				res.send({
					"status": "failed",
					"error": "unauthorized"
				});
				return;
			}

			let input = req.body.input ?? null;
			let conversationId = req.body.conversationId ?? null;
			const query = `select distinct other_user from (select cm1.member_user_id as myself, cm2.member_user_id as other_user from conversation_members cm1
								    left join conversation_members cm2
								        on cm2.conversation_id = cm1.conversation_id
								  where  cm1.member_user_id = ${user.id} and cm1.member_user_id <> cm2.member_user_id) t`;

			let conversation_members = await sequelize.query(query, { type: QueryTypes.SELECT });
			conversation_members = conversation_members.map(cm => cm.other_user);
			conversation_members.push(user.id);
			let users = await User.findAll({
				where: {
					id: {
						[Op.notIn]: conversation_members,
					},
					name: {
						[Op.like]: `%${input}%`, // Use the '%' wildcard for partial matching
					},
				}
			});

			let response = {
				"status": "success",
				"users": users,
				"conversation_members": conversation_members,
				"userid": user.id
			}
			res.header("Content-Type", "application/json");
			res.send(response);
		},
	}
}


module.exports = UserController();