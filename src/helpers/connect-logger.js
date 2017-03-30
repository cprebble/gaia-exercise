
let DEFAULT_FIELDS = ["url","method","status","responseTime","contentLength","reqheaders","remoteAddress","username","env","client","params"];
let path = require('path');

function getLogger(logger, options) {

	let thislogger = logger
  , level = options.logLevel || "info"
  , fmtfields = options.loggerFields || DEFAULT_FIELDS;

  return function (req, res, next) {

			let start = new Date()
			, statusCode
			, writeHead = res.writeHead
			, end = res.end
			, url = req.originalUrl;

			// flag as logging - FWi cp nix for multiple appenders
			//req._logging = true;

			// proxy for statusCode.
			res.writeHead = function(code, headers){
				res.writeHead = writeHead;
				res.writeHead(code, headers);
				res.__statusCode = statusCode = code;
				res.__headers = headers || {};

			};

			// proxy end to output a line to the provided logger.
			res.end = function(chunk, encoding) {
				res.end = end;
				res.end(chunk, encoding);
				res.responseTime = new Date() - start;

				//thislogger.debug({req:format(fmtfields, req, res)}, "Expressjs request");

			};


    //ensure next gets always called
    next();
  };
};

//"cookie": "connect.sid=s%3AzYW3oJQ9qn1Fgod2moORQEW5.KcAekJYKScQAe1491llMHFybh588TDhei5KU7Ybwgsk; userPermissions=%7B%22username%22%3A%22cust1%22%2C%22downloadPermission%22%3A%22true%22%2C%22token%22%3A%22zYW3oJQ9qn1Fgod2moORQEW5%22%7D"
function reqheaderSerializer (reqheaders) {
  let rtnobj = {};
  for (let h in reqheaders) {
    if (h === "cookie") {
      rtnobj.cookie = unescape(reqheaders.cookie);
    }
    else if (h.toLowerCase() === "authorization") {
      // skip logging authorization

    }
    else {
      rtnobj[h] = reqheaders[h];
    }
  }
  return rtnobj;
};

/**
 * Return formatted log line.
 *
 * @param  {String} str
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @return {String}
 * @api private
 */

function format(fields, req, res) {
  let rtnobj = {};
  for (let ii = 0; ii < fields.length; ii++) {
    let f = fields[ii];
    switch (f) {
      case 'url':
        rtnobj.url = req.originalUrl;
        break;
      case 'method':
        rtnobj.method = req.method;
        break;
      case 'status':
        rtnobj.status = (res.__statusCode || res.statusCode);
        break;
      case 'responseTime':
        rtnobj.responseTime = res.responseTime;
        break;
      case 'date':
        rtnobj.date = new Date().toUTCString();
        break;
      case 'referrer':
        rtnobj.referrer = (req.headers.referer || req.headers.referrer || '');
        break;
      case 'userAgent':
        rtnobj.userAgent = (req.headers['user-agent'] || '');
        break;
      case 'contentLength':
        rtnobj.contentLength = ((res._headers && res._headers['content-length']) ||
                            (res.__headers && res.__headers['Content-Length']) ||
                            '-');
        break;
      case 'remoteAddress':
        rtnobj.remoteAddress = (req.ip || req.ips || req._remoteAddress || (
            req.socket &&
              (req.socket.remoteAddress || (req.socket.socket && req.socket.socket.remoteAddress))
          ));
        break;
      case 'reqheaders':
        rtnobj.headers = reqheaderSerializer(req.headers);
        break;
      // case 'username':
      //   rtnobj.username = req[util.JWT_USER_PROPERTY] && req[util.JWT_USER_PROPERTY].username;
      //   break;
      case 'client':
        rtnobj.client = JSON.stringify(req.app.settings.client);
        break;
      case 'params':
        rtnobj.params = req.params;
        break;

      default:
        throw new Error('Unknown encoding')
    };
  }
  return rtnobj;

}


exports.connectLogger = getLogger;
