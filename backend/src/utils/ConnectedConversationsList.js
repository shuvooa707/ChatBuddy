/* Map<Int, Socket> */
const connectedConversationsList = new Map();


connectedConversationsList.getTotalClientCount = function() {
	let clientIds = "";
	this.forEach((clientList, key) => {
		clientList.forEach((client, socketId)=>{
			clientIds += socketId + "\n";
		});
	});
	return clientIds;
}

module.exports = connectedConversationsList;