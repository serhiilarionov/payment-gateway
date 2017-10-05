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
  describe('Payments payment document model', function() {
    before(function (done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        if (err) {
          done(err);
        } else {
          testingFunctions.addPersonalAccaunt()
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

    it('should add new record to payments payment document', function (done) {
      db.PaymentsPaymentDocument.addPaymentsPaymentDocument(testingData.PdOpt.idHouse, testingData.accrualsOptions.id,
        testingData.company.id, testingData.service.id, testingData.PdOpt.date, testingData.PdOpt.sum)
        .then(function (data) {
          expect(data).to.be.not.null;
          if (data) {
            testingData.PdOpt.id = data;
          }
          done();
        })
        .catch(function (err) {
          console.error(err);
          done();
        })
    });

    after(function (done) {
      if (testingData.PdOpt.id) {
        db.PaymentsPaymentDocument.destroy({id: testingData.PdOpt.id})
          .then(function () {
            if (testingData.accrualsOptions.id) {
              testingFunctions.removePersonalAccaunt()
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
            done();
          })
      }
    });
  });
};
