const { client } = require("../config/redis_config.js");

function RedisService() {
	return {
		async save(key=null, value = "") {
			if ( !key ) return new Error("Invalid Key");
			await client.save(key, value);
		},
		async get(key=null) {
			if ( !key ) return new Error("Invalid Key");
			return await client.get(key);
		},
		async remove(key=null) {
			if ( !key ) return new Error("Invalid Key");
			await client.del(key);
		},

	}
}


module.exports = RedisService();