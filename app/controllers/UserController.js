'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../models/index'),
  cli = require('../services/CommandLineService'),
  mail = require('../services/MailerService'),
  $rg = require('../services/ResponseGenerator'),
  RC = require('../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('user');
});

router.get('/verify', function (req, res, next) {
  var link = req.query.id;
  if(!link) {
    return res.status(400).json($rg(RC.INVALID_EMPLOYEE_ID));
  }

    db.Employee.verifyEmployeeByLink(link)
      .then(function (data) {
        if (data.length > 0) {
          res.render('verification');
        } else {
          req.session.message = 'User already registered or url expired';
          res.redirect('/');
        }
      })
      .catch(function (err) {
        return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
      });
});

router.post('/verify', function (req, res, next) {
  var redirectTo = req.protocol + "://" + req.get('host');
  var id = +req.param('id');
  var userMailPass = req.param('userMailPass');
  var userNewPass2 = req.param('userNewPass2');

  if(isNaN(id)) {
    return res.status(400).json($rg(RC.INVALID_EMPLOYEE_ID));
  }
  if(!userNewPass2) {
    return res.status(400).json($rg(RC.EMPTY_USER_NEW_PASS));
  }
  if(!userMailPass) {
    return res.status(400).json($rg(RC.EMPTY_USER_MAIL_PASS));
  }

  db.Employee.confirmEmployeeRegistration(id, userMailPass)
    .then(function (data) {
      if (data === false) {
        res.redirect(redirectTo);
      } else {
        var userCompany = data.companyName.split(' ').join('\\ ');
        var userEmail = data.email;
        var userFio = data.fio.split(' ').join('\\ ');
        var userLogin = data.login;
        var userCity = data.nameUk.split(' ').join('\\ ');
        var days = data.days;
        cli.Cli.generateCertificate(userLogin, userCity, userCompany, userFio, userEmail, days)
          .then(function (data) {
            return cli.Cli.signCertificate(userLogin, days);
          })
          .then(function (data) {
            return cli.Cli.createPkcsFromCertificate(userLogin, userNewPass2);
          })
          .then(function (data) {
            return mail.Mailer.sendCertificate(userEmail, userLogin, userNewPass2);
          })
          .then(function (data) {
            res.redirect(redirectTo);
        });
      }
    })
    .catch(function (err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    })
});