const path = require("path");

const Controllers = (serverApp) => {
	const MediaRoutes = require(path.join(__dirname, 'media-routes'));
	MediaRoutes(serverApp);
}

module.exports = Controllers;
