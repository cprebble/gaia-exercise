
const ireqp = require("request-promise");

function importfeed (feedurl) {
    let opts = {
    	url: feedurl,
    	headers: {
    		"Accept": "application/json"
    	}
    }
    return ireqp(opts);
}


function subParam(subThisUrl, withThisValue) {
	const re = /{.+}/g;
	return subThisUrl.replace(re, withThisValue);
}


module.exports = {
  importfeed: importfeed,
  subParam: subParam
};