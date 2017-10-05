var chai = require('chai')
  , expect = chai.expect
  , should = chai.should()
  , db = require('../../../app/models')
  , https = require('https')
  , testingData = require('../testingData/testingData')
  , testingFunctions = require('../testingData/testingFunctions')
  , express = require('express')
  , app = express()
  , instance
  , config = require('../../../config/config.js');

exports.run = function () {
  describe('CompanyModel', function () {
    before(function(done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        if (err) {
          done(err);
        } else {
          testingFunctions.addCompany()
            .then(function (data) {
              testingData = data;
              done();
            })
            .catch(function (err) {
              console.error(err);
              instance.close();
              done(err);
            })
        }
      });
    });

    describe('get company id', function () {
      it('should return company id', function (done) {
        db.Company.getCompanyId(testingData.company.companyName, testingData.company.companyId)
          .then(function (data) {
            data.should.be.a('number');
            done();
          })
          .catch(function (err) {
            console.error(err);
          });
      });
    });

    describe('Get all companies with the specific cityId', function () {
      it('should return all companies that belong to specified city', function (done) {
        db.Company.getCompanies(testingData.city.id)
          .then(function (data) {
            expect(data[0]).to.be.a('object');
            done();
          })
          .catch(function (err) {
            console.error(err);
          });
      });
    });

    describe('Get all companies with nonexistent cityId', function () {
      it('should return an empty array', function (done) {
        db.Company.getCompanies(testingData.wrongCityId)
          .then(function (data) {
            expect(data).to.be.empty;
            done();
          })
          .catch(function (err) {
            console.error(err);
          });
      });
    });

    describe('Set closing date to company', function () {
      it('should return true', function (done) {
        db.Company.setClosingDate(testingData.company.closingDate, testingData.company.id)
          .then(function (data) {
            expect(data).to.be.true;
            done();
          })
          .catch(function (err) {
            console.error(err);
          });
      });
    });
    describe('Check closing date', function () {
      it('should return true', function (done) {
        db.Company.checkClosingDate(testingData.company.year, testingData.company.month, testingData.company.id)
          .then(function (data) {
            expect(data).to.be.true;
            done();
          })
          .catch(function (err) {
            console.error(err);
          });
      });
    });

    after(function (done) {
      if (testingData.company.id) {
        testingFunctions.removeCompany()
          .then(function (data) {
            if (data) {
              instance.close();
              done();
            }
          })
          .catch(function (err) {
            console.error(err);
            instance.close();
            done(err);
          })
      } else {
        instance.close();
        done();
      }
    });
  });
};
