'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  isAllow = require('../../policies/isAllow.js'),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js'),
  LiqPay = require('../../services/LiqPayService');
var TRANSACTION_STATUS = require('../../../config/constants.js').TRANSACTION_STATUS;

module.exports = function (app) {
  app.use('/', router);
};


router.post('/admin/manage/paymentSystem/liqpay/set/params', isAllow, function (req, res) {
  var public_key = req.param('public_key'),
      private_key = req.param('private_key'),
      name = req.param('name'),
      sandbox = req.param('sandbox'),
      id = +req.param('id');

  if(isNaN(id)) {
    return res.status(400).json($rg(RC.INVALID_PAYMENT_ID));
  }
  if(!sandbox) {
    return res.status(400).json($rg(RC.EMPTY_PAYMENT_SANDBOX));
  }
  if(!name) {
    return res.status(400).json($rg(RC.EMPTY_PAYMENT_NAME));
  }
  if(!private_key) {
    return res.status(400).json($rg(RC.EMPTY_PAYMENT_PRIVATE_KEY));
  }
  if(!public_key) {
    return res.status(400).json($rg(RC.EMPTY_PAYMENT_PUBLIC_KEY));
  }

  db.PaymentSystem.setPaymentSystemsOptions(id, name, {public_key: public_key, private_key: private_key, sandbox: sandbox})
    .then(function(data) {
      return res.status(200).json(data);
    })
    .catch(function(err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.get('/admin/manage/paymentSystem/liqpay/get/params', isAllow, function (req, res) {
db.PaymentSystem.getPaymentSystems()
  .then(function(data) {
    return res.status(200).json(data);
  })
  .catch(function(err) {
    return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
  });

});

router.post('/get/liqpay/transaction/status', function(req, res) {
  var data = req.param('data');
  var signature = req.param('signature');
  if (!data || !signature) {
    return res.sendStatus(500);
  }
  db.PaymentSystem.getPaymentSystemByName('liqpay')
    .then(function (paymentSystem) {
      var liqpay = new LiqPay(paymentSystem.options.public_key, paymentSystem.options.private_key, paymentSystem.options.sandbox);
      liqpay.getCallbackData(signature, data)
        .then(function(data) {
          if(data) {
            var status = data.status;
            if(status == 'success' || status == 'processing' || status == 'failure'  || status == 'sandbox') {
              db.TransactionLog.updateStatusById(data.order_id, TRANSACTION_STATUS[data.status], data.transaction_id)
                .then(function (data) {
                  if (data) {
                    res.sendStatus(200);
                  } else {
                    res.sendStatus(500);
                  }
                })
                .catch(function (err) {
                  console.error(err);
                  res.sendStatus(500);
                });
            }
          } else {
            res.sendStatus(500);
          }
        })
        .catch(function (err) {
          console.error(err);
          res.sendStatus(500);
        });
    })
    .catch(function (err) {
      console.error(err);
      res.sendStatus(500);
    });
});