"use strict";

var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var PaymentDocument = sequelize.define('PaymentDocument',
    {
      id: DataTypes.INTEGER,
      date: DataTypes.DATE,
      sum: DataTypes.DECIMAL,
      payer: DataTypes.STRING,
      idHouse: DataTypes.STRING,
      hash: DataTypes.STRING
    },
    {
      tableName: 'payment_document',
      timestamps: false
    }
  );
  PaymentDocument.addPaymentDocument = function(date, sum, payer, idHouse, hash) {
    return new Promise(function(resolve, reject){
      sequelize.query('INSERT INTO payment_document(date, sum, payer, \
                            "idHouse", hash) \
                             VALUES (?,?,?,?,?) RETURNING id', null, {raw: true, type:'SELECT'},
        [date, sum, payer, idHouse, hash])
        .success(function(data) {
          resolve(data[0].id);
        })
        .error(function(err) {
          reject(err)
        });
    });
  };

  return PaymentDocument;
};

