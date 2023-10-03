const User = require("../Models/User");
const AuthToken = require("../Models/AuthToken");
// Includes crypto module

const crypto = require('crypto');

const RedisService = require('../services/RedisService');

function AuthService() {
	return {
		async user(token=null) {
			if ( !token ) return false;
			let user = RedisService.get(token);
			if ( user ) {
				user = JSON.parse(user);
				if ( user ) return user;
				return user;
			}
			return false;
		},
		async check(token=null) {
			if ( !token ) return false;
			let user = RedisService.get(token);
			if ( user ) {
				return true;
			}
			return false;
		},
		async attemptLogin({email, password}) {
			if ( !email || !password ) return false;
			// attempt auth
			let user = await User.findOne({
				where: {
					email: email,
					password: password
				}
			});
			if ( !user ) return false;
			let token = await this.createToken(user);
			await this.saveTokenInRedis(token, user);

			return true;
		},
		async logout(token=null) {
			if ( !token ) return false;
			await RedisService.remove(token);
		},
		async createToken(user = null) {
			if ( !user ) return false;
			return await AuthToken.create({
						"user_id": user.id,
						"token": crypto.createHash("sha256")
										.update(JSON.stringify(user))
										.digest("hex")
					});

		},
		async getToken(user = null) {
			if ( !user || !user.id ) return false;
			return await AuthToken.findOne({
				where: {
					"user_id": user.id,
					"status": "Alive"
				}
			}).token ?? null;
		},
		async saveTokenInRedis(token, user) {
			console.log(`token: ${token.toString()}`);
			await RedisService.save(token.toString(), JSON.stringify(user));
			return true;
		},
		async removeTokenFromRedis(token) {
			await RedisService.remove(token.toString());

			return true;
		}
	}
}


module.exports = AuthService();