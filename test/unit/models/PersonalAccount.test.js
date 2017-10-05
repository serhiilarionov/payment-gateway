'use strict';

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
  describe('PersonalAccountModel', function() {
    before(function(done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        if (err) {
          done(err);
        } else {
          testingFunctions.addService()
            .then(function (data) {
              testingData = data;
              testingData.accrualsOptions.companyId = data.company.id;
              testingData.accrualsOptions.serviceId = data.service.id;
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
    describe('add accrual', function() {
      it('should add accrual', function (done) {
        db.PersonalAccount.addAccrual(testingData.accrualsOptions, testingData.accrualsOptions.companyId,
          testingData.accrualsOptions.serviceId)
          .then(function(data) {
            expect(data).to.be.a('number');
            testingData.accrualsOptions.id = data;
            done();
          })
          .catch(function(err) {
            console.error(err);
          });
      });
    });

    describe('negative test add accrual', function() {
      it('should return error', function (done) {
        db.PersonalAccount.addAccrual(testingData.incorrectAccrualsOpt)
          .then(function(data) {
            err.name.should.be.equal('error');
            done();
          })
          .catch(function(err) {
            err.name.should.be.equal('error');
            done();
          });
      });
    });

    describe('Negative testing get accruals by period', function() {
      it('should return error', function (done) {
        db.PersonalAccount.getAccrualsByPeriod(testingData.incorrectAccrualsOpt.idHouse,
          testingData.incorrectAccrualsOpt.year, testingData.incorrectAccrualsOpt.month)
          .then(function(data) {
            data.should.be.equal('error');
          })
          .catch(function(err) {
            err.name.should.be.equal('error');
            done();
          });
      });
    });

    describe('Get accruals', function() {
      it('expect to return accruals by month', function (done) {
        db.PersonalAccount.getAccrualsByPeriod(testingData.accrualsOptions.idHouse, testingData.accrualsOptions.year,
          testingData.accrualsOptions.month)
          .then(function(data) {
            expect(data[0]).to.be.a('object');
            expect(data[0]).to.include.keys("id", "transcript", "accrual", "companyId", "companyName", "dateOfAccrued",
              "debt", "forPayment", "number", "paid", "serviceId", "serviceName");
            done();
          })
          .catch(function(err) {
            console.error(err);
          });
      });
    });
    describe('Get accruals', function() {
      it('expect to return accruals by year', function (done) {
        db.PersonalAccount.getAccrualsByPeriod(testingData.accrualsOptions.idHouse, testingData.accrualsOptions.year, null,
          testingData.accrualsOptions.companyId, testingData.accrualsOptions.serviceId)
          .then(function(data) {
            expect(data[0]).to.be.a('object');
            expect(data[0]).to.include.keys("id", "transcript", "accrual", "companyId", "companyName", "dateOfAccrued",
              "debt", "forPayment", "number", "paid", "serviceId", "serviceName");
            done();
          })
          .catch(function(err) {
            console.error(err);
          });
      });
    });
    describe('Get minimal year by idHouse', function() {
      it('should return minimal year of accruals by idHouse', function (done) {
        db.PersonalAccount.getMinYearByIdHouse(testingData.accrualsOptions.idHouse)
          .then(function(data) {
            expect(data).to.be.a('number');
            done();
          })
          .catch(function(err) {
            console.error(err);
          });
      });
    });

    describe('Negative testing get minimal year by idHouse', function() {
      it('should return error', function (done) {
        db.PersonalAccount.getMinYearByIdHouse('\'')
          .then(function(data) {
            data.should.be.equal('error');
            done();
          })
          .catch(function(err) {
            err.name.should.be.equal('error');
            done();
          });
      });
    });

    after(function (done) {
      if (testingData.accrualsOptions.id) {
        db.PersonalAccount.destroy({id: testingData.accrualsOptions.id})
          .then(function () {
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
