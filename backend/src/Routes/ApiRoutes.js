const router = require("express").Router();
const HomeController = require("../Contollers/HomeController");
const AuthController = require("../Contollers/AuthController");
const ChatController = require("../Contollers/ChatController");
const ConversationController = require("../Contollers/ConversationController");
const UserController = require("../Contollers/UserController");

router.post("/load-chat-data", ChatController.loadPageData);
router.post("/get-myself-data", AuthController.getMyselfData);
router.post("/get-messages", ChatController.getMessages);
router.post("/chat/search-user", UserController.searchUsers);
router.post("/chat/initiate/private", ConversationController.initiatePrivateChat);
router.post("/chat/initiate/group", ConversationController.initiateGroup);
router.post("/send-message", ChatController.sendMessage);

router.post("/update-conversation-name", ConversationController.updateConversationName);
router.post("/search-users-add-conversation", ConversationController.searchUsers);
router.post("/add-member", ConversationController.addMember);
router.post("/conversation/remove-member", ConversationController.removeMember);
router.post("/conversation/get-convesations", ConversationController.getConversations);


router.post("/login", AuthController.loginAttempt);

module.exports = router;