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

router.use(function (req, res, next) {
  if (!req.session.user) {
    req.session.user = {
      login: 'guest'
    };
  }
  if (req.client.authorized) {
    db.Employee.getEmployeeDataByLogin(req.connection.getPeerCertificate().subject.CN).then(function (data) {
      if (data.length > 0) {
        req.session.user.companyName = data[0].companyName;
        req.session.user.email = data[0].email;
        req.session.user.fio = data[0].fio;
        req.session.user.cityName = data[0].nameUk;
        req.session.user.login = req.connection.getPeerCertificate().subject.CN;
      }
      next();
    });
  } else {
    next();
  }
});

router.post('/add/accruals', isAllow, function (req, res) {
  var accruals = req.param('accruals'),
    companyId = +req.param('companyId'),
    companyName = req.param('companyName'),
    accrualDate = req.param('accrualDate');

  if(!accruals) {
    return res.status(400).json($rg(RC.EMPTY_ACCRUALS_PARAM));
  }
  if(isNaN(companyId)) {
    return res.status(400).json($rg(RC.INVALID_COMPANY_ID));
  }
  if(!companyName) {
    return res.status(400).json($rg(RC.EMPTY_COMPANY_NAME));
  }
  if(!accrualDate) {
    return res.status(400).json($rg(RC.INVALID_DATE));
  }

  var user = req.session.user;
  var errorObject = {
    idHouseErrors: [],
    companyErrors: [],
    debtErrors: [],
    accrualErrors: [],
    forPaymentErrors: [],
    paidErrors: [],
    dateOfAccruedErrors: []
  };
  var idHouseRegExp = new RegExp('^[0-9]{20,20}$'),
    numberRegExp = new RegExp('^[0-9]{5,14}$');
  var izError = false;
  //companyName = companyName.replace(/'/g, "`");
  db.Employee.allowToCompany(user.login, companyId, companyName)
    .then(function (allow) {
      if (allow) {
        Promise.each(accruals, function (accrual) {
          return new Promise(function (resolve, reject) {
            if(!idHouseRegExp.test(accrual.idHouse)) {
              izError = true;
              errorObject.companyErrors.push('Не вірний idHouse ' + accrual.idHouse);
            }
            if(iz(accrual.debt).number().errors.length) {
              izError = true;
              errorObject.debtErrors.push('Не вірний борг ' + accrual.debt);
            }
            if (iz(accrual.forPayment).number().errors.length) {
              izError = true;
              errorObject.accrualErrors.push('Не вірне поле до оплати ' + accrual.forPayment);
            }
            if (iz(accrual.paid).number().errors.length) {
              izError = true;
              errorObject.accrualErrors.push('Не вірне поле сплачено ' + accrual.paid);
            }
            if (iz(accrual.accrual).number().errors.length) {
              izError = true;
              errorObject.accrualErrors.push('Не вірне поле нарахування ' + accrual.number);
            }
            resolve(true);
          });
        })
          .then(function () {
            db.Company.getCompanyId(companyName, companyId)
              .then(function (systemCompanyId) {
                if (systemCompanyId == null) {
                  izError = true;
                  errorObject.companyErrors.push('Підприємство ' + companyName + ' в системі не знайдене');
                }
                if (izError) {
                  return res.status(400).json($rg('VE6', null, errorObject));
                } else {
                  var year = new Date(accrualDate).getFullYear();
                  var month = new Date(accrualDate).getMonth();
                  db.Company.checkClosingDate(year, month, systemCompanyId)
                    .then(function (allow) {
                      if (allow) {
                        Promise.each(accruals, function (accrual) {
                          return db.Service.addOrSelectService(systemCompanyId, accrual.serviceName, accrual.serviceId)
                            .then(function (systemServiceId) {
                              return db.PersonalAccount.addAccrual(accrual, systemServiceId, systemCompanyId, accrualDate)
                                .catch(function (err) {
                                  return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
                                });
                            })
                            .catch(function (err) {
                              return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
                            });
                        })
                          .then(function () {
                            return res.status(200).json($rg(RC.ACCRUALS_SUCCESSFULLY_ADDED));
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

router.post('/delete/accruals', isAllow, function (req, res) {
  var companyId = +req.param('companyId'),
    companyName = req.param('companyName'),
    accrualDate = req.param('accrualDate');
  var user = req.session.user;

  if(isNaN(companyId)) {
    return res.status(400).json($rg(RC.INVALID_COMPANY_ID))
  }
  if(!companyName) {
    return res.status(400).json($rg(RC.EMPTY_COMPANY_NAME))
  }
  if(!accrualDate) {
    return res.status(400).json($rg(RC.INVALID_DATE))
  }

  db.Employee.allowToCompany(user.login, companyId, companyName)
    .then(function (allow) {
      if (allow) {
        db.Company.getCompanyId(companyName, companyId)
          .then(function (systemCompanyId) {
            var year = new Date(accrualDate).getFullYear();
            var month = new Date(accrualDate).getMonth() + 1;
            db.Company.checkClosingDate(year, month, systemCompanyId)
              .then(function (allow) {
                if (allow) {
                  db.PersonalAccount.deleteMonthAccruals(systemCompanyId, year, month)
                    .then(function () {
                      res.status(200).json($rg(RC.ACCRUALS_SUCCESSFULLY_DELETED));
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
          })
          .catch(function (err) {
            return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
          });
      } else {
        return res.status(403).json($rg(RC.NO_ACCESS_TO_CAMPAIGN))
      }
    })
    .catch(function (err) {
      return res.status(500).send($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.post('/get/authorized/info', function(req, res) {
    res.status(200).send(req.client.authorized);
});

router.get('/employee/accruals', isAllow, function(req, res) {
  var idHouse = req.param('idHouse'),
    year = req.param('year'),
    month = req.param('month') || null,
    serviceId = req.param('serviceId') || null;
  var companyId = null;
  acl.userRoles(req.session.user.login, function (err, roles){
    if (roles[0] == 'employee') {
      companyId = req.session.user.companyId;
    }
    db.PersonalAccount.getAccrualsByPeriod(idHouse, year, month, companyId, serviceId)
      .then(function (data) {
        return res.status(200).json(data);
      })
      .catch(function (err) {
        return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
      });
  });
});

router.get('/get/ErrLinkMsg', function (req, res) {
    if(req.session.message === 'User already registered or url expired'){
    res.status(404).json($rg(RC.ALREADY_REGISTERED_OR_URL_EXPIRED));
    req.session.destroy();
  }
});