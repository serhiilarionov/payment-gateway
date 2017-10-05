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

exports.run = function () {
  describe('ManageEmployeeController', function () {

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

    describe('Check if the employee login already exists', function () {

      it('should login with admin certificate', function(done) {
        request
          .get(testingData.url + '/admin/')
          .agent(certAdminAgent)
          .end(function (err, res) {
            res.status.should.be.equal(200);
            done();
          });
      });

      it('should return an employee with given login', function (done) {
        request
          .get(testingData.url + '/admin/employees/check')
          .agent(certAdminAgent)
          .query({
            userLogin: 'ADMIN_TEST'
          })
          .end(function (error, res) {
            res.status.should.be.equal(200);
            res.body.should.have.deep.property('[0].id').to.be.an('number');
            done();
          });
      });
    });

    describe('Check if the employee login already exists providing nonexistent login', function () {
      it('should return an empty array', function (done) {
        request
          .get(testingData.url + '/admin/employees/check')
          .agent(certAdminAgent)
          .query({
            userLogin: 'nonexistingLogin'
          })
          .end(function (error, res) {
            res.status.should.be.equal(200);
            res.body.should.be.empty;
            done();
          });
      });
    });

    describe('Adding new employee to the table', function () {
      it('should add an employee without errors', function (done) {
        request
          .post(testingData.url + '/admin/employees/addnewemployee')
          .agent(certAdminAgent)
          .send(testingData.newUserInfo)
          .end(function (error, res) {
            res.status.should.be.equal(200);
            res.body.should.be.empty;
            done();
          });
      });
    });

    describe('Return all employees from the table', function () {
      it('should return an array which is the list of all employees', function (done) {
        request
          .post(testingData.url + '/admin/employees/getallemployees')
          .agent(certAdminAgent)
          .send({})
          .end(function (error, res) {
            if (error) {
              console.log(error);
            }
            res.status.should.be.equal(200);
            //expect(res.body).to.be.an('array');
            res.body.should.be.an('array');
            res.body.should.have.deep.property('[0].id').to.be.an('number');
            res.body.should.have.deep.property('[0].login').to.be.an('string');
            res.body.should.have.deep.property('[0].fio').to.be.an('string');
            res.body.should.have.deep.property('[0].nameUk').to.be.an('string');
            res.body.should.have.deep.property('[0].companyName').to.be.an('string');
            res.body.should.have.deep.property('[0].roles').to.be.an('string');
            res.body.should.have.deep.property('[0].isdisabled').to.be.an('boolean');
            done();
          });
      });
    });
  });
};
