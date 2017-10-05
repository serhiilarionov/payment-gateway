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
  , testingData = require('../testingData/testingData');



exports.run = function () {
  describe('Payment document model', function() {
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

    it('should add new record to payment document', function (done) {
      db.PaymentDocument.addPaymentDocument(testingData.PdOpt.date, testingData.PdOpt.sum, testingData.PdOpt.payer.value,
        testingData.PdOpt.idHouse, testingData.PdOpt.hash)
        .then(function (data) {
          expect(data).to.be.not.null;
          if(data){
            testingData.PdOpt.id = data;
          }
          done();
        })
        .catch(function(err) {
          console.error(err);
          done();
        })
    });

    after(function (done) {
      if(testingData.PdOpt.id) {
        db.PaymentDocument.destroy({id: testingData.PdOpt.id})
          .then(function () {
            instance.close();
            done();
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
