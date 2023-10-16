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
			let data = req.body;

			// Attempt Login
			let checked = await AuthService.attemptLogin({email: req.body.email, password: req.body.password})
			if ( checked ) {
				let user = await User.findOne({
					where: {
						email: data.email,
						password: data.password
					}
				});
				let token = await AuthService.getToken(user);

				// req.session.token = token;
				// res.cookie("token", token);

				res.send({
					"status": "success",
					"token": token,
					"user": user
				});
				return;
			}


			//res.render("auth/login.ejs", { "wrongCredentials": true });
			res.send({
				"status": "failed"
			});
			return;
		},


		registerPage: async (req, res) => {
			res.sendFile(path.join(__dirname, "/../public/auth/register.html"));
		},
		registerAttempt: async (req, res) => {
			// Attempt Register

		},
		logoutAttempt: async (req, res) => {
			res.redirect("/");
		},
		async getMyselfData(req, res) {
			let user = await AuthService.getUser(req.body.token);
			res.send({
				"status": "success",
				"user": user
			});
			return;
		}
	}
}


module.exports = AuthController();