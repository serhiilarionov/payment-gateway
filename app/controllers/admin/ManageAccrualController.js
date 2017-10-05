'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  isAllow = require('../../policies/isAllow.js'),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};


router.post('/admin/manage/accrual/closingDate/set', isAllow, function (req, res) {
  var date = req.param('date');
  var companyId = +req.param('companyId');
  date = new Date(date);

  if(!date) {
    return res.status(400).json($rg(RC.INVALID_DATE));
  }
  if(isNaN(companyId)) {
    return res.status(400).json($rg(RC.INVALID_COMPANY_ID));
  }

  var closingDate = date.getFullYear() + '-' + (date.getMonth() + 1)  + '-' + date.getDate();
  db.Company.setClosingDate(closingDate, companyId)
    .then(function(data) {
      return res.status(200).json($rg(RC.OPERATION_COMPLETE));
    })
    .catch(function(err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});
