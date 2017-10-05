var winston = require('winston'),
  fs = require( 'fs'),
  logDir = './log';
winston.emitErrs = true;

if ( !fs.existsSync( logDir ) ) {
  // Create the directory if it does not exist
  fs.mkdirSync( logDir );
}

var logger = new winston.Logger({
  exceptionHandlers: [
   new winston.transports.File({filename: logDir + '/exceptions.log'})
  ],
  transports: [
    new winston.transports.File({
      name: 'error',
      level: 'error',
      filename: logDir + '/errors.log',
      silent: false, //enable or disable 'error' log level
      json: false,
      maxsize: 5242880, //5MB
      maxFiles: 15,
      colorize: true
    })
    ,
    new winston.transports.File({
      name: 'verbose',
      level: 'verbose',
      filename: logDir + '/info.log',
      silent: false, //enable or disable 'verbose' log level
      json: false,
      maxsize: 5242880, //5MB
      maxFiles: 15,
      colorize: true
    })

  ],
  exitOnError: false
});
module.exports = logger;