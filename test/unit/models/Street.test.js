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
  describe('StreetModel', function() {
    before(function(done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        if (err) {
          done(err);
        } else {
          testingFunctions.addStreet()
            .then(function (data) {
              testingData = data;
              done();
            })
            .catch(function (err) {
              instance.close();
              done(err);
            })
        }
      });
    });

    describe('Get streets by cityId', function() {
      it('expect to return streets by cityId', function (done) {
        db.Street.getStreets(testingData.city.id)
          .then(function(data) {
            expect(data[0]).has.to.include.keys("id", "nameRus", "nameUk");
            done();
          })
          .catch(function(err) {
            done(err);
          });
      });
    });
    describe('Negative testing get streets by cityId', function() {
      it('should return error', function (done) {
        db.Street.getStreets(testingData.incorrectCity.id)
          .then(function(data) {
            expect(data.error).be.equal('Не коректно задано місто.');
            done();
          })
          .catch(function(err) {
            done(err);
          });
      });
    });

    after(function (done) {
      if (testingData.street.id) {
        testingFunctions.removeStreet()
          .then(function (data) {
            if (data) {
              instance.close();
              done();
            }
          })
          .catch(function (err) {
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
