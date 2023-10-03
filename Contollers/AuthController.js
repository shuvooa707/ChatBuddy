const User = require("../Models/User");
const path = require("path");
const {defaultConfiguration} = require("express/lib/application");
const AuthService = require("../services/AuthService");

function AuthController() {
	return {
		loginPage: (req, res) => {
			let data = {
				"wrongCredentials": false
			}
			res.render("auth/login.ejs", data);
		},
		loginAttempt: async (req, res) => {
			// Attempt Login
			let checked = await AuthService.attemptLogin({email: req.body.email, password: req.body.password})
			if ( checked ) {
				let user = await User.findOne({
					where: {
						email: req.body.email,
						password: req.body.password
					}
				});
				let token = await AuthService.getToken(user);
				console.log("\n\n\n\n")
				console.log(token)
				console.log("\n\n\n\n")
				req.session.token = token;
				res.cookie("token", token);

				res.redirect("/chat");
				return;
			}


			res.render("auth/login.ejs", { "wrongCredentials": true });
		},


		registerPage: (req, res) => {
			res.sendFile(path.join(__dirname, "/../public/auth/register.html"));
		},
		registerAttempt: (req, res) => {
			// Attempt Register

		},
		logoutAttempt: (req, res) => {
			res.redirect("/");
		}
	}
}


module.exports = AuthController();