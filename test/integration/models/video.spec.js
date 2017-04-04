const sinon = require("sinon"),
  chai = require("chai"),
  sinonChai = require("sinon-chai"),
  path = require("path"),
  util = require(path.join(__dirname, "..", "..", "..", "helpers", "util"));

chai.should();
chai.use(sinonChai);

let sandbox = sinon.sandbox.create();

let Video = require(path.join(__dirname, "..", "..", "..", "models", "video"));


describe("Video model", function () {

  it('Really does find preview with longest duration', function() {

    // actually hits endpoints
    //util.subParam(videosUrl, titleNid)
    //util.importfeed(viUrl).then((data) => { ...
    const video = new Video({settings: {logger: {
      info: function(args) {} // stub logger
    }}});

    const videoUrl = "http://d6api.gaia.com/videos/term/{tid}",
        tid = "26686",
        previewNid = "41096";

    return video.findPreviewWithLongestDuration(videoUrl, tid)
      .then((previewData) => {
        chai.assert.isOk(previewData, "previewData is not ok");
        chai.assert.isOk(previewData.lastModified, "lastModified is not ok");
        chai.assert.isOk(previewData.data, "preview data is not ok");
        chai.assert.equal(previewData.data.nid, previewNid, "unexpected preview id");
        return;

      })
      .catch((err) => {
        chai.assert.isNotOk(err, "unexpected err");
        return err;

      });

  });


  process.on('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(0); // exit with 0 so npm run script doesnt make an npm log
  });

});
