'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../models/index'),
  $rg = require('../services/ResponseGenerator'),
  RC = require('../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
  });
  res.redirect('/');
});

router.use(function (req, res, next) {
  if (!req.session.user) {
    req.session.user = {
      login: 'guest'
    };
  }
  if (req.client.authorized) {
    db.Employee.getEmployeeDataByLogin(req.connection.getPeerCertificate().subject.CN).then(function (data) {
      if (data.length > 0) {
        req.session.user.companyName = data[0].companyName;
        req.session.user.companyId = data[0].companyId;
        req.session.user.email = data[0].email;
        req.session.user.fio = data[0].fio;
        req.session.user.cityName = data[0].nameUk;
        req.session.user.login = req.connection.getPeerCertificate().subject.CN;
      }
      next();
    });
  } else {
    next();
  }
});

router.post('/user/check/pinCode', function (req, res, next) {
  var idHouse = req.param('idHouse'),
    pinCode = req.param('pin_code'),
    idHouseRegExp = new RegExp('^[0-9]{20,20}$'),
    pinCodeRegExp = new RegExp('^[0-9]{4,4}$');

  if (!idHouseRegExp.test(idHouse)) {
    return res.status(400).json($rg(RC.INVALID_ADDRESS));
  }
  if (!pinCodeRegExp.test(pinCode)) {
    return res.status(400).json($rg(RC.INVALID_PIN_CODE));
  }

  db.PinCode.getPinCode(idHouse, pinCode)
    .then(function (access) {
      if (access) {
        if (!req.session.user) {
          req.session.user = {};
        }
        req.session.user.idHouse = idHouse;
        req.session.user.login = 'dweller';
        res.status(200).send("");
      } else {
        return res.status(401).json($rg(RC.INVALID_PIN_CODE));
      }
    })
    .catch(function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
      }
    });
});