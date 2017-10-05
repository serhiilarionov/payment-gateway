var express = require('express'),
  config = require('./config/config'),
  db = require('./app/models'),
  logger = require('./config/log.js');
var app = express();
var https = require('https');
var fs = require('fs');
var cron = require('./app/services/CertOverTermSenderService');
var options = {
    key:    fs.readFileSync('app/certificates/CA/server.key'),
    cert:   fs.readFileSync('app/certificates/CA/server.crt'),
    ca:     fs.readFileSync('app/certificates/CA/ca.crt'),
    requestCert:        true,
    rejectUnauthorized: false,
    crl: fs.readFileSync('app/certificates/configs/ca.crl')
};

app.use(function(req, res, next) {
  logger.log('verbose', req.method, req.url);
  next();
}); //Логирование уровня verbose


require('./config/express')(app, config);

//db.sequelize
//  .sync({force: false})
//  .complete(function (err) {
//    if(err){
//      throw err[0];
//    }else{
//      //app.listen(config.port);
//      https.createServer(options, app).listen(config.port);
//    }
//  });
https.createServer(options, app).listen(config.port);
