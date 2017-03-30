const path = require("path");

const Controllers = (serverApp) => {
	const MediaRoutes = require(path.join(__dirname, 'MediaRoutes'));
	MediaRoutes(serverApp);
}


module.exports = Controllers;
