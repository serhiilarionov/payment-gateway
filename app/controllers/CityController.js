'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../models/index'),
  $rg = require('../services/ResponseGenerator'),
  RC = require('../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/cities/all', function (req, res, next) {
  var search = req.param('search');
  var lang = req.param('lang');
  db.City.getCities(search, lang)
    .then(function (data) {
      return res.status(200).json(data);
    })
    .catch(function (err) {
      res.status(500).json($rg(RC.CITIES_LOADING_ERROR, err));
    });
});
