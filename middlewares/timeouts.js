
const ctimeout = require('connect-timeout');


const requestTimeout = 30 * 1000; // 30 seconds instead of default 2 minutes
function haltOnTimedout(req, res, next){
  if (!req.timedout) {
    next();
  }
}

module.exports = {
	haltOnTimedout: haltOnTimedout,
	timeout: ctimeout(requestTimeout)
}