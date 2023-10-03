const router = require("express").Router();
const HomeController = require("../Contollers/HomeController");
const AuthController = require("../Contollers/AuthController");
const ChatController = require("../Contollers/ChatController");

router.post("/load-page-data", ChatController.loadPageData);
router.post("/get-messages", ChatController.getMessages);

module.exports = router;