'use strict';

var chai = require('chai')
  , expect = chai.expect
  , should = chai.should()
  , https = require('https')
  , chaiAsPromised = require("chai-as-promised")
  , express = require('express')
  , db = require('../../../app/models')
  , app = express()
  , instance
  , config = require('../../../config/config.js')
  , testingData = require('../testingData/testingData')
  , testingFunctions = require('../testingData/testingFunctions')
  , testingSettings = require('../testingData/testingSettings');
chai.use(chaiAsPromised);

exports.run = function () {
  describe('EmployeeModel', function() {
    before(function(done) {
      require('../../../config/express')(app, config);
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

    describe('Add an employee to the table', function () {
      it('should add new employee without any errors', function (done) {
        db.Employee.addNewEmployee(
          testingData.newUserInfo.userLogin,
          testingData.newUserInfo.userFio,
          testingData.newUserInfo.userEmail,
          testingData.city.id,
          testingData.company.id,
          testingData.newUserInfo.userRole,
          testingData.newUserInfo.userCertTerm)
          .then(function (data) {
            expect(data).to.be.an.array;
            expect(data.length).to.be.equal(1);
            expect(data[0]).to.include.keys("id","link","login","password");
            testingData.newUserInfo.userLogin = data[0].login;
            done();
          })
          .catch(function (err) {
            console.error(err);
          });
      });
    });

    describe('Get an employee by nonexistent login', function () {
      it('should return an empty array', function (done) {
        db.Employee.checkIfEmployeeExists(testingData.nonexistentLogin)
          .then(function (data) {
            expect(data).to.be.empty;
            done();
          })
          .catch(function (err) {
            console.error(err);
          });
      });
    });

    describe('Get all employees from the table "employees"', function () {
      it('should return all employees from the table "employees"', function (done) {
        db.Employee.getAllEmployees()
          .then(function (data) {
            expect(data).to.be.an('array');
            expect(data[0]).has.to.include.keys("id", "login", "fio", "isdisabled", "nameUk", "companyName");
            done();
          });
      });
    });

    describe('Get an employee by existent login', function () {
      it('should return an id of the employee', function (done) {
        db.Employee.checkIfEmployeeExists(testingData.newUserInfo.userLogin)
          .then(function (data) {
            expect(data[0].id).to.be.a('number');
            expect(data.length).to.equal(1);
            testingData.newUserInfo.id = data[0].id;
            done();
          })
          .catch(function (err) {
            done(err);
          });
      });
    });

    describe('Get an employee by ID', function () {
      it('should return an array with provided ID', function (done) {
        db.Employee.getEmployeeById(testingData.newUserInfo.id)
          .then(function (data) {
            expect(data).to.be.an('object');
            expect(data.id).to.equal(testingData.newUserInfo.id);
            done();
          })
          .catch(function (err) {
            done(err);
          });
      });
    });

    describe('Disable an employee', function () {
      it('should disable an employee with given ID', function (done) {
        db.Employee.disableTheEmployee(testingData.newUserInfo.id)
          .then(function (data) {
            expect(data).to.equal(null);
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
              if (testingData.newUserInfo.id) {
                db.Employee.destroy({id: testingData.newUserInfo.id})
                  .then(function () {
                    if (testingData.newUserInfo.userLogin) {
                      db.VerificationLinks.destroy({login: testingData.newUserInfo.userLogin})
                        .then(function () {
                          instance.close();
                          done();
                        })
                        .catch(function (err) {
                          console.error(err);
                          instance.close();
                          done();
                        })
                    } else {
                      instance.close();
                      done();
                    }
                  })
                  .catch(function (err) {
                    console.error(err);
                    instance.close();
                    done();
                  })
              } else {
                instance.close();
                done();
              }
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
