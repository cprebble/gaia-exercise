
'use strict';

const express = require('express'),
    path = require('path'),
    errorhandler = require('errorhandler'),
    compression = require('compression'),
    fs = require('fs-extra'),
    os = require('os'), 
    hbs = require('hbs');

const cfg = require(path.join(__dirname, "config"));

const port = (process.env.PORT || 3000),
    oneDay = 86400000; // millisecs

const logdir = "logs";
fs.ensureDirSync(logdir);


const app = express();

app.engine('html', hbs.__express);
hbs.registerHelper('__', function(locale, msg) {
  return new hbs.SafeString(translators[locale].t(msg));
});

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


app.use(function (req, res, next) {
    //no caching
    res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
    res.setHeader('Expires', 0);
    res.setHeader('Pragma', 'no-cache');
    next();
});
app.use(compression());


const startServer = function(obj) {
    
    console.log("Starting server...");

    const logger = require(path.join(__dirname, 'helpers', 'logger'))(app, cfg);

    app.settings.logger = logger;
    app.settings.cfg = cfg;
    app.settings.port = port;

    const controllers = require(path.join(__dirname, 'controllers', 'index'));
    controllers(app);
    
    if (process.env.NODE_ENV === 'development') {
        // only use in development
        app.use(errorhandler({ dumpExceptions: true, showStack: true }));
    }

    app.listen(port);
    logger.info({},
        'Started server at ' + os.hostname() + ':' + port);

};

const exitHandler = function(err) {
    if (err) console.log("exitHandler err: " + err.stack);
    process.exit();
};

//do something when app is closing
process.on('exit', function() {
  exitHandler();
});

//catches ctrl+c event
process.on('SIGINT', function() {
  exitHandler();
});

process.on('SIGTERM',function(){
    exitHandler();
});

//catches uncaught exceptions
process.on('uncaughtException', function(err) {
  console.error("UNCAUGHT EXCEPTION", err.stack);
  exitHandler(err);
});

process.on('unhandledRejection', function(err, promise) {
  console.error("UNHANDLED REJECTION", err.stack);
  exitHandler(err);
});


startServer(cfg);


