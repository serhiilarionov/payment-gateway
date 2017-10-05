'use strict';

var express = require('express'),
  router = express.Router(),
  async = require('async'),
  db = require('../../models/index'),
  cliService = require('../../services/CommandLineService'),
  isAllow = require('../../policies/isAllow.js'),
  mailerService = require('../../services/MailerService'),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/admin/cli/revokecert', isAllow, function (req, res, next) {
  var employeeId = +req.param('id');

  if(isNaN(employeeId)) {
    return res.status(400).json($rg(RC.EMPTY_EMPLOYEE_ID));
  }

    db.Employee.getEmployeeById(employeeId)
      .then(function(employee) {
        if(employee) {
          async.waterfall([
            function(cb) {
              cliService.Cli.revokeCertificate(employee.login)
                .then(function() {
                  cb();
                })
                .catch(function(err) {
                  cb(RC.CERTIFICATE_FILE_NOT_FOUND, err);
                })
            },
            function(cb) {
              cliService.Cli.updateCrtRevocationList()
                .then(function() {
                  cb();
                })
                .catch(function(err) {
                  cb(RC.REVOCATION_LIST_UPDATE_ERROR, err);
                })
            },
            function(cb) {
              db.Employee.disableTheEmployee(employeeId)
                .then(function() {
                  cb();
                })
                .catch(function(err) {
                  cb(RC.EMPLOYEE_DISABLING_ERROR, err);
                })
            },
            function(cb) {
              cliService.Cli.deleteRevokedCertificates(employee.login)
                .then(function() {
                  cb();
                })
                .catch(function(err) {
                  cb(RC.REVOKED_CERTIFICATES_DELETING_ERROR, err);
                })
            }
          ], function(errorResponse, err) {
            if(errorResponse) {
              return res.status(500).json($rg(errorResponse || RC.CERTIFICATE_REVOKING_ERROR, err));
            } else {
              return res.status(200).json($rg(RC.CERTIFICATE_REVOKED));
            }
          })
        } else {
          return res.status(400).json($rg(RC.EMPLOYEE_NOT_FOUND));
        }
      })
      .catch(function(err) {
        return res.status(500).json($rg(RC.EMPLOYEE_DATA_RETRIEVING_ERROR, err));
      });
});

router.post('/admin/cli/recreatecert', isAllow, function (req, res, next) {
  var employeeId = +req.param('id');
  var userNewCertTerm = +req.param('userNewCertTerm');
  var host = req.get('host');

  if(isNaN(employeeId)) {
    return res.status(400).json($rg(RC.EMPTY_EMPLOYEE_ID));
  }
  if(isNaN(userNewCertTerm)) {
    return res.status(400).json($rg(RC.EMPTY_NEW_CERTIFICATE_TERM));
  }

    db.Employee.getEmployeeById(employeeId)
      .then(function (employee) {
        if(employee) {
          async.waterfall([
            function(cb) {
              if(!employee.isdisabled) {
                cliService.Cli.revokeCertificate(employee.login)
                  .then(function() {
                    cb();
                  })
                  .catch(function(err) {
                    cb(RC.CERTIFICATE_FILE_NOT_FOUND, err);
                  })
              } else {
                cb();
              }
            },
            function(cb) {
              if(!employee.isdisabled) {
                cliService.Cli.updateCrtRevocationList()
                  .then(function() {
                    cb();
                  })
                  .catch(function(err) {
                    cb(RC.REVOCATION_LIST_UPDATE_ERROR, err);
                  })
              } else {
                cb();
              }
            },
            function(cb) {
              if(!employee.isdisabled) {
                db.Employee.disableTheEmployee(employeeId)
                  .then(function() {
                    cb();
                  })
                  .catch(function(err) {
                    cb(RC.EMPLOYEE_DISABLING_ERROR, err);
                  })
              } else {
                cb();
              }
            },
            function(cb) {
              if(!employee.isdisabled) {
                cliService.Cli.deleteRevokedCertificates(employee.login)
                  .then(function() {
                    cb();
                  })
                  .catch(function(err) {
                    cb(RC.REVOKED_CERTIFICATES_DELETING_ERROR, err);
                  })
              } else {
                cb();
              }
            },
            function(cb) {
              db.Employee.generateLinkForRenewal(employee.login, userNewCertTerm)
                .then(function(renewalData) {
                  cb(null, renewalData);
                })
                .catch(function(err) {
                  cb(RC.RENEWAL_LINK_GENERATING_ERROR, err);
                })
            },
            function(renewalData, cb) {
              var verificationLink = "https://" + host + "/verify?id=" + renewalData.link;
              mailerService.Mailer.sendVerificationLink(employee.email, renewalData.login, verificationLink, renewalData.password)
                .then(function() {
                  cb();
                })
                .catch(function(err) {
                  cb(RC.VERIFICATION_LINK_SENDING_ERROR, err);
                });
            }
          ], function(errorResponse, err) {
            if(errorResponse) {
              return res.status(500).json($rg(errorResponse || RC.CERTIFICATE_RECREATION_ERROR, err));
            } else {
              return res.status(200).json($rg(RC.CERTIFICATE_RECREATING_REQUEST_FORMED));
            }
          });
        } else {
          return res.status(400).json($rg(RC.EMPLOYEE_NOT_FOUND));
        }
      })
      .catch(function(err) {
        return res.status(500).json($rg(RC.EMPLOYEE_DATA_RETRIEVING_ERROR, err));
      });
});