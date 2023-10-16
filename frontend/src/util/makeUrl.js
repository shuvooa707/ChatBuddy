const makeUrl = (path = "") => {
	let url = null;
	if ( window.API_URL ) {
		url = window.API_URL + "/" + path;
	} else {
		url = window.origin + "/" + path;
	}
	return url;
}


export default makeUrl;