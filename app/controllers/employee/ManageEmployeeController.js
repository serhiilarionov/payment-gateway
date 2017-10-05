'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  isAllow = require('../../policies/isAllow.js'),
  Promise = require("bluebird"),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/get/employee/info', isAllow, function(req, res){
  var employee = {};
  if (req.client.authorized) {
    db.Employee.getEmployeeDataByLogin(req.connection.getPeerCertificate().subject.CN).then( function(data) {
      if (data.length > 0) {
        employee.companyName = data[0].companyName;
        employee.companyId = data[0].companyId;
        employee.email = data[0].email;
        employee.fio = data[0].fio;
        employee.cityName = data[0].nameUk;
        employee.login = req.connection.getPeerCertificate().subject.CN;
        return res.status(200).json(employee);
      } else {
        return res.status(404).json($rg(RC.EMPLOYEE_NOT_FOUND, err));
      }
    })
      .catch(function (err) {
        return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
      });
  }

});