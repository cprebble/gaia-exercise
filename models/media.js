const path = require("path");
const util = require(path.join(__dirname, "..", "helpers", "util"));

class Media {
    constructor(app) {
        this.logger = app.settings.logger;
    }

    /** 
     * @description Get the bcHLS property within the mediaUrls.
     * @param {string} mediaUrl The url with which to fetch a particular mediaUrl.  
     * @param {string} The id of the particular media which is substituted into the url. 
     * @return {object} An object of lastModified value from the call to mediaUrl,
     *      and the value of the bcHLS. 
     */
    getBCHLS (mediaUrl, previewNid) {

    	let mUrl = util.subParam(mediaUrl, previewNid); //eg. "http://d6api.gaia.com/media/136191"
        this.logger.info({methodName: "getBCHLS", args: arguments}, mUrl);
		return util.importFeed(mUrl)
            .then((data) => {
                let lastModified = data.headers["last-modified"],
                    jdata = JSON.parse(data.body);
                return {lastModified: lastModified, data: jdata.mediaUrls.bcHLS};

            })
            .catch((err)=> {
                throw err;
            });

    }

}

module.exports = Media;