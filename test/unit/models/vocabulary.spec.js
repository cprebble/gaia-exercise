const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const path = require("path");
const util = require(path.join(__dirname, "..", "..", "..", "helpers", "util"));

chai.should();
chai.use(sinonChai);

let sandbox = sinon.sandbox.create();

let Vocabulary = require(path.join(__dirname, "..", "..", "..", "models", "vocabulary"));


describe("Vocabulary model", function () {

  afterEach(function () {
      // completely restore all fakes created through the sandbox
      sandbox.restore();
  })

  it('finds first term', function() {

    const testUrlX = "http://somelink/{tid}",
      testId = 1234,
      resolvedUrl = "http://somelink/" + testId,
      testLastModified = "Sun, 02 Apr 2017 14:25:07 +0000";

    const testBody = {
      "terms": [
        {"tid": "26686", "name": "Documentaries"},
        {"tid": "26691", "name": "Films"}
        ]
    };

    const testData = {
      headers: {"last-modified": testLastModified}, 
      body: JSON.stringify(testBody)
    };
    
    const spSpy = sandbox.spy(util, "subParam");
    sandbox.stub(util, "importFeed").returns(Promise.resolve(testData));

    const vocabulary = new Vocabulary({settings: {logger: {
      info: function(args) {} // stub logger
    }}});

    return vocabulary.getVocabularyAtIndex (testUrlX, testId, 0)
      .then((vdata) => {
        chai.assert.isOk(vdata, "vdata is not ok");
        chai.assert.isOk(vdata.lastModified, "lastModified is not ok");
        chai.assert.isOk(vdata.data, "vdata.data is not ok");
        chai.assert.equal(vdata.lastModified, testLastModified, "lastModified doesn't match");
        chai.assert.equal(vdata.data.tid, testBody.terms[0].tid, "first term not found");

        sinon.assert.calledOnce(util.subParam);
        spSpy.should.have.been.calledWithExactly(testUrlX, testId);
        spSpy.should.have.returned(resolvedUrl);
        sinon.assert.calledOnce(util.importFeed);
        
        return;

      })
      .catch((err) => {
        chai.assert.isNotOk(err, "unexpected err");
        return err;

      });

    

  });

  it('importFeed throws error', function() {
    
      const testUrlX = "http://somelink/{tid}",
        testId = 1234,
        testError = "mytest error";

      sandbox.stub(util, "subParam");
      sandbox.stub(util, "importFeed").rejects(testError);

      const vocabulary = new Vocabulary({settings: {logger: {
        info: function(args) {} // stub logger
      }}});

      return vocabulary.getVocabularyAtIndex (testUrlX, testId, 0)
        .then((vdata) => {
          chai.assert.isNoOk(vdata, "vdata is ok");
          return;

        })
        .catch((err) => {
          chai.assert.isOk(err, "unexpected err");
          chai.assert.equal(err, testError, "test error doesn't match");
          sinon.assert.calledOnce(util.subParam);
          sinon.assert.calledOnce(util.importFeed);
          return err;

        });
  });


  // force a reject and log
  //http://eng.wealthfront.com/2016/11/03/handling-unhandledrejections-in-node-and-the-browser/
  process.on('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(0); // exit with 0 so npm run script doesnt make an npm log
  });

});
