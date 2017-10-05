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

var userInfo = {
  userLogin: Math.floor(Math.random() * 100000) + "test" + Math.floor(Math.random() * 100000),
  userCity: {
    nameUk: "Київ"
  },
  userCompany: {
    companyName: "Тестова компанія"
  },
  userFio: "Test Test Test",
  userEmail: "mail.user.pg@mail.ru",
  userPassword: "123123"
};

var userId = {
  id: 7
};

exports.run = function () {
  describe('CliController', function () {

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

    describe('Generating user certificate based on user information', function () {
      it('should return the message that PKCS#12 file was created successfully', function (done) {
        request
          .post(testingData.url + '/admin/cli/gencert')
          .send(userInfo)
          .end(function (error, res) {
            if (error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            expect(res.body).to.equal("PKCS#12 file was created successfully");
            done();
          });
      });
    });

    describe('Revocation of the user certificate', function () {
      it('should return the message that Revocation list has been updated', function (done) {
        request
          .post(testingData.url + '/admin/cli/revokecert')
          .send(userId)
          .end(function (error, res) {
            if (error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            expect(res.body).to.equal("Revoked");
            done();
          });
      });
    });

  });
};
