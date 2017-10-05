var chai = require('chai')
  , expect = chai.expect
  , should = chai.should()
  , db = require('../../../app/models')
  , https = require('https')
  , testingData = require('../testingData/testingData')
  , express = require('express')
  , app = express()
  , instance
  , config = require('../../../config/config.js');

exports.run = function () {
  describe('PinCodeModel', function() {
    before(function(done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
    });

    describe('add pin code', function() {
      it('expect to return pin code by idHouse', function (done) {
        db.PinCode.addPinCode(testingData.pinCode.idHouse, testingData.pinCode.pinCode, testingData.pinCode.whenIssuedPassport,
          testingData.pinCode.issuedPassport, testingData.pinCode.passportNumber, testingData.pinCode.firstName,
          testingData.pinCode.lastName, testingData.pinCode.patronymic)
          .then(function(data) {
            expect(data).has.to.include.keys("id", "count");
            testingData.pinCode.id = data.id;
            done();
          })
          .catch(function(err) {
            console.error(err);
          });
      });
    });

    describe('Get pin code by idHouse', function() {
      it('expect to return pin code by idHouse', function (done) {
        db.PinCode.getPinCode(testingData.pinCode.idHouse, testingData.pinCode.pinCode)
          .then(function(data) {
            expect(data).to.be.true;
            done();
          })
          .catch(function(err) {
            console.error(err);
          });
      });
    });

    describe('Negative testing get pin code by idHouse', function() {
      it('should return error', function (done) {
        db.PinCode.getPinCode(testingData.incorrectPinCode.idHouse, testingData.pinCode.pinCode)
          .then(function(data) {
            expect(data).to.be.false;
            done();
          })
          .catch(function(err) {
            console.error(err);
          });
      });
    });

    after(function (done) {
      if (testingData.pinCode.id) {
        db.PinCode.destroy({id: testingData.pinCode.id})
          .then(function () {
            instance.close();
            done();
          })
          .catch(function (err) {
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
