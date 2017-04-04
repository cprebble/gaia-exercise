
const lazy = require("lazy.js");
const rewire = require("rewire");

const sinon = require("sinon");
const chai = require("chai");
const path = require("path");
const util = require(path.join(__dirname, "..", "..", "..", "helpers", "util"));

let sandbox = sinon.sandbox.create();

// import these classes, make new ones and stub them to return test data
let Vocabulary = require(path.join(__dirname, "..", "..", "..", "models", "vocabulary"));
let Video = require(path.join(__dirname, "..", "..", "..", "models", "video"));
let Media = require(path.join(__dirname, "..", "..", "..", "models", "media"));


describe("Media Controller", function () {

  afterEach(function () {
      // completely restore all fakes created through the sandbox
      sandbox.restore();
  })

  it('finds preview bcHLS data', function() {

    //  module under test
    let mediaRoutes = rewire(path.join(__dirname, "..", "..", "..", "controllers", "media-routes"));

    // declare test data
    const testLastModified = "Sun, 02 Apr 2017 14:25:07 +0000";
    const testBCHLS = "http://mytestbchls/etc";
    const loggerConfig = {settings: {logger: {
      info: function(args) {} // stub logger
    }}};
    const testTitleNid = "777";
    const testPreviewNid = 42;
    const testPreviewDuration = "42";

    const vocabData = {
        "lastModified": testLastModified,  
        data: {"tid": testTitleNid, "name": "Documentaries"}
    };

    const videoData = {
      "lastModified": testLastModified, 
      data: {"nid": testPreviewNid, "duration": testPreviewDuration}
    };

    const mediaData = {
      "lastModified": testLastModified, 
      data: testBCHLS
    };

    // model stubs return promises of above test data
    let vocabulary = new Vocabulary(loggerConfig),
        video = new Video(loggerConfig),
        media = new Media(loggerConfig);
    let vocStub = sandbox.stub(vocabulary, "getVocabularyAtIndex").returns(Promise.resolve(vocabData));
    let VidStub = sandbox.stub(video, "findPreviewWithLongestDuration").returns(Promise.resolve(videoData));
    let medStub = sandbox.stub(media, "getBCHLS").returns(Promise.resolve(mediaData));

    // declare stubs for all mediaRoute dependencies since this is a unit test
    mediaRoutes.__set__({
        timeouts: {},
        util: {},
        crypto: {},
        _generateMD5Header: function(str) {
            return "abcd123hash";
        },
        Vocabulary: {},
        Video: {},
        Media: {},
        vocabulary: vocabulary,
        videos: video,
        media: media
    });

    // declare stubs for req and res arguments to methodUnderTest
    let req = {
        app: loggerConfig, // reuse loggerConfig defined above
        params: {
            tid: 1234
        },
        accepts: function(arg) {
            return true;
        }
    };
    req.app.settings.cfg = {
        vocabularyUrl: "http://vocabularies/{bid}",
        vocabularyIndex: 17,
        videosUrl: "http://videos/{did}",
        mediaUrl: "http://media/{mid}"
    };

    // media-routes.longestPreviewMediaUrl sets 4 response headers in branch of this test
    let resheaders = {};
    let res = {
        set: function(obj) {
            resheaders = lazy(resheaders).merge(obj).toObject();
        },
        vary: function(arg) {},
        json: function(arg) {
// test data passed to res.json in longestPreviewMediaUrl line 117:
// { bcHLS: 'http://mytestbchls/etc',
//   titleNid: '777',
//   previewNid: "42",
//   previewDuration: "42" }
            chai.assert.isOk(arg, "res.json argument is not ok");
            chai.assert.equal(arg.bcHLS, testBCHLS, "res.json bcHLS argument is not equal");
            chai.assert.equal(arg.titleNid, testTitleNid, "res.json titleNid argument is not equal");
            chai.assert.equal(arg.previewNid, testPreviewNid, "res.json previewNid argument is not equal");
            chai.assert.equal(arg.previewDuration, testPreviewDuration, "res.json previewDuration argument is not equal");
            return Promise.resolve(arg);
        }
    }

    // define methodUnderTest
    let methodUnderTest = mediaRoutes.__get__("longestPreviewMediaUrl");

    // call methodUnderTest
    return methodUnderTest(req, res, "next")
        .then((data) => {
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
