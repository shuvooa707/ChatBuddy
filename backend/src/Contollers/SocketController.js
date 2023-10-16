const { parse } = require("cookie");
const MessageService = require("../services/MessageService");
const connectedConversationsList = require("../utils/ConnectedConversationsList.js");
const winston = require('winston');

function SocketController() {
	const logger = winston.createLogger({
		transports: [
			new winston.transports.Console(),
			new winston.transports.File({ filename: 'combined.log' })
		]
	});

	return {
		dispatch: async (io, socket, event, data) => {
			if ( event == "send message" ) {
				let payload = JSON.parse(data);
				let message = await MessageService.createMessage(payload.message, payload.sender_id, payload.conversation_id);

			}
		},
		registerClient(io, socket) {
			let { conversation_id } = socket.handshake.query;
			// logger.log({
			// 	level: 'info',
			// 	message: "connected client" + socket.id
			// });

			let clientMap = connectedConversationsList.get(conversation_id) || new Map();
			let clientExists = clientMap.get(socket.id);
			if ( !clientExists ) {
				clientMap.set(socket.id, socket);
			}
			connectedConversationsList.set(conversation_id, clientMap);

			socket.emit("testing", connectedConversationsList.getTotalClientCount());
		},
		unRegisterClient(io, socket) {
			connectedConversationsList
				.forEach((clientMap, conversation_id) =>{
					clientMap.forEach((socket, socketId)=>{
						clientMap.delete(socketId);
					})
				});
			socket.emit("testing", connectedConversationsList.getTotalClientCount());
		},

	}
}



module.exports = SocketController();