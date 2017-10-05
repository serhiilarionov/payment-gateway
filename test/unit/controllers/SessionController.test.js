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

require('../../../config/express')(app, config);
chai.should();

var Options = {
  cityId: 0,
  idHouse: '00000000010200003004',
  pin_code: 1234

};
var incorrectOpt = {
  cityId: 'qwrqwr',
  idHouse: '00056000010200003004',
  pin_code: 1874
};

exports.run = function () {
  describe('SessionController', function() {

    before(function(done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        done(err);
      });
    });

    after(function(done) {
      instance.close();
      done();
    });

    describe('Check pin_code', function() {
      it('should return success', function (done) {
        request
          .post(testingData.url + '/user/check/pinCode')
          .send({
            pin_code: Options.pin_code,
            idHouse: Options.idHouse
          })
          .end(function(error, res){
            res.status.should.be.equal(200);
            done(error);
          });
      });
    });

    describe('Negative testing check pin_code', function() {
      it('should return error', function (done) {
        request
          .post(testingData.url + '/user/check/pinCode')
          .send({
            pin_code: incorrectOpt.pin_code,
            idHouse: incorrectOpt.idHouse
          })
          .end(function(error, res){
            res.status.should.be.equal(401);
            expect(res.body).has.to.include.keys("message", "status_code");
            res.body.message.should.be.equal('Incorrect pin code');
            res.body.status_code.should.be.equal(4002);
            done(error);
          });
      });
    });
  });
};
