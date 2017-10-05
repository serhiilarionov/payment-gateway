'use strict';

var request = require('superagent')
  , chai = require('chai')
  , expect = chai.expect
  , db = require('../../../app/models')
  , https = require('https')
  , testingData = require('../testingData/testingData')
  , express = require('express')
  , app = express()
  , instance
  , config = require('../../../config/config.js');

exports.run = function () {
  describe('UserController', function() {

    before(function (done) {
      require('../../../config/express')(app, config);
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        done(err);
      });
    });

    after(function (done) {
      instance.close();
      done();
    });

    describe('Processing the registration data', function() {
      it('should return the user data generated for registration', function (done) {
        request
          .get(testingData.url + '/verify')
          .query(testingData.verificationLink)
          .end(function(error, res){
            expect(error).has.be.null;
            res.status.should.be.equal(200);
            done();
          });
      });
    });

    describe('Completion of the employee registration', function() {
      it('should finish the registration process', function (done) {
        request
          .post(testingData.url + '/verify')
          .send(testingData.confirmRegistrationData)
          .accept('text/html')
          .end(function(error, res){
            expect(error).has.be.null;
            res.status.should.be.equal(200);
            done();
          });
      });
    });

  });
};
