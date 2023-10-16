const AuthService = require("../services/AuthService");

function SocketAuthMiddleware(socket, next) {
	let { token } = socket.handshake.query;
	console.log("\n\n\n\n")
	console.log("handshake token: "+token);
	console.log("\n\n\n\n")

	if ( AuthService.getUser(token) ) {
		console.log("\n\n\n\n")
		console.log("Not Connected! \n token: "+token);
		console.log("\n\n\n\n")
	}
	next();
	//socket.disconnect();
}


module.exports = SocketAuthMiddleware