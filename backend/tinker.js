const Conversation = require("./Models/Conversation");
require("./Models/_relationMapping");


Conversation.findAll({
	include: ["members", "messages"]
})
.then(conversations => {

	conversations.forEach(conversation=>{
		console.log("---- conversation " + conversation.id);
		conversation.messages.forEach(message => {
			console.log("-> " + message.message)
		})
		console.log("-------------------------------------")
	})
})
