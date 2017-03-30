
// rewire is awesome because not only can I mock the dependencies, I can overwrite methods on the 'class' under test!
//mocha -R xunit | grep "<" > reports/mocha.xml
//mocha -R xunit -u qunit tests/server-tests/middlewaretests.js

var rewire = require("rewire"),
  assert = require("assert"),
  path = require('path');

suite('date_tests');

test('isDate_iso_test', function(){
  // rewire acts exactly like require.
  var myModule = rewire("../../mainutil/util.js");

  //var isDate = function(datestr)
  var methodUnderTest = myModule.__get__('isDate');
  var testdatestr = "2016-02-20T00:00:00.000Z";

  var bdate = methodUnderTest(testdatestr);
  assert.ok(bdate, testdatestr + " should be a recognized as a date");
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

