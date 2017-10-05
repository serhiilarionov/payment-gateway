"use strict";

var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var CounterPaymentDocument = sequelize.define('CounterPaymentDocument',
    {
      id: DataTypes.INTEGER,
      date: DataTypes.DATE,
      idHouse: DataTypes.STRING,
      counterId: DataTypes.INTEGER,
      companyId: DataTypes.INTEGER,
      serviceId: DataTypes.INTEGER,
      position: DataTypes.STRING,
      meterReading: DataTypes.DECIMAL
    },
    {
      tableName: 'counter_payment_document',
      timestamps: false
    }
  );

  CounterPaymentDocument.addCounterPaymentDocument = function(date, idHouse, counterId, companyId, serviceId, position, meterReading) {
    return new Promise(function(resolve, reject){
      sequelize.query('INSERT INTO counter_payment_document(date, "idHouse", "counterId", \
                            "companyId", "serviceId", position, "meterReading") \
                             VALUES (?,?,?,?,?,?,?) RETURNING id', null, {raw: true, type:'SELECT'},
        [date, idHouse, counterId, companyId, serviceId, position, meterReading])
        .success(function(data) {
          resolve(data[0].id);
        })
        .error(function(err) {
          reject(err)
        });
    });
  };
  return CounterPaymentDocument;
};

