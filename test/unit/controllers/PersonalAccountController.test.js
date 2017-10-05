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

var accrualsOptions = {
  idHouse: '00000000010200003004',
  number: '12345678',
  companyId: 4,
  companyName: 'Софтпроект',
  serviceId: 9,
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

var certAdminAgent = new https.Agent({
  pfx: testingData.cert_admin_test.pkcs12,
  passphrase: testingData.cert_admin_test.passphrase
});

exports.run = function () {
  describe('PersonalAccountsController', function() {

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

    describe('Get accruals by period', function() {
      it('should return accruals by period', function (done) {
        request
          .post(testingData.url + '/get/accruals')
          .agent(certAdminAgent)
          .send({idHouse: accrualsOptions.idHouse,
            year: accrualsOptions.year,
            month: '',
            companyId: accrualsOptions.companyId,
            serviceId: accrualsOptions.serviceId
          })
          .end(function(error, res){
            if(error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            res.body.should.be.an('array');
            //expect(res.body[0]).has.to.include.keys("id", "transcript", "accrual", "companyId", "companyName", "dateOfAccrued",
            //  "debt", "forPayment", "number", "paid", "serviceId", "serviceName");
            done();
          });
      });
    });

    describe('Negative testing get accruals by period', function() {
      it('should return error', function (done) {
        request
          .post(testingData.url + '/get/accruals')
          .agent(certAdminAgent)
          .send({idHouse: incorrectAccrualsOpt.idHouse,
            year: incorrectAccrualsOpt.year,
            month: incorrectAccrualsOpt.month})
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
      it('should return minimal year of accruals by idHouse', function (done) {
        request
          .post(testingData.url + '/get/accruals/year/minimal')
          .agent(certAdminAgent)
          .send({idHouse: accrualsOptions.idHouse})
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

    describe('Negative testing get minimal year by idHouse', function() {
      it('should return error', function (done) {
        request
          .post(testingData.url + '/get/accruals/year/minimal')
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
