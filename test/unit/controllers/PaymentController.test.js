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

var payment = {
  personalAccount: '123123123',
  idHouse: '00000000010200003004',
  companyId: 12345,
  companyName: 'Софтпроект',
  serviceName: 'Создание мегосайта',
  serviceId: 12345,
  mfoSender: 300002,
  mfoRecipient: 300005,
  amount: 12.5,
  paymentDate: new Date(2015, 1, 1),
  dateOfEnrollment: new Date(2015, 1, 1),
  year: 2015,
  month: 1,
  recipientBankAccount: 123345,
  senderBankAccount: 123123,
  transactionId: 34534
};

var incorrectPayment = {
  personalAccount: 12312,
  idHouse: true,
  companyId: 'Microsoft',
  mfo: false,
  amount: 'So much money',
  paymentDate: 'Дата оплаты',
  dateOfEnrollment: 'Дата начисления',
  serviceId: 'Not this time'
};

exports.run = function () {
  describe('PaymentsController', function() {

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

    describe('get: /payment/data/online', function() {
      /**
       * @param year
       * @param month
       * @param idHouse
       */
      it('Should return dweller online payments by period', function (done) {
        done();
      });

      it('Should return 400 (missing params)', function (done) {
        done();
      });
    });

    describe('add payments', function() {
      it('should add new payments', function (done) {
        request
          .post(testingData.url + '/add/payments')
          .agent(certAdminAgent)
          .send({
            companyId: 12345,
            companyName:'Софтпроект',
            payments: [payment, payment, payment],
            paymentDate: payment.paymentDate
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

    describe('Negative test "add payments"', function() {
      it('should return error ', function (done) {
        request
          .post(testingData.url + '/add/payments')
          .agent(certAdminAgent)
          .send({
            companyId: 12345,
            companyName:'Софтпроект',
            payments: [incorrectPayment]
          })
          .end(function(error, res){
            res.status.should.be.equal(500);
            done();
          });
      });
    });

    describe('Get payments by period', function() {
      it('should return payments by period', function (done) {
        request
          .post(testingData.url + '/get/payments')
          .agent(certAdminAgent)
          .send({idHouse: payment.idHouse,
            year: payment.year,
            month: payment.month})
          .end(function(error, res){
            if(error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            expect(res.body[0]).has.to.include.keys("amount", "personalAccount", "companyName", "paymentDate",
              "dateOfEnrollment", "bankName", "serviceName");
            done();
          });
      });
    });

    describe('Negative testing get payments by period', function() {
      it('should return error', function (done) {
        request
          .post(testingData.url + '/get/payments')
          .agent(certAdminAgent)
          .send({idHouse: incorrectPayment.idHouse,
            year: incorrectPayment.year,
            month: incorrectPayment.month})
          .end(function(error, res){
            if(error) {
              console.log(error);
            }
            res.status.should.be.equal(500);
            expect(res.text).be.equal('Server error');
            done();
          });
      });
    });

    describe('Get minimal year by idHouse', function() {
      it('should return minimal year of payments by idHouse', function (done) {
        request
          .post(testingData.url + '/get/payments/year/minimal')
          .agent(certAdminAgent)
          .send({idHouse: payment.idHouse})
          .end(function(error, res){
            if(error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            expect(res.body).to.be.a('number');
            done();
          });
      });
    });

    describe('Negative testing get minimal payment year by idHouse', function() {
      it('should return error', function (done) {
        request
          .post(testingData.url + '/get/payments/year/minimal')
          .agent(certAdminAgent)
          .send({idHouse: '\''})
          .end(function(error, res){
            if(error) {
              console.log(error);
            }
            res.status.should.be.equal(500);
            expect(res.text).be.equal('Server error');
            done();
          });
      });
    });

  });
};
