const router = require("express").Router();
const redis = require('redis');
const HomeController = require("../Contollers/HomeController");
const AuthController = require("../Contollers/AuthController");
const ChatController = require("../Contollers/ChatController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");
const { client } = require("../config/redis_config");
const connectedConversationsList = require("../utils/ConnectedConversationsList");

router.get("/", HomeController.index);
router.get("/login", AuthController.loginPage);
router.post("/login", AuthController.loginAttempt);
router.get("/register", AuthController.registerPage);
router.post("/register", AuthController.registerAttempt);
router.get("/logout", AuthController.logoutAttempt);

router.get("/chat", ChatController.chatBoard);
router.get("/redis", async (req, res)=>{
	//await client.connect();
	res.send( await client.get(``) );
});
router.get("/test", async (req, res)=>{
	res.send( JSON.stringify(connectedConversationsList) );
});





module.exports = router;