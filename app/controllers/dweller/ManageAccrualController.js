"use strict";

/**
 * /get/accruals возвращает массив с начислениями за определенный период
 * /get/accruals/year/minimal возвращает массив с годами в которых остались не закрытые месяца для переданного idHouse
 */
var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  isAllow = require('../../policies/isAllow.js'),
  Promise = require("bluebird"),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js');

module.exports = function(app) {
  app.use('/', router);
};

router.post('/get/accruals', isAllow, function(req, res) {
  var idHouse = req.param('idHouse'),
    year = +req.param('year'),
    month = req.param('month') || null,
    companyId = req.param('companyId') || null,
    serviceId = req.param('serviceId') || null;
  var idHouseRegExp = new RegExp('^[0-9]{20,20}$');

  if (!idHouseRegExp.test(idHouse)) {
    return res.status(400).json($rg(RC.INVALID_ADDRESS));
  }
  if(isNaN(year)) {
    return res.status(400).json($rg(RC.EMPTY_ACCRUAL_YEAR));
  }

  db.PersonalAccount.getAccrualsByPeriod(idHouse, year, month, companyId, serviceId)
    .then(function (data) {
      return res.status(200).json(data);
    })
    .catch(function (err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.post('/get/accruals/year/minimal', isAllow, function(req, res) {
  var idHouse = req.param('idHouse');
  var idHouseRegExp = new RegExp('^[0-9]{20,20}$');

  if (!idHouseRegExp.test(idHouse)) {
    return res.status(403).json($rg(RC.INVALID_ADDRESS));
  }

  db.PersonalAccount.getMinYearByIdHouse(idHouse)
    .then(function(data) {
      return res.status(200).json(data);
    })
    .catch(function(err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});