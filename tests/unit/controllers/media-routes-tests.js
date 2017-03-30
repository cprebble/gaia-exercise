
// rewire is awesome because not only can I mock the dependencies, I can overwrite methods on the 'class' under test!
//mocha -R xunit | grep "<" > reports/mocha.xml
//mocha -R xunit -u qunit tests/server-tests/middlewaretests.js

var rewire = require("rewire"),
  assert = require("assert"),
  path = require('path');

suite('media_routes_tests');

test('media_routes_test', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../../src/controllers/media-routes.js");

  //var isDate = function(datestr)
  var methodUnderTest = myModule.__get__('longestPreviewMediaUrl');

  var bdate = methodUnderTest("req", "res", "next");
  assert.ok(methodUnderTest, "media_routes_test should be a recognized");
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

