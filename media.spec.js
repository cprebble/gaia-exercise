const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const path = require("path");
const util = require(path.join(__dirname, "..", "..", "..", "helpers", "util"));

chai.should();
chai.use(sinonChai);

let sandbox = sinon.sandbox.create();

let Media = require(path.join(__dirname, "..", "..", "..", "models", "media"));


describe("Media model", function () {

  afterEach(function () {
      // completely restore all fakes created through the sandbox
      sandbox.restore();
  })

  it('finds bcHLS', function() {

    const testUrlX = "http://somelink/{tid}";
    const testId = 1234;
    const resolvedUrl = "http://somelink/" + testId;
    const testLastModified = "Sun, 02 Apr 2017 14:25:07 +0000";
    const testBCHLS = "http://mytestbchls/etc";

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

    const media = new Media({settings: {logger: {
      info: function(args) {} // stub logger
    }}});

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

  it('importFeed throws error', function() {
    
      const testUrlX = "http://somelink/{tid}";
      const testId = 1234;
      const testError = "mytest error";

      sandbox.stub(util, "subParam");
      sandbox.stub(util, "importFeed").rejects(testError);

      const media = new Media({settings: {logger: {
        info: function(args) {} // stub logger
      }}});

      media.getBCHLS (testUrlX, testId)
        .then((bcHLSData) => {
          chai.assert.isOk(bcHLSData, "bcHLSData is not ok");
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
