const User = require("../Models/User");
const Conversation = require("../Models/Conversation");
const ConversationMember = require("../Models/ConversationMember");
require("../Models/_relationMapping")

function UserSevice() {
	return {
		async getContacts(user) {
			if (user) throw new Error("User Not Found");

			let contacts = await Conversation.findAll({
								where: {
									member_user_id: user.id
								},
								include: [
									{
										"model": "members"
									}
								]
							});
			return contacts;
		}
	}
}

module.exports = UserSevice();
