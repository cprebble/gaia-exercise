const sinon = require("sinon"),
  chai = require("chai"),
  sinonChai = require("sinon-chai"),
  path = require("path"),
  util = require(path.join(__dirname, "..", "..", "..", "src", "helpers", "util"));

const assert = chai.assert,
  expect = chai.expect;

let sandbox = sinon.sandbox.create();

let Video = require(path.join(__dirname, "..", "..", "..", "src", "models", "video"));


describe("Video", function () {

  // beforeEach(function () {
  //     // stub out the `subParam` method
  //     sandbox.stub(util, "subParam");
  //     sandbox.stub(util, "importFeed").returns(Promise.resolve({headers: {}, data: {}}));
  // });

  afterEach(function () {
      // completely restore all fakes created through the sandbox
      sandbox.restore();
  })

  it('fetches data', function() {

    //subParam(videosUrl, titleNid)
    //util.importfeed(viUrl).then((data) => {
    const video = new Video({settings: {logger: {}}})

    let url = "http://hi/there"
    
    sandbox.stub(util, "subParam").returns(url);
    sandbox.stub(util, "importFeed").returns(Promise.resolve({headers: {jump: "up"}, body: "{}"}));

    video.findPreviewWithLongestDuration("oh/my", 1234)
      .then((data) => {
  
        assert.isOk(data, "everything is ok");
  console.log("returned:", data)
        // assert.equal(data.headers.jump, "up", "== coerces values to strings");

      })
    sinon.assert.calledOnce(util.subParam)
    sinon.assert.calledOnce(util.importFeed)

  })

});
