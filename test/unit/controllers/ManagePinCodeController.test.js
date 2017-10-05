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

var pinCodeOptions = {
  idHouse: '00000000010200003004',
  whenIssuedPassport: '12.12.2014',
  issuedPassport: 'Жовтневий РУВД ',
  passportNumber: 'ПР123123',
  firstName: 'Евгений',
  lastName: 'Акимов',
  patronymic: 'Сергеевич'
};
var incorrectPinCodeOpt = {
  idHouse: 555555485,
  whenIssuedPassport: 'вчера',
  issuedPassport: true,
  passportNumber: 'number',
  firstName: null,
  lastName: null,
  patronymic: null
};

exports.run = function () {
  describe('ManagePinCodeController', function() {

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

    describe('add pin code', function() {
      it('should add new pin code', function (done) {
        request
          .post(testingData.url + '/generate/pinCode')
          .agent(certAdminAgent)
          .send({
            idHouse: '00000000010200003004',
            whenIssuedPassport: '12.12.2014',
            issuedPassport: 'Жовтневий РУВД ',
            passportNumber: 'ПР123123',
            firstName: 'Евгений',
            lastName: 'Акимов',
            patronymic: 'Сергеевич'
          })
          .end(function(error, res){
            if(error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            done();
          });
      });
    });

  });
};
