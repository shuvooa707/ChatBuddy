const AuthMiddleware = (req, res, next) => {
	// Perform middleware tasks here
	if(req.originalUrl == "/api/v1/login") {
		next();
		return;
	}
	if(req.headers.token) {
		// Call next() to pass control to the next middleware in the stack
		next();
		return;
	}


	res.send({
		"status": "failed",
		"error": "unauthorized"
	});
	return;
};

module.exports = AuthMiddleware;