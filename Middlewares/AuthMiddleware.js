const AuthMiddleware = (req, res, next) => {
	// Perform middleware tasks here
	if(req.session.user) {
		// Call next() to pass control to the next middleware in the stack
		next();
	}


	res.redirect("/login");
};

module.exports = AuthMiddleware;