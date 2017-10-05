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

exports.run = function () {
  describe('RoleController', function () {

    before(function (done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        done(err);
      });
    });

    after(function (done) {
      instance.close();
      done();
    });

    describe('Return all roles from the table', function () {
      it('should return an array which is the list of all roles', function (done) {
        request
          .get(testingData.url + '/admin/roles/all')
          .end(function (error, res) {
            if (error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.contain.keys("id", "roleNameUk");
            done();
          });
      });
    });
  });
};
