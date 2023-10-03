function SocketAuthMiddleware(socket, next) {
	let { token } = socket.handshake.query;
	console.log(token);
	next();
}


module.exports = SocketAuthMiddleware