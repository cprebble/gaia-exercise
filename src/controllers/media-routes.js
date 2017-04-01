
const path = require("path"),
	moment = require("moment"),
	timeouts = require(path.join(__dirname, "..", "middlewares", "timeouts")),
	util = require(path.join(__dirname, "..", "helpers", "util"));

const subParam = util.subParam,
	importfeed = util.importfeed;

const Vocabulary = require(path.join(__dirname, "..", "models", "Vocabulary")),
	Video = require(path.join(__dirname, "..", "models", "Video")),
	Media = require(path.join(__dirname, "..", "models", "Media"));

let logger, vocabulary, videos, media;

const generateMD5Header = (str) => {
	let crypto = require("crypto"),
		algorithm = "md5",
		encoding = "hex";

		return crypto
			.createHash(algorithm)
			.update(str, "utf8")
			.digest(encoding)
	
	// checksum('This is my test text');         // e53815e8c095e270c6560be1bb76a65d
}

const generateHtmlRepresentation = (rtnobj) => {
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

const lastestLastModified = (savedLastModified, potentialLastModified) => {
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

const longestPreviewMediaUrl = (req, res, next) => {
	let baseUrl = req.protocol + "://" + req.headers.host;

	let reqparams = req.params,
		cfg = req.app.settings.cfg,
		initialTid = reqparams.tid,
		vocabularyUrl = cfg.vocabularyUrl,
		vocabIndex = cfg.vocabularyIndex,
		videosUrl = cfg.videosUrl,
		mediaUrl = cfg.mediaUrl;

	// keep track here for return object
	let titleNid, previewNid, previewDuration, lastModified;

	vocabulary.getVocabularyAtIndex(vocabularyUrl, initialTid, vocabIndex)
		.then((vocabObj) => {
			lastModified = vocabObj.lastModified;
			titleNid = vocabObj.data.tid;
			return videos.findPreviewWithLongestDuration(videosUrl, titleNid);
		})
		.then((previewObj) => {
			lastModified = lastestLastModified(lastModified, previewObj.lastModified);
			previewNid = previewObj.data.nid;
			previewDuration = previewObj.data.duration;
	console.log("\npreviewObj:", previewObj)
			return media.getBCHLS(mediaUrl, previewNid);

		})
		.then((bchlsData) => {
// console.log("\nbcHLS", bchlsData)
		 	lastModified = lastestLastModified(lastModified, bchlsData.lastModified);

			let rtnobj = {
				bcHLS: bchlsData.data,
				titleNid: titleNid,
				previewNid: previewNid,
				previewDuration: previewDuration
			};
			let md5 = generateMD5Header(JSON.stringify(rtnobj));
			res.set({
				"Content-MD5" : md5,
				"ETag": md5,
				"Last-Modified" : lastModified
			});
		 	res.vary("Accept")

			// if content-type is missing then return 4xx, json preferred, or html
			if (req.accepts("json")) {
				res.set({"Content-Type": "application/json"});
				return res.json(rtnobj);

			}
			else if (req.accepts("html")) {
				// consumed by humans
				let htmlRep = generateHtmlRepresentation(rtnobj);
				res.set({"Content-Type": "text/html; charset=utf-8"});
				return res.render("media-view", {
				 	title: "bcHLS",
					response: htmlRep
				});

			}
			else {
				let response = {
					p:"This server does not support a blank Content-Type."
				};
				res.status(406);
				let htmlRep = generateHtmlRepresentation(response);
				return res.render("media-view", {
					title: "Error: Content-Type",
					response: htmlRep
				});
			}

		})
		.catch((err) => {
			console.log(err); 	// for easier parsing by humans in dev
			logger.error(err);  // for parsing/filtering by say Kibana on log level, etc
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

