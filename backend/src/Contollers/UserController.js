const path = require("path");
const { parse } = require("cookie");

const MessageRepository = require("../Repository/MessageRepository");
const User = require("../Models/User");
const UserService = require("../services/UserService");
const AuthService = require("../services/AuthService");
const ConversationService = require("../services/ConversationService");
const MessageService = require("../services/MessageService");
const { Sequelize, DataTypes, Op } = require('sequelize');
const Conversation = require("../Models/Conversation");
require("../Models/_relationMapping");
const ConversationMember = require("../Models/ConversationMember");

function UserController() {
	return {
		async searchUser(req, res) {
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

			let input = req.body.input;
			let myselfId = req.body.myselfId;

			let conversation_members = await ConversationMember.findAll({
				where: {
					"member_user_id": myselfId
				}
			});
			conversation_members = conversation_members.map(cm => cm.member_user_id);
			let users = await User.findAll({
				where: {
					id: {
						[Op.notIn]: conversation_members,
					},
					name: {
						[Op.like]: `%${input}%`, // Use the '%' wildcard for partial matching
					},
				},
				limit: 10
			});

			let response = {
				"status": "success",
				"users": users,
				"conversation_members": conversation_members
			}
			res.header("Content-Type", "application/json");
			res.send(response);
		}
	}
}


module.exports = UserController();