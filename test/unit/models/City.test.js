'use strict';

var chai = require('chai')
  , expect = chai.expect
  , db = require('../../../app/models')
  , https = require('https')
  , testingData = require('../testingData/testingData')
  , express = require('express')
  , app = express()
  , instance
  , config = require('../../../config/config.js');

exports.run = function () {
  describe('CityModel', function() {
    before(function(done) {
      instance = https.createServer(testingData.serverOptions, app);
      instance.listen(config.port, function (err, result) {
        if (err) {
          done(err);
        } else {
          db.City.addCity(testingData.city.nameRus, testingData.city.nameUk)
            .then(function (data) {
              if (data) {
                testingData.city.id = data;
              }
              done();
            })
            .catch(function (err) {
              console.error(err);
              done();
            })
        }
      });
    });

    describe('Get all cities', function() {
      it('expect to return all cities', function (done) {
        db.City.getCities()
          .then(function(data) {
            expect(data[0]).has.to.include.keys("id", "nameRus", "nameUk");
            done();
          })
          .catch(function(err) {
            console.error(err);
            instance.close();
            done();
          });
      });
    });

    after(function (done) {
      if (testingData.city.id) {
        db.City.destroy({id: testingData.city.id})
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
    });
  });
};
