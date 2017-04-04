const path = require("path");
const util = require(path.join(__dirname, "..", "helpers", "util"));

class Vocabulary {
    constructor(app) {
        this.logger = app.settings.logger;
    }

    /** 
     * @description Get the media vocabulary for a particular id.
     * @param {string} vocabularyUrl The url with which to fetch.  
     * @param {string} The id of the particular vocabulary which is substituted into the url. 
     * @param {number} The index into the terms of the vocabulary. 
     * @return {object} An object of the lastModified value from the call to vocabularyUrl,
     *      and the object found at the index. 
     */
    getVocabularyAtIndex (vocabularyUrl, initialTid, vocabIndex) {

    	let voUrl = util.subParam(vocabularyUrl, initialTid); //eg. "http://d6api.gaia.com/vocabulary/1/26681"
        this.logger.info({methodName: "getVocabularyAtIndex", args: arguments}, voUrl);
		return util.importFeed(voUrl)
            .then((data) => {
                let rtnobj;
                if (data) {
                    let lastModified = data.headers["last-modified"],
                        jdata = JSON.parse(data.body);
                    rtnobj = {lastModified: lastModified, data: jdata.terms[vocabIndex]};
                }
		        return rtnobj;
                
            })
            .catch((err)=> {
                throw err;
            });

    }

}

module.exports = Vocabulary;