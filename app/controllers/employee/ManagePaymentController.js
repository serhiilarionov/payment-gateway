'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  iz = require('iz'),
  Promise = require("bluebird"),
  isAllow = require('../../policies/isAllow.js'),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/delete/payments', isAllow, function (req, res) {
  var companyId = req.param('companyId'),
      companyName = req.param('companyName'),
      paymentDate = req.param('paymentDate');
  var year = new Date(paymentDate).getFullYear();
  var month = new Date(paymentDate).getMonth() + 1;
  var user = req.session.user;
  db.Employee.allowToCompany(user.login, companyId, companyName)
    .then(function (allow) {
      if (!allow) {
        res.status(403).json($rg(RC.NO_ACCESS_TO_CAMPAIGN))
      }
      db.Company.getCompanyId(companyName, companyId)
        .then(function (systemCompanyId) {
          db.Payment.deleteMonthPayments(systemCompanyId, year, month)
            .then(function() {
              return res.status(200).json($rg(RC.PAYMENTS_SUCCESSFULLY_DELETED));
            })
            .catch(function() {
              return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
            });
        })
        .catch(function (err) {
          return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
        });
    })
    .catch(function (err) {
      res.status(500).send($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.post('/add/payments', isAllow, function (req, res) {
  var payments = req.param('payments'),
    companyId = +req.param('companyId'),
    companyName = req.param('companyName'),
    paymentDate = req.param('paymentDate');

  if(!payments) {
    return res.status(400).json($rg(RC.EMPTY_PAYMENTS_PARAM))
  }
  if(isNaN(companyId)) {
    return res.status(400).json($rg(RC.INVALID_COMPANY_ID))
  }
  if(!companyName) {
    return res.status(400).json($rg(RC.EMPTY_COMPANY_NAME))
  }
  if(!paymentDate) {
    return res.status(400).json($rg(RC.INVALID_DATE))
  }

  var user = req.session.user;
  var errorObject = {
    idHouseErrors: [],
    amountErrors: []
  };
  var idHouseRegExp = new RegExp('^[0-9]{20,20}$');
  var izError = false;
  db.Employee.allowToCompany(user.login, companyId, companyName)
    .then(function(allow) {
      if(!allow) {
        res.status(403).json($rg(RC.NO_ACCESS_TO_CAMPAIGN));
      }
      payments.forEach(function(payment) {
        if(!idHouseRegExp.test(payment.idHouse)) {
          izError = true;
          errorObject.companyErrors.push('Не вірний idHouse ' + payment.idHouse);
        }
        if(iz(payment.amount).number().errors.length) {
          izError = true;
          errorObject.amountErrors.push('Не вірне поле сума ' + payment.amount);
        }
      });
      db.Company.getCompanyId(companyName, companyId)
        .then(function(systemCompanyId) {
          if(systemCompanyId == null) {
            izError = true;
            errorObject.companyErrors.push('Підприємство ' + companyName + ' в сістемі не знайдене');
          }
          if (izError) {
            return res.status(400).json($rg('VE6', null, errorObject));
          }
          Promise.each(payments, function (payment) {
            return db.Bank.addOrSelectBank(payment.mfoRecipient, "")
              .then(function (bankId) {
                return db.Bank.addOrSelectBank(payment.mfoSender, "")
                  .then(function (bankId) {
                    if(bankId) {
                      return db.Service.addOrSelectService(systemCompanyId, payment.serviceName, payment.serviceId)
                        .then(function (systemServiceId) {
                          return db.Payment.addPayment(payment, systemServiceId, systemCompanyId, paymentDate)
                            .catch(function (err) {
                              return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
                            });
                        })
                        .catch(function (err) {
                          return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
                        });
                    }
                  })
                  .catch(function (err) {
                    return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
                  });
              })
              .catch(function (err) {
                return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
              });
          })
            .then(function() {
              return res.status(200).json($rg(RC.PAYMENT_INFO_SUCCESSFULLY_ADDED));
            })
            .catch(function (err) {
              return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
            });
        })
        .catch(function (err) {
          return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
        });
    })
    .catch(function(err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});