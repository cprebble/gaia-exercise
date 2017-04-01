const path = require("path"),
	util = require(path.join(__dirname, "..", "helpers", "util"));

class Media {
    constructor(app) {
        this.logger = app.settings.logger;
    }

    getBCHLS (mediaUrl, previewNid) {

    	let mUrl = util.subParam(mediaUrl, previewNid); //eg. "http://d6api.gaia.com/media/136191"
        // this.logger.info({methodName: "getBCHLS", args: arguments}, mUrl);
		return util.importFeed(mUrl)
            .then((data) => {
// console.log("getBCHLS", mUrl, "\n", data)
                let lastModified = data.headers["last-modified"],
                    jdata = JSON.parse(data.body);
                return {lastModified: lastModified, data: jdata.mediaUrls.bcHLS};

            })
            .catch((err)=> {
                return err;
            });

    }

}

module.exports = Media;