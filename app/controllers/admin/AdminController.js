'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../../models/index');
var isAllow = require('../../policies/isAllow.js');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/admin', isAllow, function (req, res, next) {
  res.render('admin');
});