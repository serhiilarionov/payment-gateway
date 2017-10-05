'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  Promise = require("bluebird"),
  isAllow = require('../../policies/isAllow.js'),
  mailerService = require('../../services/MailerService'),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js'),
  crypto = require('crypto');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/admin/employees/check', isAllow, function (req, res, next) {
  var userLogin = req.query.userLogin;

  var userLoginRegExp = new RegExp('^[A-z0-9_-]{4,20}$');

  if (!userLoginRegExp.test(userLogin)) {
    return res.status(400).json($rg(RC.INVALID_LOGIN));
  }
    db.Employee.checkIfEmployeeExists(userLogin)
      .then(function (data) {
        return res.json(data);
      })
      .catch(function (err) {
        return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
      });
});

router.post('/admin/employees/addnewemployee', isAllow, function (req, res, next) {
  var userLogin = req.param('userLogin');
  var userFio = req.param('userFio');
  var userEmail = req.param('userEmail');
  var userCity = +req.param('userCity').id;
  var userCompany = +req.param('userCompany').id;
  var userRole = req.param('userRole');
  var userCertTerm = req.param('userCertTerm');
  var host = req.get('host');

  var userEmailRegExp = new RegExp('.+@.+\..+');
  var userLoginRegExp = new RegExp('^[A-z0-9_-]{4,20}$');

  if(!userLoginRegExp.test(userLogin)) {
    return res.status(400).json($rg(RC.INVALID_LOGIN));
  }
  if(!userFio) {
    return res.status(400).json($rg(RC.EMPTY_USER_FIO));
  }
  if(!userEmailRegExp.test(userEmail)) {
    return res.status(400).json($rg(RC.INVALID_EMAIL));
  }
  if(isNaN(userCity)) {
    return res.status(400).json($rg(RC.INVALID_CITY));
  }
  if(isNaN(userCompany)) {
    return res.status(400).json($rg(RC.INVALID_COMPANY_ID));
  }
  if(!userRole) {
    return res.status(400).json($rg(RC.EMPTY_USER_ROLE));
  }
  if(!userCertTerm) {
    return res.status(400).json($rg(RC.EMPTY_USER_CERT_TERM));
  }

  db.Employee.addNewEmployee(userLogin, userFio, userEmail, userCity, userCompany, userRole, userCertTerm)
    .then(function (data) {
      if (!data.length) {
        return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR));
      }
      var login = data[0].login;
      var secretLink = data[0].link;
      var password = data[0].password;
      var link = "https://" + host + "/verify?id=" + secretLink;
      return mailerService.Mailer.sendVerificationLink(userEmail, login, link, password);
    })
    .then(function (data) {
      res.status(200).send($rg(RC.OPERATION_COMPLETE));
    })
    .catch(function (err) {
      db.Employee.rollbackAddingNewEmployee(userLogin, userRole)
        .then(function (data) {
          return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
        })
        .catch(function (err) {
          return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
        })
    });
});

router.post('/admin/employees/getallemployees', isAllow, function (req, res, next) {
  db.Employee.getAllEmployees()
    .then(function (data) {
      Promise.each(data, function (entry) {
        return new Promise(function (resolve, reject) {
          acl.userRoles(entry.login, function (err, roles) {
            entry.roles = roles[0];
            resolve(true);
          });
        });
      })
        .then(function () {
          return res.status(200).json(data);
        })
    })
    .catch(function (err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});
