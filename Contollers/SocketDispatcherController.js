const { parse } = require("cookie");


function SocketDispatcherController() {
	return {
		dispatch: async (io, socket, data) => {
			const cookies = parse(socket.request.headers.cookie);
			if ( !cookies ) socket.disconnect();


			socket.emit(JSON.stringify(socket.handshake));
		}
	}
}

module.exports = SocketDispatcherController();