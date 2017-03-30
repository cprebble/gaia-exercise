const path = require("path"),
	util = require(path.join(__dirname, "..", "helpers", "util"));

class Media {
    constructor(app) {
        this.logger = app.settings.logger;
        
    }

    getBCHLS (mediaUrl, previewNid) {

    	let mUrl = util.subParam(mediaUrl, previewNid); //eg. "http://d6api.gaia.com/media/136191"
		return util.importfeed(mUrl)
            .then((mstr) => {
                let jdata = JSON.parse(mstr);
                return jdata.mediaUrls.bcHLS;
            })
            .catch((err)=> {
                return err;
            });

    }

}

module.exports = Media;