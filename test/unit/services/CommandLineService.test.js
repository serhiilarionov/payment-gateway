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
  , config = require('../../../config/config.js')
  , service = require('../../../app/services/CommandLineService.js');

chai.should();

exports.run = function () {
    describe('CommandLineService', function() {

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

        describe('It should generate the certificate sign request', function () {
            it('should return the message that the certificate sign request was generated successfully', function (done) {
                service.Cli.generateCertificate(testingData.certificateData.userLogin,
                                                  testingData.certificateData.userCity,
                                                  testingData.certificateData.userCompany,
                                                  testingData.certificateData.userFio,
                                                  testingData.certificateData.userEmail,
                                                  testingData.certificateData.days)
                    .then(function (data) {
                        expect(data).to.equal('Certificate request was generated successfully');
                        done();
                    })
                    .catch(function (err) {
                        done(err);
                    });
            });
        });

        describe('It should sign the certificate sign request', function () {
            it('should return the message that the certificate sign request was signed successfully', function (done) {
                service.Cli.signCertificate(testingData.certificateData.userLogin, testingData.certificateData.days)
                    .then(function (data) {
                        expect(data).to.equal('Certificate was signed successfully');
                        done();
                    })
                    .catch(function (err) {
                        done(err);
                    });
            });
        });

        describe('It should create the PKCS#12 file from the certificate', function () {
            it('should return the message that the PKCS#12 file was created successfully', function (done) {
                service.Cli.createPkcsFromCertificate(testingData.certificateData.userLogin, testingData.certificateData.userPass)
                    .then(function (data) {
                        expect(data).to.equal('PKCS#12 file was created successfully');
                        done();
                    })
                    .catch(function (err) {
                        done(err);
                    });
            });
        });

        describe('It should revoke the certificate', function () {
            it('should return the message that the certificate has been revoked', function (done) {
                service.Cli.revokeCertificate(testingData.certificateData.userLogin)
                    .then(function (data) {
                        expect(data).to.equal('Certificate '+testingData.certificateData.userLogin+'.crt has been revoked');
                        done();
                    })
                    .catch(function (err) {
                        done(err);
                    });
            });
        });

        describe('It should update the certificate revocation list', function () {
            it('should return the message that the revocation list has been updated', function (done) {
                service.Cli.updateCrtRevocationList()
                    .then(function (data) {
                        expect(data).to.equal("Revocation list has been updated");
                        done();
                    })
                    .catch(function (err) {
                        done(err);
                    });
            });
        });

        describe('It should delete revoked certificates from the file system', function () {
            it('should return the message that all revoked certificates have been deleted', function (done) {
                service.Cli.deleteRevokedCertificates(testingData.certificateData.userLogin)
                  .then(function (data) {
                      expect(data).to.equal("All revoked certificates have been deleted");
                      done();
                  })
                  .catch(function (err) {
                      done(err);
                  });
            });
        });
    });
};

