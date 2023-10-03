const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { client } = require("./config/redis_config.js");



const io = new Server(server, {
	cookie: true,
	cors: {
		origin: "*"
	}
});

const session = require('express-session');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session);


const AuthMiddleware = require("././Middlewares/AuthMiddleware");
const SocketAuthMiddleware = require("././Middlewares/SocketAuthMiddleware");
const SocketDispatcherController = require("./Contollers/SocketDispatcherController");

const cors = require('cors');
require('dotenv').config();

const WebRoutes = require("./Routes/WebRoutes");
const ApiRoutes = require("./Routes/ApiRoutes");
const path = require("path");



app.use(cors({
	origin: '*',

	methods: [
		'GET',
		'POST',
	],

	allowedHeaders: [
		'Content-Type',
	],
}));
app.use(session({
	secret: process.env.APP_KEY ?? "2910-4389-3290", // A secret key for session data encryption
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 360000, // Session duration in milliseconds (e.g., 1 hour)
	},
	store: new FileStore()
}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "public/chat/assets" )));


// routes
app.use("/", WebRoutes);
app.use("/api/v1/", ApiRoutes);


app.use(express.static(  "public"  ));
app.use(express.static(  "public/dist"  ));


io.use(SocketAuthMiddleware);
io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on("any", (data) => {
		SocketDispatcherController.dispatch(io, socket, data)
	});
});

server.listen(3000, async () => {
	console.log('listening on *:3000');

	await client.connect();
});

