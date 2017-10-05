var chai = require('chai')
  , expect = chai.expect
  , should = chai.should()
  , db = require('../../../app/models')
  , https = require('https')
  , serverOptions = require('../testingData/testingData').serverOptions
  , testingFunctions = require('../testingData/testingFunctions')
  , express = require('express')
  , app = express()
  , instance
  , testingData
  , config = require('../../../config/config.js');

exports.run = function () {
  describe('ServiceModel', function() {
    before(function(done) {
      instance = https.createServer(serverOptions, app);
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
    
    describe('select or add service', function() {
      it('should return service id', function (done) {
        db.Service.addOrSelectService(testingData.service.companyId, testingData.service.serviceName, testingData.service.serviceId)
          .then(function(data) {
            data.should.be.a('number');
            done();
          })
          .catch(function(err) {
            console.error(err);
            instance.close();
            done(err);
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
