const path = require("path");
function HomeController() {
	return {
		index: (req, res) => {
			res.sendFile(path.join(__dirname, "../public", "home.html"));
			// res.sendFile(path.join(__dirname, "/../public/index.html"));

			// res.sendFile(path.join(__dirname, "/../public/home.html"));
		},
	}
}


module.exports = HomeController();