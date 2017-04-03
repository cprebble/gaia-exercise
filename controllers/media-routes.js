
const path = require("path");
const moment = require("moment");
const crypto = require("crypto");
const timeouts = require(path.join(__dirname, "..", "middlewares", "timeouts"));
const util = require(path.join(__dirname, "..", "helpers", "util"));


const Vocabulary = require(path.join(__dirname, "..", "models", "vocabulary"));
const Video = require(path.join(__dirname, "..", "models", "video"));
const Media = require(path.join(__dirname, "..", "models", "media"));

let logger, vocabulary, videos, media;

// _ indicates "private" method, creates an md5 hash from the given str, 
//		for use in RESTful ETag and Content-MD5 headers
const _generateMD5Header = (str) => {
	let algorithm = "md5",
		encoding = "hex";

		return crypto
			.createHash(algorithm)
			.update(str, "utf8")
			.digest(encoding);
}

// _ indicates "private" method, creates an HTML representation of the data,
//	 it is recommended to return HTML representations if consumed by humans,
//	 and I'm following suit since Gaia does that with their endpoints.
const _generateHtmlRepresentation = (rtnobj) => {
	let htmlStr = "<response>";
	let keys = Object.keys(rtnobj),
		keyslen = keys.length;
	for (let ii=0; ii < keyslen; ii++) {
		let k = keys[ii];
		htmlStr += "<" + k + ">" + rtnobj[k] + "</" + k + ">";
	}
	htmlStr += "</response>";
	return htmlStr;
}

// check the existing lastModified date against the incoming one and return
//	 the more recent of the two
const _lastestLastModified = (savedLastModified, potentialLastModified) => {
	// keep the latest of all the resource calls
	let rtnval = savedLastModified;

	let ts = new Date(savedLastModified).getTime(),
		tp = new Date(potentialLastModified).getTime();
	if (isNaN(tp) || isNaN(ts)) {
		// return now "Fri, 31 Mar 2017 20:34:15 +0000""
		rtnval = moment().format("dddd, MMMM Do YYYY, h:mm:ss ZZ");
	}
	// return latest
	if (ts < tp) {
		rtnval = potentialLastModified;
	}
	return rtnval;

}

/*
	get the vocabulary at the initialTid given in the request,
		find the tid of the term at 0 vocabIndex
	fetch the videos at that tid and return the one with the
		longest duration
	get the bcHLS of that preview
	return and object with the bcHLS, the title id found in the 
		vocabulary, the preview id and the preview duration
*/
const longestPreviewMediaUrl = (req, res, next) => {
	
	let reqparams = req.params,
		cfg = req.app.settings.cfg,
		initialTid = reqparams.tid,
		vocabularyUrl = cfg.vocabularyUrl,
		vocabIndex = cfg.vocabularyIndex,
		videosUrl = cfg.videosUrl,
		mediaUrl = cfg.mediaUrl;

	// keep track here for return object
	let titleNid, previewNid, previewDuration, lastModified;

	return vocabulary.getVocabularyAtIndex(vocabularyUrl, initialTid, vocabIndex)
		.then((vocabObj) => {
	debugger
			lastModified = vocabObj.lastModified;
			titleNid = vocabObj.data.tid;
			return videos.findPreviewWithLongestDuration (videosUrl, titleNid);

		})
		.then((previewObj) => {
	debugger
			lastModified = _lastestLastModified(lastModified, previewObj.lastModified);
			previewNid = previewObj.data.nid;
			previewDuration = previewObj.data.duration;
			return media.getBCHLS(mediaUrl, previewNid);

		})
		.then((bchlsData) => {
	debugger
		 	lastModified = _lastestLastModified(lastModified, bchlsData.lastModified);
			let rtnobj = {
				bcHLS: bchlsData.data,
				titleNid: titleNid,
				previewNid: previewNid,
				previewDuration: previewDuration
			};
			let md5 = _generateMD5Header(JSON.stringify(rtnobj));
			res.set({
				"Content-MD5" : md5,
				"ETag": md5,
				"Last-Modified" : lastModified
			});
		 	res.vary("Accept")
		
			// if content-type is missing then return 406, else json preferred, or html
			if (req.accepts("json")) {
				res.set({"Content-Type": "application/json"});
				return res.json(rtnobj);

			}
			else if (req.accepts("html")) {
				// consumed by humans
				let htmlRep = _generateHtmlRepresentation(rtnobj);
				res.set({"Content-Type": "text/html; charset=utf-8"});
				return res.render("media-view", {
				 	title: "bcHLS",
					response: htmlRep
				});

			}
			else {
				// error in client request
				let response = {
					p:"This server does not support a blank Content-Type."
				};
				res.status(406);
				let htmlRep = _generateHtmlRepresentation(response);
				return res.render("media-view", {
					title: "Error: Content-Type",
					response: htmlRep
				});
			}

		})
		.catch((err) => {
			// server error
			console.log(err); 	// for easier parsing by humans in dev
			logger.error(err);  // for parsing/filtering by say Kibana, on log level, method, etc
			return res.status(500).end("Error: " + err);
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

