const path = require("path"),
    util = require(path.join(__dirname, "..", "helpers", "util")),
	lazy = require("lazy.js");

class Video {
    constructor(app) {
        this.logger = app.settings.logger;
        
    }

    findPreviewWithLongestDuration (videosUrl, titleNid) {

    	let viUrl = util.subParam(videosUrl, titleNid); //eg. "http://d6api.gaia.com/videos/term/26686"
		return util.importfeed(viUrl)
            .then((vstr) => {
                let jdata = JSON.parse(vstr);
		        return jdata.titles[2].preview;
            })
            .catch((err)=> {
                return err;
            });

    }

}

module.exports = Video;