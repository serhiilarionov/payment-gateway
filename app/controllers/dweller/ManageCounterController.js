"use strict";

/**
 * /get/counters возвращает массив с показаниями счетчиков за определенный период
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

router.post('/get/counters', isAllow, function(req, res) {
  var personalAccountId = req.param('personalAccountId'),
    companyId = req.param('companyId'),
    serviceId = req.param('serviceId'),
    year = req.param('year'),
    month = req.param('month');

  db.Counter.getCounters(personalAccountId, companyId, serviceId, month, year)
    .then(function (data) {
      return res.status(200).json(data);
    })
    .catch(function (err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});