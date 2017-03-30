const path = require("path"),
	util = require(path.join(__dirname, "..", "helpers", "util"));

class Vocabulary {
    constructor(app) {
        this.logger = app.settings.logger;
        
    }

    getVocabularyAtIndex (vocabularyUrl, initialTid, vocabIndex) {

    	let voUrl = util.subParam(vocabularyUrl, initialTid); //eg. "http://d6api.gaia.com/vocabulary/1/26681"
		return util.importfeed(voUrl)
            .then((vstr) => {
                let jdata = JSON.parse(vstr);
		        return jdata.terms[vocabIndex];
            })
            .catch((err)=> {
                return err;
            });

    }

}

module.exports = Vocabulary;