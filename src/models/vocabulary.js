const path = require("path");
const util = require(path.join(__dirname, "..", "helpers", "util"));

class Vocabulary {
    constructor(app) {
        this.logger = app.settings.logger;
    }

    getVocabularyAtIndex (vocabularyUrl, initialTid, vocabIndex) {

    	let voUrl = util.subParam(vocabularyUrl, initialTid); //eg. "http://d6api.gaia.com/vocabulary/1/26681"
        this.logger.info({methodName: "getVocabularyAtIndex", args: arguments}, voUrl);
		return util.importFeed(voUrl)
            .then((data) => {
                let lastModified = data.headers["last-modified"],
                    jdata = JSON.parse(data.body);
		        return {lastModified: lastModified, data: jdata.terms[vocabIndex]};
                
            })
            .catch((err)=> {
                throw err;
            });

    }

}

module.exports = Vocabulary;