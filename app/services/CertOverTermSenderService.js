'use strict';

var cron = require('cron'),
  mail = require('../services/MailerService'),
  db = require('../models/index'),
  logger = require('../../config/log'),
  moment = require('moment');

var cronJob = cron.job('00 00 12 * * *', function () {
  db.Employee.checkCertificateByTermOver()
    .then(function (overdueCertUserList) {
      overdueCertUserList.forEach(function (overdueCertUser) {
        if (overdueCertUser.email === undefined) {
          logger.log('error', 'cannot find user email to send overdue certificate');
        } else {
          var userEmail = overdueCertUser.email;
          var userlogin = overdueCertUser.login;
          var fio = overdueCertUser.fio;
          var date = moment(overdueCertUser.expirationDate).format('DD/MM//YYYY');
          mail.Mailer.sendCertificateTimeOver(userEmail, userlogin, fio, date)
            .catch(function (err) {
              logger.log('error', 'Error sending notification about expired certificates: ' + userEmail);
            });
        }
      });
    })
    .catch(function (err) {
      logger.log('error', 'data error from certificate overdue sender');
    });
}, null, true);
cronJob.start();
