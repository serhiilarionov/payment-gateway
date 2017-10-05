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

chai.should();

var existentCityId = 0;
var nonexistentCityId = -2;
var cityInfo = {
  id: 0,
  nameRus: "Киев",
  nameUk: "Київ"
};

exports.run = function () {
  describe('CompanyController', function () {

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

    describe('Get all companies with specified existent cityId', function () {
      it('should return all companies of the city', function (done) {
        request
          .post(testingData.url + '/companies/all')
          .send(cityInfo)
          .end(function (error, res) {
            res.status.should.be.equal(200);
            res.body.should.be.an('array');
            expect(res.body[0]).has.to.include.keys("id", "companyName");
            done();
          });
      });
    });
    describe('Try to get companies from the city where there are no any of them', function () {
      it('should return an empty array', function (done) {
        request
          .post(testingData.url + '/companies/all')
          .send({id: -6, nameRus: "Киев5", nameUk: "Киiв6"})
          .end(function (error, res) {
            res.status.should.be.equal(200);
            expect(res.body).to.be.empty;
            done();
          });
      });
    });
  });
};
