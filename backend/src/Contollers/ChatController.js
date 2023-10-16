const path = require("path");
const { parse } = require("cookie");

const MessageRepository = require("../Repository/MessageRepository");
const User = require("../Models/User");
const UserService = require("../services/UserService");
const AuthService = require("../services/AuthService");
const ConversationService = require("../services/ConversationService");
const MessageService = require("../services/MessageService");

function ChatController() {
	return {
		chatBoard: (req, res) => {
			res.sendFile(path.join(__dirname, "../frontend/Application/build/index.html"));
			// res.send(path.join(__dirname, "../public/index.html"));
		},
		loadPageData: async (req, res) => {
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
		},
		getMessages: async (req, res) => {
			let conversation_id = req.body?.conversation?.id ?? null;
			let messages = await MessageService.getMessages(conversation_id);
			let response = {
				"status": "success",
				"messages": messages
			}
			res.header("Content-Type", "application/json");
			res.send(response);
			return;
		},
		sendMessage: async (req, res) => {
			let conversation_id = req.body.conversation_id;
			let message = req.body.message;

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
				let m = await MessageService.createMessage(message, user.id, conversation_id);
				let lastMessage = await MessageService.getLastMessage(conversation_id);

				await MessageService.emitNewMessageEvent(conversation_id, lastMessage);

				res.send({
					"status": "success",
					"message": lastMessage
				});
				return;
			} catch (e) {
				console.log(e)
				res.send({
					"status": "failed",
					"error": e.toString()
				});
			}
		},
	}
}


module.exports = ChatController();