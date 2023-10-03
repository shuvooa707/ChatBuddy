const path = require("path");
const { parse } = require("cookie");

const MessageRepository = require("../Repository/MessageRepository");
const User = require("../Models/User");
const UserService = require("../services/UserService");

function ChatController() {
	return {
		chatBoard: (req, res) => {
			res.sendFile(path.join(__dirname, "../resources/Application/build/index.html"));
			// res.send(path.join(__dirname, "../public/index.html"));
		},
		loadPageData: async (req, res) => {
			let token = parse(req.session.token);
			// let contacts = await UserService.getContacts();

			let data = {
				"status": "success",
				"contacts": token
			};
			res.send(data);
		},

		getMessages: async (req, res) => {
			let sender_id = 1 ?? null; // the loggedIn User
			let receiver_id = req.body?.contact?.id ?? null;
			let receiver = await User.findOne({ where: { "id": receiver_id } });
			res.header("Content-Type", "application/json");
			let messages = await MessageRepository.getMessages(sender_id, receiver_id);
			let response = {
				"status": "success",
				"receiver": receiver,
				"messages": messages
			}
			res.send(response);
			return;
		}
	}
}


module.exports = ChatController();