const Message = require("../Models/Message");
const User = require("../Models/User");
require("../Models/_relationMapping");

class MessageRepository {
	static async getMessages(sender_id, receiver_id) {
		let messages = await Message.findAll({
			where: {
				"sender_id": sender_id,
				"receiver_id": receiver_id
			},
			include: ["sender", "receiver"],
			order: [['createdAt', 'DESC']]
		});
		return messages;
	}

	static createMessage(sender_id = null, receiver_id = null, data = null) {


		return true;
	}
}

module.exports = MessageRepository