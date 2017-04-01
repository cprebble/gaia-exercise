const sinon = require("sinon"),
  chai = require("chai"),
  sinonChai = require("sinon-chai"),
  path = require("path"),
  util = require(path.join(__dirname, "..", "..", "..", "helpers", "util"));

const assert = chai.assert;

let Video = require(path.join(__dirname, "..", "..", "..", "models", "video"));


before(function () {
  chai.use(sinonChai)
})

beforeEach(function () {
  this.sandbox = sinon.sandbox.create()
})

afterEach(function () {
  this.sandbox.restore()
})

describe("Video", function () {

  it('fetches data', function * () {

    //subParam(videosUrl, titleNid)
    //util.importfeed(viUrl).then((data) => {
    
    





    const url = 'google.com'
    const content = '<h1>title</h1>'
    const writeFileStub = this.sandbox.stub(fs, 'writeFile', function (filePath, fileContent, cb) {
      cb(null)
    })

    const requestStub = this.sandbox.stub(request, 'get', function (url, cb) {
      cb(null, null, content)
    })

    const result = yield webpage.saveWebpage(url)

    expect(writeFileStub).to.be.calledWith()
    expect(requestStub).to.be.calledWith(url)
    expect(result).to.eql('page')
  })

})






describe("Video", () => {
  describe("#constructor()", () => {
    it("requires app argument", () => {
      () => {
        new Video("app");
      }.should.throw(Error);

    });
    
  });

  describe('#width', () => {
    let rectangle;

    beforeEach(() => {
      rectangle = new Rectangle(10, 20);
    });

    it('returns the width', () => {
      rectangle.width.should.equal(10);
    });

    it('can be changed', () => {
      rectangle.width = 30;
      rectangle.width.should.equal(30);
    });

    it('only accepts numerical values', () => {
      () => {
        rectangle.width = 'foo';
      }.should.throw(Error);
    });
  });

  describe('#height', () => {
    let rectangle;

    beforeEach(() => {
      rectangle = new Rectangle(10, 20);
    });

    it('returns the height', () => {
      rectangle.height.should.equal(20);
    });

    it('can be changed', () => {
      rectangle.height = 30;
      rectangle.height.should.equal(30);
    });

    it('only accepts numerical values', () => {
      () => {
        rectangle.height = 'foo';
      }.should.throw(Error);
    });
  });

  describe('#area', () => {
    let rectangle;

    beforeEach(() => {
      rectangle = new Rectangle(10, 20);
    });

    it('returns the area', () => {
      rectangle.area.should.equal(200);
    });

    it('can not be changed', () => {
      () => {
        rectangle.area = 1000;
      }.should.throw(Error);
    });
  });

  describe('#circumference', () => {
    let rectangle;

    beforeEach(() => {
      rectangle = new Rectangle(10, 20);
    });

    it('returns the circumference', () => {
      rectangle.circumference.should.equal(60);
    });

    it('can not be changed', () => {
      () => {
        rectangle.circumference = 1000;
      }.should.throw(Error);
    });
  });
});
