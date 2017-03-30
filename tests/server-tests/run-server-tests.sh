#!/bin/bash

# write to server-test-results.xml
echo '<?xml version="1.0" encoding="UTF-8"?><testsuites name="testsuites">' > tests/server-tests/test-results.xml

# run tests which generate their own testsuite element + testcases
# filter out general logging stuff
 #mocha -R xunit -u qunit tests/server-tests/ >> tests/server-tests/server-test-results.xml
 mocha -R xunit -u qunit tests/server-tests/ store/tests/server-tests/ idp/tests/server-tests/ | grep "<" >> tests/server-tests/test-results.xml 


# write closing testsuites to server-test-results.xml
echo '</testsuites>' >> tests/server-tests/test-results.xml

# show in the output window
cat tests/server-tests/test-results.xml
