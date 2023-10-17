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

function ChatController() {
	return {
		updateConversationName: async (req, res) => {
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

			let conversationId = req.body.conversationId;
			let conversationName = req.body.conversationName;

			await ConversationService.updateConversationName(conversationId, conversationName);

			let conversations = await ConversationService.getMyConversations(user);


			let response = {
				"status": "success",
				"conversations": conversations,
				"conversationId": conversationId,
				"conversationName": conversationName
			}
			res.header("Content-Type", "application/json");
			res.send(response);
			return;
		},
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

			let conversation_members = await ConversationMember.findAll({
				where: {
					"conversation_id": conversationId
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
							}
						});

			let response = {
				"status": "success",
				"users": users,
				"conversation_members": conversation_members
			}
			res.header("Content-Type", "application/json");
			res.send(response);
		},
		async addMember(req, res) {
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

			let userId = req.body.userId;
			let conversationId = req.body.conversationId;

			await ConversationService.addMember(conversationId, userId);

			let conversation = await Conversation.findOne({
				where: {
					id: conversationId
				},
				include: {
					model: ConversationMember,
					include: "user"
				}
			});

			let response = {
				"status": "success",
				"conversation": conversation
			}
			res.header("Content-Type", "application/json");
			res.send(response);
		},
		async removeMember(req, res) {
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

			let userId = req.body.userId;
			let conversationId = req.body.conversationId;

			await ConversationService.removeMember(conversationId, userId);

			let conversation = await Conversation.findOne({
				where: {
					id: conversationId
				},
				include: {
					model: ConversationMember,
					include: "user"
				}
			});

			let response = {
				"status": "success",
				"conversation": conversation
			}
			res.header("Content-Type", "application/json");
			res.send(response);
		},

		async initiatePrivateChat(req, res) {
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

			let userId = req.body.userId;
			let conversation;
			try {
				conversation = await ConversationService.createPrivateConversation([userId, user.id]);
			} catch (error) {
				res.header("Content-Type", "application/json");
				res.send({
					"status": "failed",
					"error": error
				});
			}

			res.header("Content-Type", "application/json");
			res.send({
				"status": "success",
				"conversation": conversation
			});
		},

		async initiateGroup(req, res) {
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


			let userId = req.body.userId;
			let conversation;
			try {
				conversation = await ConversationService.createPrivateConversation([userId, user.id]);
			} catch (error) {
				res.header("Content-Type", "application/json");
				res.send({
					"status": "failed",
					"error": error
				});
			}

			res.header("Content-Type", "application/json");
			res.send({
				"status": "success",
				"conversation": conversation
			});
		},

		async getConversations(req, res) {
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

			try {
				let conversations = await ConversationService.getMyConversations(user);
				res.send({
					"status": "success",
					"conversations": conversations
				});
			} catch (e) {
				res.send({
					"status": "failed",
					"error": e
				});
			}
		}
	}
}


module.exports = ChatController();