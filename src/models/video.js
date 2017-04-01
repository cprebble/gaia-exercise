const path = require("path"),
    util = require(path.join(__dirname, "..", "helpers", "util")),
	lazy = require("lazy.js");

class Video {
    constructor(app) {
        this.logger = app.settings.logger;
    }

    previewDuration (titleObj) {
        let duration = 0;
        if (titleObj.preview && titleObj.preview.duration) {
            duration = parseInt(titleObj.preview.duration, 10);
        }
        return  duration;
    }

    sortTitlesBackwardsByPreviewDuration (titles) {
        return lazy(titles).sortBy(this.previewDuration, true).toArray();
    }

    findPreviewWithLongestDuration (videosUrl, titleNid) {

    	let viUrl = util.subParam(videosUrl, titleNid); //eg. "http://d6api.gaia.com/videos/term/26686"
        // this.logger.info({methodName: "findPreviewWithLongestDuration", args: arguments}, viUrl);
		return util.importFeed(viUrl)
            .then((data) => {
debugger;
                let lastModified = data.headers["last-modified"],
                    jdata = JSON.parse(data.body);

                let sortedTitles = this.sortTitlesBackwardsByPreviewDuration(jdata.titles),
                    previewObj = sortedTitles[0].preview;

		        return {lastModified: lastModified, data: previewObj};
            })
            .catch((err)=> {
                return err;
            });

    }

}

module.exports = Video;