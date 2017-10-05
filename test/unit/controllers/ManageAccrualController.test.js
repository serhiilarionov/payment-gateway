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

var accrualsOptions = {
  idHouse: '00000000010200003004',
  number: '12345678',
  companyId: 12345,
  companyName: 'Софтпроект',
  serviceId: 12345,
  serviceName: 'Создание мегосайта',
  debt: 0,
  accrual: 12,
  forPayment: 213,
  paid: 12,
  dateOfAccrued: '01.01.2015',
  lastName: 'Пупкин',
  firstName: 'Иван',
  patronymic: 'Иванович',
  year: 2015,
  month: 1,
  transcript: '2+2=4',
  accrualDate: new Date(2015, 1, 1)
};
var incorrectAccrualsOpt = {
  idHouse: true,
  number: false,
  companyName: true,
  serviceName: true,
  debt: true,
  accrual: 'sdfsdfsdf',
  forPayment: 'fdfgdf',
  paid: 'dfgdfgdfg',
  dateOfAccrued: 3.14,
  year: 'year',
  month: 'month'
};
var counter = {
  personalAccountId: '168272',
  companyId: 4,
  serviceId: 10,
  month: 11,
  year: 2014
};

exports.run = function () {
  describe('ManageAccrualsController', function() {

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

    describe('add accruals', function() {
      it('should add new accruals', function (done) {
        request
          .post(testingData.url + '/add/accruals')
          .agent(certAdminAgent)
          .send({
            companyId: 12345,
            companyName:'Софтпроект',
            accruals: [accrualsOptions,accrualsOptions,accrualsOptions],
            accrualDate: accrualsOptions.accrualDate
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

    describe('Negative test "add accruals"', function() {
      it('should return error ', function (done) {
        request
          .post(testingData.url + '/add/accruals')
          .agent(certAdminAgent)
          .send({
            companyId: 12345,
            companyName:'Софтпроект',
            accruals: [incorrectAccrualsOpt]
          })
          .end(function(error, res){
            res.status.should.be.equal(500);
            done();
          });
      });
    });

    describe('delete month accruals', function() {
      it('should delete month accruals', function (done) {
        request
          .post(testingData.url + '/delete/accruals')
          .agent(certAdminAgent)
          .send({
            companyId: 12345,
            companyName:'Софтпроект',
            accrualDate: accrualsOptions.accrualDate
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

    describe('select counters', function() {
      it('should return counters', function (done) {
        request
          .post(testingData.url + '/get/counters')
          .agent(certAdminAgent)
          .send({
            personalAccountId: counter.personalAccountId,
            companyId: counter.companyId,
            serviceId: counter.serviceId,
            year: counter.year,
            month: counter.month
          })
          .end(function(error, res){
            if(error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            expect(res.body[0]).has.to.include.keys("id", "personalAccountId", "idHouse", "serviceId", "companyId", "position", "meterReading", "date");
            done();
          });
      });
    });
  });
};
