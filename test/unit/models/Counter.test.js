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
  describe('CounterModel', function () {
    before(function (done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        if (err) {
          done(err);
        } else {
          testingFunctions.addCounter()
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

    it('should return counter data', function (done) {
      db.Counter.getCounters(testingData.accrualsOptions.id, testingData.company.id,
        testingData.service.id, testingData.counter.month, testingData.counter.year)
        .then(function (data) {
          expect(data).to.be.an('array');
          expect(data[0]).has.to.include.keys("id", "personalAccountId", "idHouse", "serviceId", "companyId", "position", "meterReading", "date");
          done();
        })
        .catch(function (err) {
          console.error(err);
        });
    });

    after(function (done) {
      if (testingData.counter.id) {
        testingFunctions.removeCounter()
          .then(function (data) {
            if(data) {
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
