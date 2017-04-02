const sinon = require("sinon"),
  chai = require("chai"),
  sinonChai = require("sinon-chai"),
  path = require("path"),
  util = require(path.join(__dirname, "..", "..", "..", "src", "helpers", "util"));

chai.should();
chai.use(sinonChai);

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

    //util.subParam(videosUrl, titleNid)
    //util.importfeed(viUrl).then((data) => { ...
    const video = new Video({settings: {logger: {}}})

    let testUrlX = "http://hi/there/{tid}",
      testUrl = "http://hi/there/1234";
    let testData = {
      headers: {jump: "up"}, 
      body: '{"titles": [{"preview":{"nid": 1234, "duration": "12"}}]}'
    };
    
    let spSpy = sandbox.spy(util, "subParam");
    sandbox.stub(util, "importFeed").returns(Promise.resolve(testData));

    video.findPreviewWithLongestDuration(testUrlX, 1234)
      .then((data) => {
        
        chai.assert.isOk(data, "everything is ok");
  console.log("returned:", data)
        // assert.equal(data.headers.jump, "up", "== coerces values to strings");

      })
console.log("asserting")
    sinon.assert.calledOnce(util.subParam);
    spSpy.should.have.been.calledWithExactly(testUrlX, 1234);
    
    sinon.assert.calledOnce(util.importFeed);

  })

  it('fetches data2', function() {

    //subParam(videosUrl, titleNid)
    //util.importfeed(viUrl).then((data) => {
    const video = new Video({settings: {logger: {}}})

    let testUrlX = "http://hello/{tid}",
      testUrl = "http://hello/1234";
    let testData = {
      headers: {jump: "over"}, 
      body: '{"titles": [{"preview":{"nid": 9876, "duration": "12"}}]}'
    };
    
    let spSpy = sandbox.spy(util, "subParam");
    sandbox.stub(util, "importFeed").returns(Promise.resolve(testData));

    video.findPreviewWithLongestDuration(testUrlX, 9876)
      .then((data) => {
        
        chai.assert.isOk(data, "everything is ok");
  console.log("returned:", data)
        // assert.equal(data.headers.jump, "up", "== coerces values to strings");

      })
console.log("asserting")
    sinon.assert.calledOnce(util.subParam);
    spSpy.should.have.been.calledWithExactly(testUrlX, 9876);
    
    sinon.assert.calledOnce(util.importFeed);

  })

});
