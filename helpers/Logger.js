

const path = require("path"),
	lazy = require('lazy.js'),
	bunyan = require('bunyan'),
	os = require('os');

//https://github.com/trentm/node-bunyan
//http://adam.herokuapp.com/past/2011/4/1/logs_are_streams_not_files/


// logger for logging all the routes, expressjs middleware logger
const connectLogger = require(path.join(__dirname, 'ConnectLogger'));


function makeLogger (cfg) {

	const cfgLoggerStreams = cfg.loggerStreams.split(","),
		loggerStreams = [];

	for (let ii = 0; ii < cfgLoggerStreams.length; ii++) {
		let cfgstream = cfgLoggerStreams[ii],
      sstream = lazy(savedStreams).findWhere({id: cfgstream});

		switch (cfgstream) {
          
          case "rotatingfile": //"id":"rotatingfile","logRotatePeriod":"1h","logRotateBackcopies":3
          	sstream.period = cfg.logRotatePeriod || "1d";
          	sstream.count = parseInt(cfg.logRotateBackcopies,10) || 3;
          	//sstream.path = cfgstream.filepath || "./logfile" + ".log";
          	sstream.path = "./logs/log-" + os.hostname() + "-" + ".log";
            break;

          case "stdout":
          	break;

          default:
            console.log("ERROR: Unrecognized loggerStream id: " + cfgstream.id);
            process.exit(1);

		}

		loggerStreams.push(sstream);
	}

/*
"fatal" (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
"error" (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
"warn" (40): A note on something that should probably be looked at by an operator eventually.
"info" (30): Detail on regular operation.
"debug" (20): Anything else, i.e. too verbose to be included in "info" level.
"trace" (10): Logging from external libraries used by your app or very detailed application logging.
*/

	const alogger = bunyan.createLogger({
		name: "gaia-exercise",
		src: true,
    level: cfg.logLevel,
		streams: loggerStreams,
	  serializers: bunyan.stdSerializers
	});

// 	logger.debug({
// "fatal (60)": "The service/app is going to stop or become unusable now. An operator should definitely look into this soon.",
// "error (50)": "Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).",
// "warn (40)": "A note on something that should probably be looked at by an operator eventually.",
// "info (30)": "Detail on regular operation.",
// "debug (20)": "Anything else, i.e. too verbose to be included in 'info' level.",
// "trace (10)": "Logging from external libraries used by your app or very detailed application logging."
// }, "Notes about Bunyan Logger: https://github.com/trentm/node-bunyan");

	//logger.level(cfg.logLevel); // set all streams to this level

    alogger.FATAL = 60;
    alogger.ERROR = 50;
    alogger.WARN = 40;
    alogger.INFO = 30;
    alogger.DEBUG = 20;
    alogger.TRACE = 10;

	return alogger;
};

module.exports = function(app, cfg) {
	let logger = makeLogger(cfg);
	app.use(connectLogger.connectLogger(logger, cfg));

	return logger;
};


let savedStreams = [
	{
	  id: "stdout",
      stream: process.stdout
    },
    {
    	/*
    	Rotating log files and nodejs cluster
    	you don't attempt to use Bunyan's log file rotation with the same file used in
    	multiple processes (i.e. the simple cluster case where the logger instance is created
    	before cluster.fork()ing). Some suggestions:
    	One idea (as @2fours hit on) is to have a separate file for each process (incorporating
    	either the pid or a worker id into the log file name). That means multiple sets of files.
    	Note that the Bunyan CLI doessupport merging multiple bunyan files in time order, so one
    	could have a cron job that merges rotated files via something like:
    	bunyan /var/log/my-app-*.log.0 -o bunyan > /var/log/my-app.log.0; rm -f /var/log/my-app-*.log.0
    	https://github.com/trentm/node-bunyan/issues/117#issuecomment-44804938
    	*/
      id: "rotatingFile",
      type: 'rotating-file',
      period: '1h',
      //period: '1d',   // daily rotation
      //count: 3,        // keep 3 back copies
      path: './logfile.log'  // log debug and above to a file
    }
    
];
