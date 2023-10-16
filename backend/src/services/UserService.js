const Conversation = require("../Models/Conversation");
require("../Models/_relationMapping")

function UserService() {
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

module.exports = UserService();
