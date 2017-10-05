var chai = require('chai')
  , expect = chai.expect
  , should = chai.should()
  , db = require('../../../app/models')
  , https = require('https')
  , testingData = require('../testingData/testingData')
  , testingFunctions = require('../testingData/testingFunctions')
  , express = require('express')
  , app = express()
  , instance
  , config = require('../../../config/config.js');

exports.run = function () {
  describe('Transaction log model', function() {
    before(function(done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        if (err) {
          done(err);
        } else {
          testingFunctions.addPaymentsPaymentDocument()
            .then(function (data) {
              testingData = data;
              done();
            })
            .catch(function (err) {
              console.error(err);
              instance.close();
              done(err);
            })
        }
      });
    });

    it('should add new record to Transaction log', function (done) {
      db.TransactionLog.addRecord(testingData.paymentsPaymentDocument.id, testingData.accrualsOptions.id, testingData.TrOpt.accrual, testingData.TrOpt.hash,
        testingData.TrOpt.receiptOfThePaymentSystem, testingData.TrOpt.senderName,
        testingData.TrOpt.senderEdrpoy, testingData.TrOpt.senderMfo, testingData.TrOpt.senderBankAccount,
        testingData.TrOpt.recipientName, testingData.TrOpt.recipientEdrpoy, testingData.TrOpt.recipientMfo, testingData.TrOpt.recipientBankAccount,
        testingData.TrOpt.status)
        .then(function (data) {
          expect(data).to.be.not.null;
          if(data) {
            testingData.TrOpt.id = data;
          }
          done();
        })
        .catch(function(err) {
          expect(err).to.be.undefined;
          console.log(err);
          done();
        })
    });

    describe('getUserPaymentsByPeriod', function() {
      /**
       * @param idHouse
       * @param year
       * @param month
       */
      it('should return dweller online payments by date', function (done) {
        db.TransactionLog.getTransactions(new Date())
          .then(function (data) {
            expect(data).to.be.not.empty;
            done();
          })
          .catch(function(err) {
            expect(err).to.be.undefined;
            console.log(err);
            done();
          })
      });
    });
    it('should return online transaction data by period', function (done) {
      db.TransactionLog.getUserPaymentsByPeriod(new Date())
        .then(function (data) {
          expect(data).to.be.not.empty;
          done();
        })
        .catch(function(err) {
          expect(err).to.be.undefined;
          console.log(err);
          done();
        })
    });

    it('should update record in transaction log', function (done) {
      var status = '0';
      db.TransactionLog.updateStatusById(testingData.TrOpt.id, status, testingData.TrOpt.receiptOfThePaymentSystem)
        .then(function () {
          db.TransactionLog.find({
            where: {id: testingData.TrOpt.id}
          })
            .then(function (data) {
              expect(data.dataValues.status).to.equal(parseInt(status));
              done();
            })
            .catch(function(err) {
              expect(err).to.be.undefined;
              console.log(err);
              done();
            });
        })
        .catch(function(err) {
          expect(err).to.be.undefined;
          console.log(err);
          done();
        })
    });

    it('should add payment system to transaction log', function (done) {
      var paymentSystemId = 1;
      db.TransactionLog.updatePaymentSystemId(testingData.TrOpt.id, paymentSystemId)
        .then(function (data) {
          db.TransactionLog.find({
            where: {id: testingData.TrOpt.id}
          })
            .then(function (data) {
              expect(data.dataValues.paymentSystemId).to.equal(parseInt(paymentSystemId));
              done();
            })
            .catch(function(err) {
              expect(err).to.be.undefined;
              console.log(err);
              done();
            });
          done();
        })
        .catch(function(err) {
          expect(err).to.be.undefined;
          console.error(err);
          done();
        })
    });

    it('should get transactions with status processing', function (done) {
      db.TransactionLog.getProgressingTransactions()
        .then(function (data) {
          expect(data).to.be.an('array');
          expect(data.length).not.equal(0);
          done();
        })
        .catch(function(err) {
          expect(err).to.be.undefined;
          console.error(err);
          done();
        })
    });

    after(function (done) {
      if(testingData.TrOpt.id) {
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
          .catch(function(err) {
            console.error(err);
            instance.close();
            done();
          })
      } else {
        instance.close();
        done();
      }
    });
  });
};
