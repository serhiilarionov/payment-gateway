"use strict";

var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var PaymentSystem = sequelize.define('PaymentSystem',
    {
      name: DataTypes.STRING,
      options: DataTypes.STRING
    },
    {
      tableName: 'payment_systems',
      timestamps: false
    }
  );

  PaymentSystem.setOrCreatePaymentSystemsOptions = function(id, name, options) {
    return new Promise(function(resolve, reject){
      options = JSON.stringify(options);
      if(id === undefined || id == null){
        PaymentSystem.create({name: name, options: options})
          .then(function (response) {
            resolve(response);
          })
          .catch(function(err) {
            reject(err)
          })
      } else {
        sequelize.query('UPDATE payment_systems SET "options" = \'' + options + '\' WHERE id = ' + id)
          .success(function() {
            resolve(true);
          })
          .error(function(err) {
            reject(err)
          });
      }
    });
  };

  PaymentSystem.getPaymentSystems = function() {
    return new Promise(function(resolve, reject){
      sequelize.query('SELECT "id", "name", "options" FROM payment_systems')
        .success(function(paymentSystems) {
          if(paymentSystems.length) {
            paymentSystems.forEach(function(paymentSystem) {
              paymentSystem.options = JSON.parse(paymentSystem.options);
            });
            resolve(paymentSystems);
          } else {
            resolve(null);
          }
        })
        .error(function(err) {
          reject(err)
        });
    });
  };
  PaymentSystem.getPaymentSystemByName = function(name) {
    return new Promise(function(resolve, reject){
      sequelize.query('SELECT "id", "name", "options" FROM payment_systems WHERE name = \'' + name + '\'' )
        .success(function(paymentSystem) {
          if(paymentSystem.length) {
            paymentSystem[0].options = JSON.parse(paymentSystem[0].options);
            resolve(paymentSystem[0]);
          } else {
            resolve(null);
          }
        })
        .error(function(err) {
          reject(err)
        });
    });
  };
  PaymentSystem.getPaymentSystemById = function(id) {
    return new Promise(function(resolve, reject){
      sequelize.query('SELECT "id", "name", "options" FROM payment_systems WHERE id = ' + id)
        .success(function(paymentSystem) {
          if(paymentSystem.length) {
            paymentSystem[0].options = JSON.parse(paymentSystem[0].options);
            resolve(paymentSystem[0]);
          } else {
            resolve(null);
          }
        })
        .error(function(err) {
          reject(err)
        });
    });
  };

  return PaymentSystem;
};

