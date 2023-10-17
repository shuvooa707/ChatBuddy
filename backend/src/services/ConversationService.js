const User = require("../Models/User");
const Conversation = require("../Models/Conversation");
const ConversationMember = require("../Models/ConversationMember");
require("../Models/_relationMapping")
const { Op } = require('sequelize');

function ConversationService() {
	return {

		/*** Given a User Return the conversations of that User  ***/
		async getMyConversations(user = null) {
			if (!user) throw new Error("User Not Found");

			let conversation_ids = await ConversationMember.findAll({
										where: {
											member_user_id: user.id
										}
									});
			conversation_ids = [... new Set(conversation_ids.map(cm => cm.conversation_id))];

			let conversations = await Conversation.findAll({
									where: {
										id: {
											[Op.in]: conversation_ids,
										}
									},
									include: {
										model: ConversationMember,
										include: "user"
									}
								});

			return conversations;
		},
		async updateConversationName(conversationId=null, conversationName=null) {
			if (conversationId == null || conversationName == null) return false;

			try {
				return await Conversation.update({
					"name": conversationName
				}, {
					where: { "id": conversationId }
				});
			} catch (e) {
				return false;
			}
		},
		async addMember(conversationId, userId) {
			return await ConversationMember.create({
						"conversation_id": conversationId,
						"member_user_id": userId,
					});
		},
		async removeMember(conversationId, userId) {
			return await ConversationMember.destroy({
				where: {
					"conversation_id": conversationId,
					"member_user_id": userId
				}
			});
		},
		async createPrivateConversation(userIds = []) {
			if ( userIds.length < 2 ) throw Error("user ids not set");

			let conversation = await Conversation.create();
			await ConversationMember.create({
				"conversation_id": conversation.id,
				"member_user_id": userIds[0]
			});
			await ConversationMember.create({
				"conversation_id": conversation.id,
				"member_user_id": userIds[1]
			});
			return conversation;
		},
		async createGroupConversation(userIds = []) {
			if ( userIds.length < 2 ) throw Error("user ids not set");

			let conversation = await Conversation.create({
				"type": "Group"
			});
			for (const userId in userIds) {
				await ConversationMember.create({
					"conversation_id": conversation.id,
					"member_user_id": userId
				});
			}

			return conversation;
		},
	}
}

module.exports = ConversationService();
