'use strict';

var db = require('../models/index');
var constants = require('../../config/constants');
var LiqPay = require('./LiqPayService.js');
/**
 * Transaction Log service API для работы с платежными транзациями
 * checkProgressingTransactions - проверяет транзакции в статусе "в обработке"
 */
var transactionService = {};

transactionService.checkProgressingTransactions = function () {
  db.TransactionLog.getProgressingTransactions()
    .then(function(payments) {
      payments.forEach(function(payment) {
        if(payment.name == 'liqpay') {
          var orderId = payment.id;
          db.PaymentSystem.getPaymentSystemByName('liqpay')
            .then(function (paymentSystem) {
              var liqpay = new LiqPay(paymentSystem.options.public_key, paymentSystem.options.private_key, paymentSystem.options.sandbox);
              liqpay.checkPayment(orderId)
                .then(function(data) {
                  var status = data.status;
                  if(status == 'success' || status == 'processing' || status == 'failure'  || status == 'sandbox' && data.amount == payment.accrual) {
                    db.TransactionLog.updateStatusById(orderId, constants.TRANSACTION_STATUS[status], data.transaction_id)
                      .catch(function(err) {
                        //todo change console.log
                        console.log(err);
                      });
                  }
                });
            })
            .catch(function (err) {
              //todo change console.log
              console.error(err);
            });
        }
      });

    })
    .catch(function(err) {
      console.log(err);
    })
};


module.exports = transactionService;