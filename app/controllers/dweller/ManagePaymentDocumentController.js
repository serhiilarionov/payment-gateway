'use strict';

/**
 * /create/payment/document создание платежного документа
 * /create/payment/form создание кнопки для отправки платежного документа службе LiqPay
 * /callback/from/liqpay проверка платежа после перехода пользователя от liqpay
 * @type {exports}
 */
var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  iz = require('iz');
var isAllow = require('../../policies/isAllow.js');
var Promise = require("bluebird");
var crypto = require('crypto');
var companies = require('../../../config/requisites.js');
var LiqPay = require('../../services/LiqPayService.js'),
    $rg = require('../../services/ResponseGenerator'),
    RC = require('../../../config/internalResponseCodes.js');
var TRANSACTION_STATUS = require('../../../config/constants.js').TRANSACTION_STATUS;


module.exports = function (app) {
  app.use('/', router);
};

router.post('/create/payment/document', isAllow, function (req, res) {
  var variables = req.param('variables');
  var date = new Date();
  var sum = 0;
  var status = TRANSACTION_STATUS.processing;
  var hash = '';
  var senderName = '';
  var receiptOfThePaymentSystem = null;
  variables.payments.forEach(function(payment) {
    payment.toPay = Number(payment.toPay.replace(/,/g, "."));
  });
  hash = crypto.createHash('md5')
    .update(date.toString())
    .update(sum.toString())
    .update(variables.payer.value)
    .update(variables.idHouse)
    .digest("hex");
  senderName = variables.idHouse + ' ' + variables.payer.value;
  db.PaymentDocument.addPaymentDocument(date, sum, variables.payer.value, variables.idHouse, hash)
    .then(function (paymentDocumentId) {
      if(paymentDocumentId && paymentDocumentId != 0) {
        hash = crypto.createHash('md5')
          .update(paymentDocumentId.toString())
          .update(sum.toString())
          .update(senderName)
          .update(companies.SoftProject.name)
          .update(companies.SoftProject.edrpoy.toString())
          .update(companies.SoftProject.mfo.toString())
          .update(companies.SoftProject.bankAccount)
          .digest("hex");
        Promise.each(variables.payments, function (payment) {
          return new Promise(function (resolve, reject) {
            db.PaymentsPaymentDocument.addPaymentsPaymentDocument(variables.idHouse, payment.id, payment.companyId, payment.serviceId, date, payment.toPay, paymentDocumentId, payment.startDate, payment.endDate)
              .then(function () {
                sum += payment.toPay;
                Promise.each(payment.counters, function (counter) {
                  return new Promise(function (resolve, reject) {
                    db.CounterPaymentDocument.addCounterPaymentDocument(date, variables.idHouse, counter.id, payment.companyId, payment.serviceId, counter.position, counter.meterReading)
                      .then(function () {
                        resolve(true);
                      })
                      .catch(function (error) {
                        reject(error);
                      })
                  })
                    .catch(function (error) {
                      reject(error);
                    });
                })
                  .then(function () {
                    resolve(sum);
                  })
                  .catch(function(error){
                    reject(error);
                  })
              })
              .catch(function (error) {
                reject(error);
              })
          })
        })
          .then(function (payments) {
            db.TransactionLog.addRecord(paymentDocumentId, sum, hash,
              receiptOfThePaymentSystem, senderName, null, null, null,
              companies.SoftProject.name, companies.SoftProject.edrpoy, companies.SoftProject.mfo,
              companies.SoftProject.bankAccount, status)
              .then(function(id) {
                return res.status(200).send({orderId: id, sum: sum});
              })
              .catch(function (error) {
                return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
              });
          })
          .catch(function (err) {
            return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
          });
      } else {
        return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
      }
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.post('/create/payment/form', isAllow, function (req, res) {
  var selectedSystem =  req.param('selectedSystem');
  var orderId =  req.param('orderId');
  var sum =  req.param('sum');
  var address =  req.param('address');
  db.PaymentSystem.getPaymentSystemById(selectedSystem)
    .then(function (paymentSystem) {
      if(paymentSystem.name = 'liqpay') {
        var host = req.get('host');
        var liqpay = new LiqPay(paymentSystem.options.public_key, paymentSystem.options.private_key, paymentSystem.options.sandbox);
        var DataAndSignature = liqpay.getDataAndSignatureForForm(sum, orderId, address, "liqpay",
          "https://" + host + "/get/liqpay/transaction/status", "https://" + host + "/callback/from/liqpay",
          "UAH", "buy", "ru", "3");
        req.session.payment = {};
        req.session.payment.orderId = orderId;
        db.TransactionLog.updatePaymentSystemId(orderId, selectedSystem)
          .then(function() {
            return res.status(200).send(DataAndSignature);
          })
          .catch(function(err) {
            console.error(err);
            res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
          });
      } else {
        return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.get('/callback/from/liqpay', isAllow, function (req, res) {
  if (req.session.payment) {
    var orderId = req.session.payment.orderId;
    db.PaymentSystem.getPaymentSystemByName('liqpay')
      .then(function (paymentSystem) {
        var liqpay = new LiqPay(paymentSystem.options.public_key, paymentSystem.options.private_key, paymentSystem.options.sandbox);
        liqpay.checkPayment(orderId)
          .then(function (data) {
            var status = data.status;
            if (status == 'success' || status == 'processing' || status == 'failure' || status == 'sandbox') {
              db.TransactionLog.updateStatusById(orderId, TRANSACTION_STATUS[status], data.transaction_id)
                .catch(function (err) {
                  console.error(err);
                });
            }
          });
      })
      .catch(function (err) {
        console.error(err);
      });
    delete req.session.payment;
  }
  return res.redirect('/');
});