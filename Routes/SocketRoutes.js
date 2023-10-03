io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on("any", (msg)=>{
		socket.emit(msg);
	});
});
