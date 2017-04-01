/**
 * index.js provides the summary export for environment variables. It will
 * pull environment variables either from a local.env.json file or from the
 * deployment environment on Heroku. Exports on index.js are further refined
 * by input from `development.js`, `production.js`, and `test.js` depending
 * on which environment has been chosen to run.
 *
 * Variables can be accessed in the following manner:
 *   var config = require('./path/to/environment') // (no need for '/index.js')
 *   console.log(config.port);
 *   console.log(config.facebook.clientID);
 */


let path = require('path'),
  lazy = require('lazy.js'),
  nconf = require('nconf');

/**
 * nconf sets environment variables intelligently. Will try loading the
 * local.env file if it exists. Will also pull from the existing `process.env`
 * variable. This allows us to use local environment variables provided through
 * local.env, and the Heroku env variables provided through process.env.
 *
 * Format to use nconf is: nconf.get('variableName');
 *
 * Initialize nconf here.
 */
let startup = nconf
  // grab flags, e.g. --foo bar --> nconf.get('foo') === 'bar'
  .argv()
  // grab process.env
  .env()
   // load common.env
  .file('commonenv', { file: __dirname + '/common.env', format: nconf.formats.ini });


// nconf.use('argv');
// console.log("1",nconf.get("testvalue"), nconf.get("mongodbUrl"));
// nconf.env();
// console.log("2",nconf.get("testvalue"), nconf.get("mongodbUrl"));
// nconf.file({ file: __dirname + '/common.env', format: nconf.formats.ini });
// console.log("3",nconf.get("testvalue"), nconf.get("mongodbUrl"));



// add multiple files, hierarchically. notice the unique key for each file
//nconf.file('development', {file: __dirname + '/development.env', format: nconf.formats.ini});


let cfg = nconf.get();

// console.log("\nconfig/index cfg: ", cfg, JSON.stringify(nconf));
module.exports = cfg;


//nconf.file file : "somefile.cson", format : { stringify : cson.stringifySync, parse : cson.parseSync }



/*
// TODO: setting overrides in tests

'use strict';

let nconf = require('nconf');

module.exports = function (overrides) {
    if(overrides == undefined){
        overrides = {};
    }
    nconf.overrides(overrides).argv().env().
        file('user', nconf.get('user') || './user.json').
        file('global','./global.json').
        defaults(require('./config.json'));
    return nconf;
}
then in tests instead of require('./config.js') I can do require('./config.js')({overridden: "for this test"})

*/

