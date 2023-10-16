const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { client } = require("./src/config/redis_config.js");



const io = new Server(server, {
	cors: {
		origin: "*"
	}
});

const session = require('express-session');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session);


const AuthMiddleware = require("./src/Middlewares/AuthMiddleware");
const SocketAuthMiddleware = require("./src/Middlewares/SocketAuthMiddleware");
const SocketController = require("./src/Contollers/SocketController");

require('dotenv').config();

const WebRoutes = require("./src/Routes/WebRoutes");
const ApiRoutes = require("./src/Routes/ApiRoutes");



app.use(cors());
app.use(express.json());
/*
app.use(session({
	secret: process.env.APP_KEY ?? "2910-4389-3290", // A secret key for session data encryption
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 360000, // Session duration in milliseconds (e.g., 1 hour)
	},
	store: new FileStore()
}));
*/
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/public');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "public/chat/assets" )));

app.use(express.static(  "public"  ));


app.use(AuthMiddleware);
// routes
app.use("/", WebRoutes);
app.use("/api/v1/", ApiRoutes);




io.use(SocketAuthMiddleware);
io.on('connection', (socket) => {
	console.log('a user connected');
	SocketController.registerClient(io, socket);
	socket.on("disconnect", (reason) => {
		// socket.emit("testing", data)
		SocketController.unRegisterClient(io, socket);
	});
});

server.listen(3000, async () => {
	console.log('listening on *:3000');

	await client.connect();
});

