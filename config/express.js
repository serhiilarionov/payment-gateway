var express = require('express');
var config = require('./config');
var glob = require('glob');
var favicon = require('serve-favicon');
var log = require('morgan');
var logger = require('./log');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var transactionService = require('../app/services/TransactionService');
var CronJob = require('cron').CronJob;
var setupACL = require('../node_modules/acl-knex/lib/databaseTasks').createTables,
  Acl = require('acl'),
  AclKnexBackend = require('acl-knex');
setupACL([
      'payment',
      'postgres',
      'test123',
      'acl_',
      'localhost',
      5432
    ], function (err, db) {
      acl = new Acl(new AclKnexBackend(db, 'acl_'));
      acl.addUserRoles('dweller', 'dweller');
    });

var redis = require('redis'),
    session = require('express-session'),
    redisStore = require('connect-redis')(session);
var client = redis.createClient();
var job = new CronJob({
  cronTime: '0 1 * * * *',//Runs every hour, to get more info https://github.com/ncb000gt/node-cron
  onTick: function() {
    console.log(new Date());
    transactionService.checkProgressingTransactions();
  },
  start: true,
  timeZone: 'Europe/Kiev'
});
job.start();
module.exports = function(app, config) {
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(log('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser('qwetvcgw34u67fgq3454y'));
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(session(
    {
      secret: 'qwetvcgw34u67fgq3454y',
      store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 60*60*24}), //ttl one day
      saveUninitialized: false, // don't create session until something stored,
      resave: false // don't save session if unmodified

    }
  ));
  app.use(methodOverride());
  // /**/*.js подключение вложеных в папки контроллеров
  var controllers = glob.sync(config.root + '/app/controllers/**/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });
  app.use(function (req, res, next) {
    var err = new Error();
    err.status = 404;
    var url = req.protocol + '://' + req.host + ':'  + config.port;
    return res.render('404', { url: url });
  });

  if(app.get('env') === 'development'){

    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      logger.error(req.method, req.url, err.message, err.status);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    logger.error(req.method, req.url, err.message, err.status);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
};
