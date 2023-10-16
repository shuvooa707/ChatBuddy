function AuthHelper() {
	return {
		getToken() {
			return localStorage.getItem("_token");
		},
		setToken(token) {
			return localStorage.setItem("_token", token);
		},
		removeToken() {
			return localStorage.removeItem("_token");
		}
	}
}


export default AuthHelper();