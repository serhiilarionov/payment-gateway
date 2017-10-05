'use strict';

var chai = require('chai')
  , expect = chai.expect
  , should = chai.should()
  , https = require('https')
  , express = require('express')
  , db = require('../../../app/models')
  , app = express()
  , instance
  , config = require('../../../config/config.js')
  , testingData = require('../testingData/testingData')
  , testingFunctions = require('../testingData/testingFunctions');

exports.run = function () {
  describe('PaymentModel', function() {
    before(function(done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        if (err) {
          done(err);
        } else {
          testingFunctions.addService()
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

    describe('Negative test for add payment', function() {
      it('should return error', function (done) {
        db.Payment.addPayment(testingData.incorrectPayment, testingData.incorrectPayment.serviceId,
          testingData.incorrectPayment.companyId)
          .then(function(data) {
            console.log(data);
          })
          .catch(function(err) {
            expect(err).to.be.an('object');
            err.name.should.be.equal('error');
            done();
          });
      });
    });

    describe('add payment', function() {
      it('should return true', function (done) {
        db.Payment.addPayment(testingData.payment, testingData.service.id, testingData.company.id, testingData.payment.paymentDate)
          .then(function(data) {
            expect(data).to.be.true;
            done();
          })
          .catch(function(err) {
            console.error(err);
          });
      });
    });

    describe('Get minimal year by idHouse', function() {
      it('should return minimal year of payment by idHouse', function (done) {
        db.Payment.getMinYearByIdHouse(testingData.payment.idHouse)
          .then(function(data) {
            expect(data).to.be.a('number');
            done();
          })
          .catch(function(err) {
            console.error(err);
          });
      });
    });

    describe('Get payments by period', function() {
      it('expect to return payments', function (done) {
        db.Payment.getPaymentsByPeriod(testingData.payment.idHouse, testingData.payment.year, testingData.payment.month)
          .then(function(data) {
            expect(data[0]).has.to.include.keys("amount", "personalAccount", "companyName", "paymentDate",
              "dateOfEnrollment", "bankName", "serviceName");
            done();
          })
          .catch(function(err) {
            console.error(err);
          });
      });
    });

    describe('delete Month Payments', function() {
      it('should return true', function (done) {
        db.Payment.deleteMonthPayments(testingData.company.id, testingData.payment.year, testingData.payment.month)
          .then(function(data) {
            expect(data).to.be.true;
            done();
          })
          .catch(function(err) {
            console.error(err);
          });
      });
    });

    after(function (done) {
      if (testingData.service.id) {
        testingFunctions.removeService()
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
    });
  });
};
