
// rewire is awesome because not only can I mock the dependencies, I can overwrite methods on the 'class' under test!
//mocha -R xunit | grep "<" > reports/mocha.xml
//mocha -R xunit -u qunit tests/server-tests/middlewaretests.js

var rewire = require("rewire"),
  assert = require("assert"),
  path = require('path');


suite('urlSignKit_tests');

test('makeSignedUrl_test', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../services/urlSignKit.js");

  var objectid = "content/objectid.png",
    params = {
      Bucket: "bucket",
      Key: objectid,
      region: "region1",
      contentType: "image/png"
    },
    testSignedUrl = "testSignedUrl";

  // dont load node modules for faster performance and true unit'ness
  myModule.__set__({
    crypto: {},
    AWS: {},
    fs: {},
    url: {},
    //this.pemPath = path.join(__dirname, '..', cfg.pemPath);
    path: {
      join: function(args) {
        return "allTheArgsStrungTogether";
      }
    },
    nodeUtil: {},
    makeS3SignedUrl: function(params, logopts){
      assert.equal(params.Bucket, "bucket", "makeSignedUrl_test unexpected bucket");
      assert.equal(params.Key, objectid, "makeSignedUrl_test unexpected params.Key");
      assert.equal(params.region, "region1", "makeSignedUrl_test unexpected region");
      assert.equal(params.contentType, "image/png", "makeSignedUrl_test unexpected contentType");
      return testSignedUrl;
    }
  });

  var newModule = new myModule({});
  var methodUnderTest = newModule['makeSignedUrl'];

  // test that makeSignedUrl calls makeS3SignedUrl with params
  var signedUrl = methodUnderTest(params, {}, {username: "testuser"});
  assert.equal(signedUrl, testSignedUrl, "makeSignedUrl_test url unexpected");

});

test('removeFolderFromId_test', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../services/urlSignKit.js");
  // dont load node modules for faster performance and true unit'ness
  myModule.__set__({
    crypto: {},
    AWS: {},
    fs: {},
    url: {},
    //this.pemPath = path.join(__dirname, '..', cfg.pemPath);
    path: {},
    nodeUtil: {}
  });
  var objectid = "apps/objectid.png";
  var methodUnderTest = myModule.__get__('removeFolderFromId');
  var removedFolder = methodUnderTest(objectid);
  assert.equal(removedFolder, "objectid.png", "removeFolderFromId_test key unexpected");
});

test('makeCloudFrontSignedUrl_inline_test', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../services/urlSignKit.js");
  // dont load node modules for faster performance and true unit'ness
  myModule.__set__({
    crypto: {},
    AWS: {},
    fs: {},
    url: {},
    //this.pemPath = path.join(__dirname, '..', cfg.pemPath);
    path: {},
    nodeUtil: {}
  });
  var objectid = "apps/objectid.png",
    bMethodCalled = false;
  var params = {
      Bucket: "bucket",
      Key: objectid,
      region: "region1",
      contentType: "image/png"
    },
    testSignedUrl = "testSignedUrl";

  var newModule = new myModule({});
  newModule.cloudFrontSignedUrlMaker = function(objectId, contentDisposition, contentType) {
      bMethodCalled = true;
      assert.equal(contentDisposition, "inline;filename=objectid.png", "makeCloudFrontSignedUrl_test unexpected contentDisposition");
      return testSignedUrl;
  };

  var methodUnderTest = myModule.__get__('makeCloudFrontSignedUrl');
  var signedUrl = methodUnderTest.call(newModule, params);
  assert.ok(bMethodCalled, "makeCloudFrontSignedUrl_inline_test method not called");
  assert.equal(signedUrl, testSignedUrl, "makeCloudFrontSignedUrl_inline_test signed url unexpected");
});

test('makeCloudFrontSignedUrl_download_test', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../services/urlSignKit.js");
  // dont load node modules for faster performance and true unit'ness
  myModule.__set__({
    crypto: {},
    AWS: {},
    fs: {},
    url: {},
    //this.pemPath = path.join(__dirname, '..', cfg.pemPath);
    path: {},
    nodeUtil: {}
  });
  var objectid = "apps/moreapps/objectid.png",
    bMethodCalled = false;
  var params = {
      Bucket: "bucket",
      Key: objectid,
      region: "region1",
      contentType: "image/png",
      downloadable: true
    },
    testSignedUrl = "testSignedUrl";

  var newModule = new myModule({});
  newModule.cloudFrontSignedUrlMaker = function(objectId, contentDisposition, contentType) {
      bMethodCalled = true;
      assert.equal(contentDisposition, "attachment;filename=objectid.png", "makeCloudFrontSignedUrl_download_test unexpected contentDisposition");
      return testSignedUrl;
  };

  var methodUnderTest = myModule.__get__('makeCloudFrontSignedUrl');
  var signedUrl = methodUnderTest.call(newModule, params);
  assert.ok(bMethodCalled, "makeCloudFrontSignedUrl_download_test method not called");
  assert.equal(signedUrl, testSignedUrl, "makeCloudFrontSignedUrl_download_test signed url unexpected");
});

test('makeS3SignedUrl_inline_test', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../services/urlSignKit.js");
  // dont load node modules for faster performance and true unit'ness
  myModule.__set__({
    crypto: {},
    AWS: {},
    fs: {},
    url: {},
    //this.pemPath = path.join(__dirname, '..', cfg.pemPath);
    path: {},
    nodeUtil: {}
  });
  var objectid = "apps/moreapps/objectid.png",
    bMethodCalled = false,
    params = {
      Bucket: "bucket",
      Key: objectid,
      region: "region1",
      contentType: "image/png"
    },
    testSignedUrl = "testSignedUrl";

  var newModule = new myModule({});
  newModule.s3SignedUrlMaker = function (opts) {
      bMethodCalled = true;
      assert.equal(opts.contentDisposition, "inline;filename=objectid.png", "makeS3SignedUrl_test unexpected contentDisposition");
      return testSignedUrl;
  };

  var methodUnderTest = myModule.__get__('makeS3SignedUrl');
  var signedUrl = methodUnderTest.call(newModule, params);
  assert.ok(bMethodCalled, "makeS3SignedUrl_inline_test method not called");
  assert.equal(signedUrl, testSignedUrl, "makeS3SignedUrl_inline_test signed url unexpected");
});

test('makeS3SignedUrl_download_test', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../services/urlSignKit.js");
  // dont load node modules for faster performance and true unit'ness
  myModule.__set__({
    crypto: {},
    AWS: {},
    fs: {},
    url: {},
    //this.pemPath = path.join(__dirname, '..', cfg.pemPath);
    path: {},
    nodeUtil: {}
  });
  var objectid = "apps/objectid.png",
    bMethodCalled = false,
    params = {
      Bucket: "bucket",
      Key: objectid,
      region: "region1",
      contentType: "image/png",
      downloadable: true
    },
    testSignedUrl = "testSignedUrl";

  var newModule = new myModule({});

  newModule.s3SignedUrlMaker = function (opts) {
      bMethodCalled = true;
      assert.equal(opts.contentDisposition, "attachment;filename=objectid.png", "makeS3SignedUrl_download_test unexpected contentDisposition");
      return testSignedUrl;
  };

  var methodUnderTest = myModule.__get__('makeS3SignedUrl');
  var signedUrl = methodUnderTest.call(newModule, params);
  assert.ok(bMethodCalled, "makeS3SignedUrl_download_test method not called");
  assert.equal(signedUrl, testSignedUrl, "makeS3SignedUrl_download_test signed url unexpected");
});

suite('appStore_route_tests');

test('getThumbnail_test', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../routes/app-store.js");
  var testObjId = "testThumbnailObjectId.other"; // contentType = application/octet-stream
  var bMethodCalled = false;
  // dont load node modules for faster performance and true unit'ness
  myModule.__set__({
    lazy: {},
    path: {},
    async: {},
    mainutil: {
      findObjectKeyInUrl: function(path, prefix){
        assert.equal(prefix, "appStore/getThumbnail", "getThumbnail_test thumbnail prefix unexpected");
        return testObjId;
      },
      JWT_USER_PROPERTY: "jwt"
    },
    elasticsearch: {},
    getSignedUrlHelper: function(username, thumbnail, envConfig, res, downloadable){
      bMethodCalled = true;
      assert.ok(username, "getThumbnail_test should have username sent to getSignedUrlHelper");
      assert.ok(!downloadable, "getThumbnail_test should have non-downloadable");
      assert.equal(thumbnail, testObjId, "getThumbnail_test thumbnail thumbnailKey unexpected");
      assert.equal(envConfig.region, "testregion", "getThumbnail_test thumbnail testregion unexpected");
      assert.equal(envConfig.bucket, "testbucket", "getThumbnail_test thumbnail testbucket unexpected");
    }
  });
  var methodUnderTest = myModule.__get__('getThumbnail');

  var sentMsg = {},
      req = {
        app: {
          settings: {
            cfg: {
              credentials: {secretKey: "ab", secretPhrase: "secret1"},
              sessionDurationSecs: 3600,
              contentBucket: "testbucket",
              bucketRegion: "testregion"
            }
          }
        },
        _parsedUrl: {
          pathname: "req._parsedUrl.pathname"
        },
        query: {}

    };
  req.jwt = {
    roles: "storeuserrole",
    username: "getThumbnail_test"
  };

  methodUnderTest(req, "res", "next");
  assert.ok(bMethodCalled, "getThumbnail_test getSignedUrlHelper not called");
});


test('test_getMetadata', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../services/s3-fetch-metadata.js");
  var testObjId = "testObjectId",
    bGetMetadataHelperCalled = false;
  var thumbnailKey = "_thumbs/t.png",
    testThumbSignedUrl = "testSignedUrl",
    testSignedUrl = "testObjSignedUrl",
    testRtnObj = {
      key: testObjId,
      orientation: "up",
      thumbnail: thumbnailKey,
      s3DownloadUrl: testSignedUrl,
      signedUrls: {
        thumbnail: testThumbSignedUrl
      }
    },
    driveObj = {
        custFolder: "driveFolder",
        sessionDurationSecs: 3600,
        roleArn: "somerolearn",
        bucket: "somebucket",
        baseDriveRoleArn: "baseDriveRoleArn"
    };

  // dont load node modules for faster performance and true unit'ness
  myModule.__set__({
    path: {},
    util: {
      initDriveConfig: function(drive) {
        return Promise.resolve(driveObj);
      }
    },
    drives: {
      getDriveByFolderName: function(driveFolder) {
        return Promise.resolve(driveObj);
      }
    },
    urlSigner: {
      makeSignedUrl: function(params, credentials, logopts) {
        if (params.Key === thumbnailKey) {
          return thumbSignedUrl;
        }
        else if (params.Key === screenshotKey) {
          return screenshotSignedUrl;
        }
        else {
          return testSignedUrl;
        }

      }
    }
  });
  var methodUnderTest = myModule.__get__('getMetadata');
  var moduleLogger = myModule.__set__('logger', {
    info:function(arg){
      return arg;
    }
  });

  let cfg = {
    sessionDurationSecs: 36,
    bucketRoleArn: "bucketRoleArn",
    bucketRegion: "bucketRegion",
    contentBucket: "contentBucket"
  };
  let opts = {
    userToken: {username: "testusername"},
    objectId: testObjId,
    drive: "driveFolder"
  };

  methodUnderTest(cfg, opts)
    .then(function(sendObj) {
        assert.ok(!sentObj.Metadata, "test_getMetadata Metadata should have been deleted from obj");
        assert.equal(sentObj.orientation, "up", "test_getMetadata final object orientation not found");
        assert.ok(sentObj.key, "test_getMetadata final object key not found");
        assert.ok(sentObj.s3DownloadUrl, "test_getMetadata final object s3DownloadUrl not found");
        assert.equal(sentObj.key, testObjId, "test_getMetadata final object key unexpected");
        assert.equal(sentObj.s3DownloadUrl, testSignedUrl, "test_getMetadata final object s3DownloadUrl unexpected");
    })
    .catch(function(err) {
      assert.ok(false, "test_getMetadata Metadata fail")
    });

});

test('test_getMetadata_withScreenshot_andThumbnail', function(){

  var myModule = rewire("../../services/s3-fetch-metadata.js");
  var screenshotKey = "_screenshots/s.png",
    thumbnailKey = "_thumbs/s.png",
    testSignedUrl = "testSignedUrl",
    thumbSignedUrl = "testThumbSignedUrl",
    screenshotSignedUrl = "testSsSignedUrl",
    testObjId = "testObjId",
    s3Obj = {
      Key: testObjId,
      Metadata: {
        orientation: "up",
        thumbnail: thumbnailKey,
        screenshot1: screenshotKey
      }
    };

  var driveObj = {
        custFolder: "driveFolder",
        sessionDurationSecs: 3600,
        roleArn: "somerolearn",
        bucket: "somebucket",
        baseDriveRoleArn: "baseDriveRoleArn"
    };

  var testMethodName = "test_getMetadata_withScreenshot_andThumbnail";
  var hoMethodCalled = false;
  var s3 = {
      headObject: function(params, s3Callback){
          hoMethodCalled = true;
          s3Callback(null, s3Obj);
      },
      config: {
        credentials: {secretKey: "ab", secretPhrase: "secret1"}
      }
  };
  // dont load node modules for faster performance and true unit'ness
  myModule.__set__({
    path: {},
    util: {
      initDriveConfig: function(drive) {
        return Promise.resolve(driveObj);
      }
    },
    drives: {
      getDriveByFolderName: function(driveFolder) {
        return Promise.resolve(driveObj);
      }
    },
    urlSigner: {
      makeSignedUrl: function(params, credentials, logopts) {
        if (params.Key === thumbnailKey) {
          return thumbSignedUrl;
        }
        else if (params.Key === screenshotKey) {
          return screenshotSignedUrl;
        }
        else {
          return testSignedUrl;
        }

      }
    },
    initS3: function(opts) {
      return Promise.resolve(s3)
    }

  });
  var methodUnderTest = myModule.__get__('getMetadata');
  var moduleLogger = myModule.__set__('logger', {
    info:function(arg){
      return arg;
    }
  });

  let cfg = {
    sessionDurationSecs: 36,
    bucketRoleArn: "bucketRoleArn",
    bucketRegion: "bucketRegion",
    contentBucket: "contentBucket"
  };
  let opts = {
    userToken: {username: "testusername"},
    objectId: testObjId,
    drive: "driveFolder"
  };

  methodUnderTest(cfg, opts)
    .then(function(sendObj) {
        assert.ok(hoMethodCalled, testMethodName + " headObject method not called");
        assert.ok(!sentObj.Metadata, testMethodName + " Metadata should have been deleted from obj");
        assert.equal(sentObj.orientation, "up", testMethodName + " final object orientation not found");
        assert.ok(sentObj.key, testMethodName + " final object key not found");
        assert.equal(sentObj.key, testObjId, testMethodName + " final object key unexpected");
        assert.ok(sentObj.signedUrls, testMethodName + " signed url not found");
        assert.equal(Object.keys(sentObj.signedUrls).length, 2, testMethodName + " not enough signed urls");
        assert.equal(sentObj.signedUrls.thumbnail, thumbSignedUrl, testMethodName + " thumbnailSignedUrl unexpected");
        assert.equal(sentObj.signedUrls.screenshot1, screenshotSignedUrl, testMethodName + " screenshotSignedUrl unexpected");
        assert.equal(sentObj.s3DownloadUrl, testSignedUrl, testMethodName + " s3DownloadUrl unexpected");
    })
    .catch(function(err) {
      assert.ok(false, "test_getMetadata Metadata fail")
    });

});



test('getMarketingItems', function() {
    var myModule = rewire("../../routes/app-store.js");

    var testMethodName = "getMarketingItems",
      jwt_prop = "jwt",
      bMethodCalled = false;
    var userToken = {
      roles: "storeuserrole",
      username: testMethodName
    };
    var req = {
        app: {
          settings: {
            cfg: {
              credentials: {secretKey: "ab", secretPhrase: "secret1"},
              sessionDurationSecs: 3600,
              contentBucket: "testbucket"
            }
          }
        },
        _parsedUrl: {
          path: "appStore/getMarketingItems"
        },
        jwt: userToken
      };


    // dont load node modules for faster performance and true unit'ness
    myModule.__set__({
      path: {},
      mainutil: {
        JWT_USER_PROPERTY: jwt_prop,
        parseUri : function(arg){
          return {
            queryKey:{
              size: 15,
              from: 0
            }};
        }
      },
      elasticsearch: {},
      // still loading lazy
      getMarketingItemsHelper: function(cfg, size, from, userToken, res) {
        bMethodCalled = true;
        assert.equal(size, 15, testMethodName + " unexpected size from queryKey");
        assert.equal(from, 0, testMethodName + " unexpected from from queryKey");
        assert.equal(cfg.bucket, "testbucket", testMethodName + " unexpected testbucket");
        assert.equal(userToken.roles, "storeuserrole", testMethodName + " unexpected userroles");

      }
    });

    var methodUnderTest = myModule.__get__('getMarketingItems');
    methodUnderTest(req, "res", "next");

    assert.ok(bMethodCalled, testMethodName + " method not called");

});



test('listAllObjects', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../storeutil/util.js");

  // dont load node modules for faster performance and true unit'ness
  myModule.__set__({
    when: {},
    fs: {},
    path: {},
    awsauth: {}
    // still loading lazy
  });
  var methodUnderTest = myModule.__get__('listAllObjects');

  var params = {},
    s3 = {
      listObjects: function(params, listObjectsDone) {
        var data = {
          Contents: [{Key: "A"},{Key: "B"}],
          IsTruncated: true
        };
        // the second time through listAllObjects, the methodUnderTest changes
        //  the Contents Marker to the Key at the end of the list. Change IsTruncated
        //  to false here so not infinite loop. Also change data contents to mimic
        //  s3 to test returned allObjects in the cb.
        // S3 may not behave exactly the same way but at least allObjects is collecting objects
        if (params.Marker === "B") {
          data.IsTruncated = false;
          data.Contents = [{Key: "C"}];
        }
        listObjectsDone(null, data);
      }
    },
    bucket = "bucket",
    bCbCalled = false,
    contentLen = 0,
    cb = function(err, contents) {
      bCbCalled = true;
      contentLen = contents.length;
    };

  //listAllObjects(marker, s3, bucket, callback)
  methodUnderTest("marker", s3, bucket, cb);

  assert.ok(bCbCalled, "listAllObjects didn't return");
  assert.equal(contentLen, 3, "listAllObjects contents not length 3");
});

test('listAllObjects_repeat', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../storeutil/util.js");

  // dont load node modules for faster performance and true unit'ness
  myModule.__set__({
    when: {},
    fs: {},
    path: {},
    awsauth: {}
    // still loading lazy
  });
  var methodUnderTest = myModule.__get__('listAllObjects');

  var params = {},
    s3 = {
      listObjects: function(params, listObjectsDone) {
        var data = {
          Contents: [{Key: "A"},{Key: "B"}],
          IsTruncated: true
        };
        // the second time through listAllObjects, the methodUnderTest changes
        //  the Contents Marker to the Key at the end of the list. Change IsTruncated
        //  to false here so not infinite loop. Also change data contents to mimic
        //  s3 to test returned allObjects in the cb.
        // S3 may not behave exactly the same way but at least allObjects is collecting objects
        if (params.Marker === "B") {
          data.IsTruncated = false;
          data.Contents = [{Key: "C"}];
        }
        listObjectsDone(null, data);
      }
    },
    bucket = "bucket",
    bCbCalled = false,
    contentLen = 0,
    cb = function(err, contents) {
      bCbCalled = true;
      contentLen = contents.length;
    };

  //call it twice to make sure contentLen is still only 3
  methodUnderTest("marker", s3, bucket, cb);
  methodUnderTest("marker", s3, bucket, cb);

  assert.ok(bCbCalled, "listAllObjects_repeat didn't return");
  assert.equal(contentLen, 3, "listAllObjects_repeat contents not length 3");
});





function ok(expr, msg) {
  if (!expr) throw new Error(msg);
}

function qthrows ( block, expected, message ) {
  var actual,
    expectedOutput = expected,
    ok = false;
  try {
    block.call();
  } catch (e) {
    actual = e;
  }
  if ( actual ) {
    // we don't want to validate thrown error
    if ( actual instanceof expected ) {
      ok = true;
    // expected is a validation function which returns true is validation passed
    } else if ( expected.call( {}, actual ) === true ) {
      expectedOutput = null;
      ok = true;
    }
    if (!ok) throw new Error( message);

  } else {
    throw new Error( message);
  }
};

