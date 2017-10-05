'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../models/index'),
  $rg = require('../services/ResponseGenerator'),
  RC = require('../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/streets/search', function (req, res, next) {
  var cityId = +req.param('cityId');
  var search = req.param('search');
  var lang = req.param('lang');
  
  if(isNaN(cityId)) {
    return res.status(400).json($rg(RC.INVALID_CITY));
  }

  db.Street.getStreets(cityId, search, lang)
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
       return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
     });
});