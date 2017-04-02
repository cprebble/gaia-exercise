const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const path = require("path");
const util = require(path.join(__dirname, "..", "..", "..", "src", "helpers", "util"));

chai.should();
chai.use(sinonChai);

let sandbox = sinon.sandbox.create();

let Video = require(path.join(__dirname, "..", "..", "..", "src", "models", "video"));


describe("Video model", function () {

  // beforeEach(function () {
  //     // stub out the `subParam` method
  //     sandbox.stub(util, "subParam");
  //     sandbox.stub(util, "importFeed").returns(Promise.resolve({headers: {}, data: {}}));
  // });

  afterEach(function () {
      // completely restore all fakes created through the sandbox
      sandbox.restore();
  })

  it('finds Preview With Longest Duration', function() {

    //util.subParam(videosUrl, titleNid)
    //util.importfeed(viUrl).then((data) => { ...
    

    const testBody = {
      "titles": [
        {"preview":{"nid": 11, "duration": "11"}},
        {"preview":{"nid": 3, "duration": "3"}},
        {"preview":{"nid": 42, "duration": "42"}}
        ]
    };

    let testUrlX = "http://somelink/{tid}",
      testId = 1234,
      resolvedUrl = "http://somelink/" + testId,
      testLastModified = "Sun, 02 Apr 2017 14:25:07 +0000";

    let testData = {
      headers: {"last-modified": testLastModified}, 
      body: JSON.stringify(testBody)
    };
    
    let spSpy = sandbox.spy(util, "subParam");
    sandbox.stub(util, "importFeed").returns(Promise.resolve(testData));

    const video = new Video({settings: {logger: {
      info: function(args) {} // stub logger
    }}});

    video.findPreviewWithLongestDuration(testUrlX, testId)
      .then((previewData) => {
        chai.assert.isOk(previewData, "previewData is not ok");
        chai.assert.isOk(previewData.lastModified, "lastModified is not ok");
        chai.assert.isOk(previewData.data, "preview data is not ok");
        chai.assert.equal(previewData.lastModified, testLastModified, "lastModified doesn't match");
        chai.assert.equal(previewData.data.nid, 42, "greatest duration not found");
        return;

      })
      .catch((err) => {
        chai.assert.isNotOk(err, "unexpected err");
        return err;

      });

    sinon.assert.calledOnce(util.subParam);
    spSpy.should.have.been.calledWithExactly(testUrlX, testId);
    spSpy.should.have.returned(resolvedUrl);
    sinon.assert.calledOnce(util.importFeed);

  });


  it('finds preview nid', function() {

    const testBody = {
      "titles": [
        {
          "othernid": {
            "nid": "26686"
          },
          "preview":{
            "nid": "11", 
            "duration": "77"
          },
          "nid": "136236"
        }
      ]
    };

    let testUrlX = "http://somelink/{tid}",
      testId = 1234,
      resolvedUrl = "http://somelink/" + testId,
      testLastModified = "Sun, 02 Apr 2017 14:25:07 +0000";

    let testData = {
      headers: {"last-modified": testLastModified}, 
      body: JSON.stringify(testBody)
    };
    
    sandbox.stub(util, "subParam");
    sandbox.stub(util, "importFeed").returns(Promise.resolve(testData));

    const video = new Video({settings: {logger: {
      info: function(args) {} // stub logger
    }}});

    video.findPreviewWithLongestDuration(testUrlX, testId)
      .then((previewData) => {
        chai.assert.isOk(previewData, "previewData is not ok");
        chai.assert.isOk(previewData.lastModified, "lastModified is not ok");
        chai.assert.isOk(previewData.data, "preview data is not ok");
        chai.assert.equal(previewData.lastModified, testLastModified, "lastModified doesn't match");
        chai.assert.equal(previewData.data.nid, 11, "incorrect preview nid");
        return;

      })
      .catch((err) => {
        chai.assert.isNotOk(err, "unexpected err");
        return err;

      });

    sinon.assert.calledOnce(util.subParam);
    sinon.assert.calledOnce(util.importFeed);

  });


  it('error preview object not found', function() {

    const testBody = {
      "titles": [
        {
          "othernid": {
            "nid": "26686"
          },
          "nid": "136236"
        }
      ]
    };

    let testUrlX = "http://somelink/{tid}",
      testId = 1234,
      resolvedUrl = "http://somelink/" + testId,
      testLastModified = "Sun, 02 Apr 2017 14:25:07 +0000";

    let testData = {
      headers: {"last-modified": testLastModified}, 
      body: JSON.stringify(testBody)
    };
    
    
    sandbox.stub(util, "subParam");
    sandbox.stub(util, "importFeed").returns(Promise.resolve(testData));

    const video = new Video({settings: {logger: {
      info: function(args) {} // stub logger
    }}});

    video.findPreviewWithLongestDuration(testUrlX, testId)
      .then((previewData) => {
        chai.assert.isOk(previewData, "previewData is not ok");
        chai.assert.isOk(previewData.lastModified, "lastModified is not ok");
        chai.assert.equal(previewData.lastModified, testLastModified, "lastModified doesn't match");
        chai.assert.isNotOk(previewData.data, "expected undefined preview");
        return;

      })
      .catch((err) => {
        chai.assert.isNotOk(err, "unexpected err");
        return err;

      });

    sinon.assert.calledOnce(util.subParam);
    sinon.assert.calledOnce(util.importFeed);

  });


  it('importFeed throws error', function() {
    
      const testUrlX = "http://somelink/{tid}",
        testId = 1234,
        testError = "mytest error";

      sandbox.stub(util, "subParam");
      sandbox.stub(util, "importFeed").rejects(testError);

      const video = new Video({settings: {logger: {
        info: function(args) {} // stub logger
      }}});

      video.findPreviewWithLongestDuration(testUrlX, testId)
        .then((previewData) => {
          chai.assert.isNotOk(previewData, "previewData is not ok");
          return;

        })
        .catch((err) => {
          chai.assert.isOk(err, "unexpected err");
          chai.assert.equal(err, testError, "test error doesn't match");
          return err;

        });

      sinon.assert.calledOnce(util.subParam);
      sinon.assert.calledOnce(util.importFeed);
    
  });
  

  // force a reject and log
  //http://eng.wealthfront.com/2016/11/03/handling-unhandledrejections-in-node-and-the-browser/
  process.on('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(0); // exit with 0 so npm run script doesnt make an npm log
  });

});
