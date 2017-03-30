#!/bin/bash

# write to server-test-results.xml
echo '<?xml version="1.0" encoding="UTF-8"?><testsuites name="testsuites">' > tests/unit/test-results.xml

# run tests which generate their own testsuite element + testcases
# filter out general logging stuff
 #mocha -R xunit -u qunit tests/unit/ >> tests/unit/server-test-results.xml
 mocha -R xunit -u qunit tests/unit/controllers | grep "<" >> tests/unit/test-results.xml 


# write closing testsuites to server-test-results.xml
echo '</testsuites>' >> tests/unit/test-results.xml

# show in the output window
cat tests/unit/test-results.xml
