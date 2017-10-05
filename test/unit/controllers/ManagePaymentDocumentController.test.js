'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var chai = require('chai')
  , expect = chai.expect
  , should = chai.should()
  , request = require('superagent')
  , path = require('path')
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

exports.run = function () {
  describe('ManagePaymentDocumentController', function() {
    before(function(done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        if (err) {
          done(err);
        } else {
          console.log("started");
          done();
        }
      });
    });
    describe('add payment document', function() {
      it('should add new payment document', function (done) {
        request
          .post(testingData.url + '/create/payment/document')
          .agent(certAdminAgent)
          .send({
            variables: testingData.PdOpt
          })
          .ca(testingData.serverOptions.ca)
          .end(function(error, res){
            if(error) {
              console.error(error);
            }
            res.status.should.be.equal(200);
            if(res.data){
              testingData.PdOpt.id = res.data;
            }
            done();
          });
      });
    });
  });
  after(function (done) {
    if (testingData.PdOpt.id) {
      db.PaymentDocument.destroy({hash: testingData.PdOpt.hash})
        .then(function () {
          instance.close();
          console.log("stopped");
          done();
        })
        .catch(function (err) {
          console.log(err);
          done();
        })
    } else {
      instance.close();
      console.log("stopped");
      done();
    }
  });
};

