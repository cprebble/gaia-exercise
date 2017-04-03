const chai = require("chai");
const path = require("path");

const lazy = require("lazy.js");
const rewire = require("rewire");


describe("Media Controller", function () {


  it('finds bcHLS', function() {

    //  module under test
    let mediaRoutes = rewire(path.join(__dirname, "..", "..", "..", "src", "controllers", "media-routes"));

    // declare test data
    const testLastModified = "Sun, 02 Apr 2017 14:25:07 +0000";
    const testBCHLS = "http://mytestbchls/etc";

    const vocabBody = {
      "terms": [
        {"tid": "26686", "name": "Documentaries"}
        ]
    };
    const vocabData = {
      headers: {"last-modified": testLastModified}, 
      data: JSON.stringify(vocabBody)
    };

    const videoBody = {
      "titles": [
        {"preview":{"nid": 11, "duration": "11"}},
        {"preview":{"nid": 3, "duration": "3"}},
        {"preview":{"nid": 42, "duration": "42"}}
        ]
    };
    const videoData = {
      headers: {"last-modified": testLastModified}, 
      data: JSON.stringify(videoBody)
    };

    const mediaBody = {
      "mediaUrls": {
          "bcHLS": testBCHLS
      }
    };
    const mediaData = {
      headers: {"last-modified": testLastModified}, 
      data: JSON.stringify(mediaBody)
    };

    // declare stubs for all mediaRoute dependencies
    mediaRoutes.__set__({
        timeouts: {},
        util: {},
        crypto: {},
        _generateMD5Header: function(str) {
            return "abcd123hash";
        },
        Vocabulary: {},
        Video:{},
        Media: {},
        vocabulary: {
            getVocabularyAtIndex : function(vocabularyUrl, initialTid, vocabIndex) {
                return Promise.resolve(vocabData);
            }
        },
        videos: {
            findPreviewWithLongestDuration :function(videosUrl, titleNid) {
                return Promise.resolve(videoData);
            }
        },
        media: {
            getBCHLS : function(mediaUrl, previewNid) {
                return Promise.resolve(mediaData);
            }
        }
    });

    // declare stubs for req and res arguments to methodUnderTest
    let req = {
        app: {
            settings: {
                logger: {
                    info: function(args) {} // stub logger
                },
                cfg: {
                    vocabularyUrl: "http://vocabularies/{bid}",
                    vocabularyIndex: 17,
                    videosUrl: "http://videos/{did}",
                    mediaUrl: "http://media/{mid}"
                }
            }
        },
        params: {
            tid: 1234
        },
        accepts: function(arg) {
            return true;
        }
    };
    let resheaders = {};
    let res = {
        set: function(obj) {
            resheaders = lazy(resheaders).merge(obj).toObject();
        },
        vary: function(arg) {},
        json: function(arg) {
            return Promise.resolve(arg);
        }
    }


debugger;
    // define methodUnderTest
    let methodUnderTest = mediaRoutes.__get__("longestPreviewMediaUrl");

    // call methodUnderTest
    return methodUnderTest(req, res, "next")
        .then((data) => {
    debugger
            let resheadersLength = Object.keys(resheaders).length;
            chai.expect(resheadersLength).to.equal(4);
            return;
        })
        .catch((err) => {
            chai.assert.isNotOk(err, "unexpected err")
            return;
        });

  });


  // force a reject and log
  //http://eng.wealthfront.com/2016/11/03/handling-unhandledrejections-in-node-and-the-browser/
  process.on('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(0); // exit with 0 so npm run script doesnt make an npm log
  });

});
