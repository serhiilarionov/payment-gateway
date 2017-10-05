"use strict";

var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var PaymentsPaymentDocument = sequelize.define('PaymentsPaymentDocument',
    {
      id: DataTypes.INTEGER,
      idHouse: DataTypes.STRING,
      personalAccountId: DataTypes.INTEGER,
      companyId: DataTypes.INTEGER,
      serviceId: DataTypes.INTEGER,
      date: DataTypes.DATE,
      sum: DataTypes.DECIMAL
    },
    {
      tableName: 'payments_payment_document',
      timestamps: false
    }
  );

  PaymentsPaymentDocument.addPaymentsPaymentDocument = function(idHouse, personalAccountId, companyId, serviceId, date, sum, paymentDocumentId, startDate, endDate) {
    return new Promise(function(resolve, reject){
      sequelize.query('INSERT INTO payments_payment_document("idHouse", "personalAccountId", "companyId", \
                            "serviceId", date, sum, "paymentDocumentId", "startDate", "endDate") \
                             VALUES (?,?,?,?,?,?,?,?,?) RETURNING id', null, {raw: true, type:'SELECT'},
        [idHouse, personalAccountId, companyId, serviceId, date, sum, paymentDocumentId, startDate, endDate])
        .success(function(data) {
          resolve(data[0].id);
        })
        .error(function(err) {
          reject(err)
        });
    });
  };
  return PaymentsPaymentDocument;
};

