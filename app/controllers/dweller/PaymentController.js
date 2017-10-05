'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  Promise = require("bluebird"),
  isAllow = require('../../policies/isAllow.js'),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/get/payments',  isAllow, function (req, res) {
  var idHouse = req.param('idHouse'),
    year = +req.param('year'),
    month = +req.param('month'),
    companyId = +req.param('companyId');
  var idHouseRegExp = new RegExp('^[0-9]{20,20}$');

  if (!idHouseRegExp.test(idHouse)) {
    return res.status(400).json($rg(RC.INVALID_ADDRESS));
  }
  if(isNaN(year) || isNaN(month)) {
    return res.status(400).json($rg(RC.INVALID_DATE));
  }

  db.Payment.getPaymentsByPeriod(idHouse, year, month, companyId)
    .then(function(data) {
      return res.status(200).json(data);
    })
    .catch(function (err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.post('/get/payments/year/minimal', isAllow, function (req, res) {
  var idHouse = req.param('idHouse');
  var idHouseRegExp = new RegExp('^[0-9]{20,20}$');

  if (!idHouseRegExp.test(idHouse)) {
    return res.status(400).json($rg(RC.INVALID_ADDRESS));
  }

  db.Payment.getMinYearByIdHouse(idHouse)
    .then(function(data) {
      return res.status(200).json(data);
    })
    .catch(function (err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.get('/payment/data/online',  isAllow, function (req, res) {
  //TODO move idHouse to session
  var year = req.param('year');
  var month = req.param('month');
  var idHouse = req.param('idhouse');
  if (!idHouse || !month || !year) {
    return res.status(422).json($rg(RC.PARAMS_MISSING))
  }
  db.TransactionLog.getUserPaymentsByPeriod(idHouse, year, month)
    .then(function(data) {
      return res.status(200).json(data);
    })
    .catch(function (err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});
