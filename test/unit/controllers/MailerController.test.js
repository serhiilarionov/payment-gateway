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

var certAdminAgent = new https.Agent({
  pfx: testingData.cert_admin_test.pkcs12,
  passphrase: testingData.cert_admin_test.passphrase
});

var userInfo = {
  userEmail: 'mupah@alivance.com',
  userLogin: 'test',
  userPassword: 'qwerty123'
};

exports.run = function () {
  describe('MailerController', function () {

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

    describe('It sends an email with the password to the user', function () {
      it('should return the message that an email has been sent successfully', function (done) {
        request
          .post(testingData.url + '/admin/mailer/sendpass')
          .agent(certAdminAgent)
          .send(userInfo)
          .end(function (error, res) {
            if (error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            expect(res.body).to.equal("Відправлено");
            done();
          });
      });
    });
    describe('It sends an email with the certificate to the user', function () {
      it('should return the message that an email has been sent successfully', function (done) {
        request
          .post(testingData.url + '/admin/mailer/sendcertificate')
          .agent(certAdminAgent)
          .send(userInfo)
          .end(function (error, res) {
            if (error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            expect(res.body).to.equal("Відправлено");
            done();
          });
      });
    });
  });
};
