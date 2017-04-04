
const ireqp = require("request-promise");

function importFeed (feedurl) {
    let opts = {
    	url: feedurl,
    	headers: {
    		"Accept": "application/json"
    	},
		resolveWithFullResponse: true
    }

	return ireqp(opts)
		.then((response) => {
// console.log("\nutil.importfeed: ", feedurl, "\n", response.headers, "\n")
			return {headers: response.headers, body: response.body};
		})
		.catch((err) => {
			throw err;
		});
}


function subParam(subThisUrl, withThisValue) {
	const re = /{.+}/g;
	return subThisUrl.replace(re, withThisValue);
}


module.exports = {
  importFeed: importFeed,
  subParam: subParam
};