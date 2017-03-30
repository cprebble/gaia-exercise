

NOTES:
Mocha: http://visionmedia.github.io/mocha/

Mocha options:
-R, --reporter <name>           specify the reporter to use
-u, --ui <name>                 specify user-interface (bdd|tdd|exports) 
									-defaults to bdd


We use qunit interface (test syntax), and xunit reporter syntax to add 
results to a junit xml format that Jenkins can read (see the 
run-unit-tests.sh file).

mocha -R xunit -u qunit tests/unit/controllers/ tests/unit/models/ tests/unit/helpers etc
mocha -R spec -u qunit tests/unit/controllers/


-g grep certain tests:
mocha --debug-brk -u qunit -g 'makeDate_steamboat_test'  tests/unit/helpers
mocha -u qunit -g 'makeDate_steamboat_test'  tests/unit/helpers
