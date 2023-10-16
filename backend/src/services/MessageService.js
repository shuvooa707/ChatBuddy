const Message = require("../Models/Message");
require("../Models/_relationMapping")
const ConnectedConversationsList = require("../utils/ConnectedConversationsList.js");


function MessageService() {
	return {
		async createMessage(message=null, sender_id=null, conversation_id=null){
			if (!message || !sender_id || !conversation_id) throw Error("Data Not Set");

			let m = await Message.create({
							"message": message,
							"sender_id": sender_id,
							"conversation_id": conversation_id
						});
			return m;
		},
		async getMessages(conversation_id = null, offset= 1,  limit= 50) {
			if (!conversation_id) throw Error("conversation_id null");
			let messages = await Message.findAll({
				include: ["sender"],
				where: {
					"conversation_id": conversation_id
				},
				offset: offset,
				limit: limit,
				order: [['createdAt', 'DESC']]
			});
			return messages;
		},
		async getLastMessage(conversation_id = null) {
			if (!conversation_id) throw Error("conversation_id null");
			let message = await Message.findOne({
				where: {
					"conversation_id": conversation_id
				},
				order: [['createdAt', 'DESC']],
				include: ["sender", "receiver"]
			});
			return message;
		},
		async emitNewMessageEvent(conversation_id, messages = null) {

			ConnectedConversationsList.forEach((clientList, cId)=>{
				clientList.forEach((socket, socketId)=>{
					if ( conversation_id == cId ) {
						console.log(conversation_id, cId, socketId)
						socket.emit("new message", messages);
					}
				})
			})
		},
	}
}

module.exports = MessageService();