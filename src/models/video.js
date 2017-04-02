const path = require("path");
const util = require(path.join(__dirname, "..", "helpers", "util"));
const lazy = require("lazy.js");

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

    /** 
     * @description Sort a list of video titles by the duration found on the preview subobject.
     * @param {array} titles A list of JSON objects from which to search for previews and their duration attribute.  
     * @return {array} A list sorted in descending order of duration attribute on the preview object.  
     */
    sortTitlesBackwardsByPreviewDuration (titles) {
        return lazy(titles).sortBy(this.previewDuration, true).toArray();
    }

    /** 
     * @description Find the preview with the longest duration.
     * @param {string} videosUrl The url from which to retrieve a list of video objects with previews.  
     * @param {string} titleNid The id of the video object list.  
     * @return {object} The preview JSON object with the longest duration.  
     */ 
    findPreviewWithLongestDuration (videosUrl, titleNid) {

    	let viUrl = util.subParam(videosUrl, titleNid); //eg. "http://d6api.gaia.com/videos/term/26686"
        this.logger.info({methodName: "findPreviewWithLongestDuration", args: arguments}, viUrl);
		return util.importFeed(viUrl)
            .then((data) => {
                let lastModified = data.headers["last-modified"],
                    jdata = JSON.parse(data.body);

                let sortedTitles = this.sortTitlesBackwardsByPreviewDuration(jdata.titles),
                    previewObj = sortedTitles[0].preview;

		        return {lastModified: lastModified, data: previewObj};
            })
            .catch((err)=> {
                throw err;
            });

    }

}

module.exports = Video;