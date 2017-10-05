'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  iz = require('iz'),
  isAllow = require('../../policies/isAllow.js'),
  Promise = require("bluebird"),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/add/counters', isAllow, function (req, res) {
  var counters = req.param('counters'),
    companyId = req.param('companyId'),
    companyName = req.param('companyName'),
    counterDate = req.param('counterDate');
  var user = req.session.user;
  var errorObject = {
    idHouseErrors: [],
    companyErrors: [],
    debtErrors: [],
    counterErrors: [],
    forPaymentErrors: [],
    paidErrors: [],
    dateOfAccruedErrors: []
  };
  var idHouseRegExp = new RegExp('^[0-9]{20,20}$'),
    numberRegExp = new RegExp('^[0-9]{5,14}$');
  var izError = false;
  db.Employee.allowToCompany(user.login, companyId, companyName)
    .then(function (allow) {
      if (allow) {
        db.Company.getCompanyId(companyName, companyId)
          .then(function (systemCompanyId) {
            if (systemCompanyId == null) {
              izError = true;
              errorObject.companyErrors.push('Підприємство ' + companyName + ' в системі не знайдене');
            }
            if (izError) {
              return res.status(400).json($rg('VE6', null, errorObject));
            } else {
              var year = new Date(counterDate).getFullYear();
              var month = new Date(counterDate).getMonth();
              db.Company.checkClosingDate(year, month, systemCompanyId)
                .then(function (allow) {
                  if (allow) {
                    Promise.each(counters, function (counter) {
                      return db.Service.addOrSelectService(systemCompanyId, counter.serviceName, counter.serviceId)
                        .then(function (systemServiceId) {
                          return db.Counter.addCounter(counter.LicSh, counter.idHouse, systemCompanyId, systemServiceId, counter.Mesto, counter.OldPokaz, counter.outDatePokaz)
                            .catch(function (err) {
                              return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
                            });
                        })
                        .catch(function (err) {
                          return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
                        });
                    })
                      .then(function () {
                        return res.status(200).json($rg(RC.COUNTERS_SUCCESSFULLY_ADDED));
                      })
                      .catch(function (err) {
                        return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
                      });

                  } else {
                    return res.status(400).json($rg(RC.MONTH_ALREADY_CLOSED));
                  }
                })
                .catch(function (err) {
                  return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
                });
            }
          })
          .catch(function (err) {
            return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
          });
      } else {
        res.status(403).json($rg(RC.NO_ACCESS_TO_CAMPAIGN))
      }
    })
    .catch(function (err) {
      res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.post('/delete/counters', isAllow, function (req, res) {
  var companyId = req.param('companyId'),
    companyName = req.param('companyName'),
    counterDate = req.param('counterDate');
  var user = req.session.user;
  db.Employee.allowToCompany(user.login, companyId, companyName)
    .then(function (allow) {
      if (allow) {
        db.Company.getCompanyId(companyName, companyId)
          .then(function (systemCompanyId) {
            var year = new Date(counterDate).getFullYear();
            var month = new Date(counterDate).getMonth();
            db.Company.checkClosingDate(year, month, systemCompanyId)
              .then(function (allow) {
                if (allow) {
                  db.Counter.deleteMonthCounters(systemCompanyId, year, month)
                    .then(function () {
                      res.status(200).json($rg(RC.COUNTERS_SUCCESSFULLY_DELETED));
                    })
                    .catch(function (err) {
                      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
                    });
                } else {
                  return res.status(400).json($rg(RC.MONTH_ALREADY_CLOSED));
                }
              })
              .catch(function (err) {
                console.log(err);
                return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
              });
          })
          .catch(function (err) {
            console.log(err);
            return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
          });
      } else {
        res.status(403).json($rg(RC.NO_ACCESS_TO_CAMPAIGN))
      }
    })
    .catch(function (err) {
      res.status(500).send($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});