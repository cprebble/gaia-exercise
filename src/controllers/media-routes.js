
const path = require("path"),
	timeouts = require(path.join(__dirname, "..", "middlewares", "timeouts")),
	util = require(path.join(__dirname, "..", "helpers", "util"));

const subParam = util.subParam,
	importfeed = util.importfeed;

const Vocabulary = require(path.join(__dirname, "..", "models", "Vocabulary")),
	Video = require(path.join(__dirname, "..", "models", "Video")),
	Media = require(path.join(__dirname, "..", "models", "Media"));

let logger, vocabulary, videos, media;


let longestPreviewMediaUrl = (req, res, next) => {

	let reqparams = req.params,
		cfg = req.app.settings.cfg,
		initialTid = reqparams.tid,
		vocabularyUrl = cfg.vocabularyUrl,
		vocabIndex = cfg.vocabularyIndex,
		videosUrl = cfg.videosUrl,
		mediaUrl = cfg.mediaUrl;

	// keep track here for return object
	let titleNid, previewNid, previewDuration;

	vocabulary.getVocabularyAtIndex(vocabularyUrl, initialTid, vocabIndex)
		.then((vocabObj) => {
			titleNid = vocabObj.tid;
			return titleNid;
		})
		.then((titleNid) => {
			return videos.findPreviewWithLongestDuration(videosUrl, titleNid);

		})
		.then((previewObj) => {
			previewNid = previewObj.nid;
			previewDuration = previewObj.duration;
			return media.getBCHLS(mediaUrl, previewNid);

		})
		.then((bcHLS) => {
			
			return res.json({
				bcHLS: bcHLS,
				titleNid: titleNid,
				previewNid: previewNid,
				previewDuration: previewDuration
			});

		})
		.catch((err) => {
			console.log(err); 	// for easier parsing by humans in dev
			logger.error(err);  // for parsing/filtering by say Kibana
			return res.send(err);
		});

}


module.exports = (app) => {
    logger = app.settings.logger;

    vocabulary = new Vocabulary(app);
    videos = new Video(app);
    media = new Media(app);

    app.get("/terms/:tid/longest-preview-media-url", 
		timeouts.timeout, 
    	timeouts.haltOnTimedout, 
    	longestPreviewMediaUrl);

}

