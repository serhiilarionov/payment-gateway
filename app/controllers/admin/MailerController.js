'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  mailerService = require('../../services/MailerService'),
  isAllow = require('../../policies/isAllow.js'),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};


router.post('/admin/mailer/sendpass', isAllow, function (req, res, next) {
  var userEmail = req.param('userEmail');
  var userLogin = req.param('userLogin');
  var userPassword = req.param('userPassword');

  var userEmailRegExp = new RegExp('.+@.+\..+');
  var userLoginRegExp = new RegExp('^[A-z0-9_-]{4,20}$');

  if (!userEmailRegExp.test(userEmail)) {
    return res.status(400).json($rg(RC.INVALID_EMAIL));
  }
  if (!userLoginRegExp.test(userLogin)) {
    return res.status(400).json($rg(RC.INVALID_LOGIN));
  }
  if (!userPassword) {
    return res.status(400).json($rg(RC.EMPTY_PASSWORD));
  }

  mailerService.Mailer.sendPassword(userEmail, userLogin, userPassword)
    .then(function (data) {
      return res.json(data);
    })
    .catch(function (err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.post('/admin/mailer/sendcertificate', isAllow, function (req, res, next) {
  var userEmail = req.param('userEmail');
  var userLogin = req.param('userLogin');
  var userPassword = req.param('userPassword');

  var userEmailRegExp = new RegExp('.+@.+\..+');
  var userLoginRegExp = new RegExp('^[A-z0-9_-]{4,20}$');

  if (!userEmailRegExp.test(userEmail)) {
    return res.status(403).json($rg(RC.INVALID_EMAIL));
  }
  if (!userLoginRegExp.test(userLogin)) {
    return res.status(403).json($rg(RC.INVALID_LOGIN));
  }
  if (!userPassword) {
    return res.status(403).json($rg(RC.EMPTY_PASSWORD));
  }

  mailerService.Mailer.sendCertificate(userEmail, userLogin, userPassword)
    .then(function (data) {
      return res.json(data);
    })
    .catch(function (err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});