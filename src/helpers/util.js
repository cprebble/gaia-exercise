
const ireqp = require("request-promise");

function importfeed (feedurl) {
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
			return err;
		});
}


function subParam(subThisUrl, withThisValue) {
	const re = /{.+}/g;
	return subThisUrl.replace(re, withThisValue);
}


module.exports = {
  importfeed: importfeed,
  subParam: subParam
};