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
  describe('Counter payment document model', function() {
    before(function(done) {
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

    it('should add new record to counter payment document', function (done) {
      db.CounterPaymentDocument.addCounterPaymentDocument(testingData.CpdOpt.date, testingData.CpdOpt.idHouse, testingData.counter.id,
        testingData.company.id, testingData.service.id, testingData.CpdOpt.position, testingData.CpdOpt.meterReading)
        .then(function (data) {
          expect(data).to.be.not.null;
          if(data){
            testingData.CpdOpt.id = data;
          }
          done();
        })
        .catch(function(err) {
          console.error(err);
          done();
        })
    });

    after(function (done) {
      if(testingData.CpdOpt.id) {
        db.CounterPaymentDocument.destroy({id: testingData.CpdOpt.id})
          .then(function () {
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
