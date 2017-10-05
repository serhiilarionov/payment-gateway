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

exports.run = function () {
  describe('CityController', function () {

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

    describe('Get all cities', function () {
      it('should return all cities', function (done) {
        request
          .get(testingData.url + '/cities/all')
          .end(function (error, res) {
            res.status.should.be.equal(200);
            res.body.should.be.an('array');
            expect(res.body[0]).has.to.include.keys("id", "nameRus", "nameUk");
            done();
          });
      });
    });
  });

};
