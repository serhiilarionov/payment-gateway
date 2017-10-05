'use strict';

var request = require('superagent')
  , chai = require('chai')
  , expect = chai.expect
  , db = require('../../../app/models')
  , https = require('https')
  , testingData = require('../testingData/testingData')
  , testingFunctions = require('../testingData/testingFunctions')
  , express = require('express')
  , app = express()
  , instance
  , config = require('../../../config/config.js');

exports.run = function () {
  describe('ManagePaymentSystemController', function () {

    before(function (done) {
      require('../../../config/express')(app, config);
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        if (err) {
          done(err);
        } else {
          testingFunctions.addPaymentDocument()
            .then(function (data) {
              testingData = data;
              db.TransactionLog.addRecord(testingData.accrualsOptions.id, testingData.TrOpt.accrual, testingData.TrOpt.hash,
                testingData.TrOpt.receiptOfThePaymentSystem, testingData.TrOpt.senderName,
                testingData.TrOpt.senderEdrpoy, testingData.TrOpt.senderMfo, testingData.TrOpt.senderBankAccount,
                testingData.TrOpt.recipientName, testingData.TrOpt.recipientEdrpoy, testingData.TrOpt.recipientMfo, testingData.TrOpt.recipientBankAccount,
                testingData.TrOpt.status)
                .then(function (data) {
                  if (data) {
                    testingData.TrOpt.id = data;
                  }
                  done();
                })
                .catch(function (err) {
                  console.error(err);
                  done();
                })
            })
            .catch(function (err) {
              console.error(err);
              instance.close();
              done(err);
            })
        }
      });
    });

    describe('Setup payment system', function () {
      it('should save LiqPay config', function (done) {
        request
          .post(testingData.url + '/admin/manage/paymentSystem/liqPay')
          .send({data: testingData.liqPayData})
          .end(function (error, res) {
            if (error) {
              console.log(error);
            }
            done();
          });
      });
    });

    describe('Get callback from LiqPay', function () {
      it('should get callback from LiqPay', function (done) {
        request
          .post(testingData.url + '/get/liqpay/transaction/status')
          .send({data: testingData.liqPayData.data, signature: testingData.liqPayData.signature})
          .end(function (error, res) {
            res.status.should.be.equal(200);
            done(error);
          });
      });
    });

    after(function (done) {
      if (testingData.TrOpt.id) {
        db.TransactionLog.destroy({id: testingData.TrOpt.id})
          .then(function () {
            if (testingData.accrualsOptions.id) {
              testingFunctions.removePaymentDocument()
                .then(function (data) {
                  if (data) {
                    instance.close();
                    done();
                  }
                })
                .catch(function (err) {
                  console.error(err);
                  instance.close();
                  done(err);
                })
            } else {
              instance.close();
              done();
            }
          })
          .catch(function (err) {
            console.error(err);
            instance.close();
            done(err);
          })
      } else {
        instance.close();
        done();
      }
    });
  });
};
