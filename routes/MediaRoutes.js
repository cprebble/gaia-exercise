
const ireqp = require("request-promise"),
	timeout = require('connect-timeout');


const responseTimeout = 60 * 1000; // 1 minute instead of default 2 minutes
function haltOnTimedout(req, res, next){
  if (!req.timedout) {
    next();
  }
}

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


let longestPreviewMediaUrl = (req, res, next) => {

	let reqparams = req.params,
		cfg = req.app.settings.cfg,
		initialTid = reqparams.tid,
		vocabularyUrl = cfg.vocabularyUrl,
		vocabIndex = cfg.vocabularyIndex,
		videosUrl = cfg.videosUrl,
		mediaUrl = cfg.mediaUrl;
	let titleNid, previewNid, previewDuration;

	let voUrl = subParam(vocabularyUrl, initialTid);
console.log("\nlongestPreviewMediaUrl1", voUrl)


	importfeed(voUrl)
		.then((vocabData) => {
console.log("vocabData", vocabData)
			let jdata = JSON.parse(vocabData);
			titleNid = jdata.terms[vocabIndex].tid;
			return titleNid;

		})
		.then((titleNid) => {
			let viUrl = subParam(videosUrl, titleNid); //eg. "http://d6api.gaia.com/videos/term/26686"
console.log("\nlongestPreviewMediaUrl2", viUrl)
			return importfeed(viUrl);

		})
		.then((videosData) => {

			let jdata = JSON.parse(videosData),
				preview = jdata.titles[1].preview.contentId,
				title = jdata.titles[1].title;
	console.log("\nvideos data", preview, title)
			// TODO find media with longest preview

			previewNid = jdata.titles[2].preview.nid;
			previewDuration = jdata.titles[2].preview.duration;

			return previewNid;

		})
		.then((previewNid) => {

			let mUrl = subParam(mediaUrl, previewNid); //eg. "http://d6api.gaia.com/media/136191"
console.log("\nlongestPreviewMediaUrl3", mUrl)
			return importfeed(mUrl);

		})
		.then((mediaData) => {
			let jdata = JSON.parse(mediaData),
				bcHLS = jdata.mediaUrls.bcHLS;

			return res.json({
				bcHLS: bcHLS,
				titleNid: titleNid,
				previewNid: previewNid,
				previewDuration: previewDuration
			});

		})
		.catch((err) => {
			console.log(err);
			return res.send(err);
		});

}


module.exports = (app) => {
    logger = app.settings.logger;

    app.get("/terms/:tid/longest-preview-media-url", 
    	timeout(responseTimeout), 
    	haltOnTimedout, 
    	longestPreviewMediaUrl);

}

