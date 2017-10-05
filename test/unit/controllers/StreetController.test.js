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

var certAdminAgent = new https.Agent({
  pfx: testingData.cert_admin_test.pkcs12,
  passphrase: testingData.cert_admin_test.passphrase
});

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
  describe('StreetController', function() {

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

    describe('Get streets by cityId', function() {
      it('should return streets by cityId', function (done) {
        request
          .post(testingData.url + '/streets/by/cityId')
          .send({
            cityId: Options.cityId
          })
          .end(function(error, res){
            if(error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            expect(res.body[0]).has.to.include.keys("id", "nameRus", "nameUk");
            done();
          });
      });
    });

    describe('Negative testing get streets by cityId', function() {
      it('should return error', function (done) {
        request
          .post(testingData.url + '/streets/by/cityId')
          .send({
            cityId: incorrectOpt.cityId
          })
          .end(function(error, res){
            if(error) {
              console.log(error);
            }
            expect(res.body).has.to.include.keys("message", "status_code");
            res.body.message.should.be.equal('Incorrect city');
            res.body.status_code.should.be.equal(4003);
            done();
          });
      });
    });

  });
};
