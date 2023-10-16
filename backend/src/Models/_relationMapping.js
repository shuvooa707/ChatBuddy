const Conversation = require("./Conversation");
const ConversationMember = require("./ConversationMember");
const User = require("./User");
const Message = require("./Message");
const AuthToken = require("./AuthToken");

Message.belongsTo(Conversation, {
	"as": "conversation",
	"foreignKey": "conversation_id"
});

User.belongsToMany(Conversation, {
	as: "conversations",
	through: "conversation_members", // pivot table
	foreignKey: "member_user_id"
});


Message.belongsTo(User, {
	"as": "sender",
	"foreignKey": "sender_id"
});
Message.belongsTo(User, {
	"as": "receiver",
	"foreignKey": "receiver_id"
});

User.hasMany(Message, {
	"as": "sent_messages",
	"foreignKey": "sender_id"
});
User.hasMany(Message, {
	"as": "received_messages",
	"foreignKey": "receiver_id"
});

AuthToken.belongsTo(User, {
	"as": "user",
	"foreignKey": "user_id"
});
User.hasMany(AuthToken, {
	"as": "tokens",
	"foreignKey": "user_id"
});



Conversation.belongsToMany(User, {
	through: "conversation_members", // pivot table
	foreignKey: "member_user_id"
});

Conversation.hasMany(Message, {
	as: "messages",
	foreignKey: "conversation_id"
});


ConversationMember.belongsTo(Conversation, {
	foreignKey: "conversation_id"
});
Conversation.hasMany(ConversationMember, {
	foreignKey: "conversation_id"
});

ConversationMember.belongsTo(User, {
	foreignKey: "member_user_id"
});