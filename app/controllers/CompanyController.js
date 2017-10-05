'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../models/index'),
  $rg = require('../services/ResponseGenerator'),
  RC = require('../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/companies/all', function (req, res, next) {
  var cityId = +req.param('id');

  if(isNaN(cityId)) {
    return res.status(400).json($rg(RC.INVALID_CITY));
  }

  db.Company.getCompanies(cityId)
    .then(function (data) {
      return res.status(200).json(data);
    })
    .catch(function (err) {
      res.status(500).json($rg(RC.COMPANIES_LOADING_ERROR, err));
    });
});