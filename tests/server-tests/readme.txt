
To debug server tests:

on command line in mobile directory:
mocha --debug-brk -u qunit tests/server-tests/

in another command line window:
node-inspector


in the browser:
http://localhost:8080/debug?port=5858


In this browser window, open the test or other script, set a breakpoint
and then click the blue debugging arrow to continue the debug session 
to your breakpoint.



NOTES:
Mocha: http://visionmedia.github.io/mocha/

Mocha options:
-R, --reporter <name>           specify the reporter to use
-u, --ui <name>                 specify user-interface (bdd|tdd|exports) 
									-defaults to bdd


We use qunit interface (test syntax), and xunit reporter syntax to add 
results to a junit xml format that Jenkins can read (see the 
run-server-tests.sh file).
mocha -R xunit -u qunit tests/server-tests/ store/tests/server-tests/ idp/tests/server-tests/


-g grep certain tests:
mocha --debug-brk -u qunit -g 'makeDate_steamboat_test'  tests/server-tests/ 
mocha -u qunit -g 'makeDate_steamboat_test'  tests/server-tests/ 
