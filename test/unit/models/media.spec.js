const sinon = require("sinon"),
  chai = require("chai"),
  sinonChai = require("sinon-chai"),
  path = require("path"),
  util = require(path.join(__dirname, "..", "..", "..", "src", "helpers", "util"));

chai.should();
chai.use(sinonChai);

let sandbox = sinon.sandbox.create();

let Media = require(path.join(__dirname, "..", "..", "..", "src", "models", "media"));


describe("Media model", function () {

  afterEach(function () {
      // completely restore all fakes created through the sandbox
      sandbox.restore();
  })

  it('finds bcHLS', function() {

    //util.subParam(mediaUrl, previewNid)
    //util.importfeed(mUrl).then((data) => { ...
    const media = new Media({settings: {logger: {}}});

    const testUrlX = "http://somelink/{tid}",
      testId = 1234,
      resolvedUrl = "http://somelink/" + testId,
      testLastModified = "Sun, 02 Apr 2017 14:25:07 +0000",
      testBCHLS = "http://mytestbchls/etc";

    const testBody = {
      "mediaUrls": {
          "bcHLS": testBCHLS
      }
    };

    const testData = {
      headers: {"last-modified": testLastModified}, 
      body: JSON.stringify(testBody)
    };
    
    const spSpy = sandbox.spy(util, "subParam");
    sandbox.stub(util, "importFeed").returns(Promise.resolve(testData));

    media.getBCHLS (testUrlX, testId)
      .then((bcHLSData) => {
        chai.assert.isOk(bcHLSData, "bcHLSData is not ok");
        chai.assert.isOk(bcHLSData.lastModified, "lastModified is not ok");
        chai.assert.isOk(bcHLSData.data, "bcHLS data is not ok");
        chai.assert.equal(bcHLSData.lastModified, testLastModified, "lastModified doesn't match");
        chai.assert.equal(bcHLSData.data, testBCHLS, "bcHLS not found");
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


  // force a reject and log
  //http://eng.wealthfront.com/2016/11/03/handling-unhandledrejections-in-node-and-the-browser/
  process.on('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(0); // exit with 0 so npm run script doesnt make an npm log
  });

});
