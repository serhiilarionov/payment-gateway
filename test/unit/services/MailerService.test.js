var chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
    ;
var service = require('../../../app/services/MailerService.js');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var testingData = require('../testingData/testingData');

exports.run = function () {
    describe('MailerService', function() {
        describe('It sends an email with the password to the user', function () {
            it('should return the message that an email has been sent successfully', function (done) {
                service.Mailer.sendVerificationLink(testingData.mailData.userEmail, testingData.mailData.userLogin,
                                                    testingData.mailData.userLink, testingData.mailData.userPassword)
                    .then(function (data) {
                      expect(data).to.equal('Sent successfully');
                      done();
                    })
                    .catch(function (err) {
                      done(err);
                    });
            });
        });

        describe('It sends an email with the certificate to the user', function () {
            it('should return the message that an email has been sent successfully', function (done) {
                service.Mailer.sendCertificate(testingData.mailData.userEmail, testingData.mailData.userLogin, testingData.mailData.userPassword)
                    .then(function (data) {
                      expect(data).to.equal('Sent successfully');
                      done();
                    })
                    .catch(function (err) {
                      done(err);
                    });
            });
        });
    });
};

