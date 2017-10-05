var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var Payment = sequelize.define('Payment',
    {
      id: DataTypes.INTEGER,
      personalAccount: DataTypes.INTEGER,
      idHouse: DataTypes.STRING,
      transactionId: DataTypes.STRING,
      recipientBankAccount: DataTypes.STRING,
      senderBankAccount: DataTypes.STRING,
      companyId: DataTypes.INTEGER,
      mfoSender: DataTypes.INTEGER,
      mfoRecipient: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL,
      paymentDate: DataTypes.DATE,
      dateOfEnrollment: DataTypes.DATE,
      serviceId: DataTypes.INTEGER
    },
    {
      tableName: 'payments',
      timestamps: false
    }
  );

  Payment.addPayment = function(payment, serviceId, companyId, paymentDate){
    return new Promise(function(resolve, reject){
      sequelize.query('INSERT INTO payments("idHouse", "personalAccount", "serviceId", "mfoSender", "mfoRecipient", \
                                   "recipientBankAccount", "senderBankAccount", amount, "companyId", "paymentDate", "dateOfEnrollment", "transactionId") \
                             VALUES (?,?,?,?,?,?,?,?,?,?::DATE, ?::DATE, ?)'
        ,null,{raw: true},
        [payment.idHouse, payment.personalAccount, serviceId, payment.mfoSender,
          payment.mfoRecipient, payment.recipientBankAccount, payment.senderBankAccount,
          payment.amount, companyId, paymentDate, payment.dateOfEnrollment, payment.transactionId])
        .success(function(data) {
          resolve(true);
        })
        .error(function(err) {
          reject(err);
        });
    });
  };

  Payment.getMinYearByIdHouse = function(idHouse){
    return new Promise(function(resolve, reject){
      sequelize.query('SELECT MIN(EXTRACT(YEAR FROM DATE ("paymentDate"))) AS date \
                        FROM payments \
                        WHERE "idHouse" = \'' + idHouse + '\'')
        .success(function(data) {
          resolve(data[0].date);
        })
        .error(function(err) {
          reject(err);
        });
    });
  };

  Payment.getPaymentsByPeriod = function(idHouse, year, month, companyId){
    return new Promise(function(resolve, reject){
      var query = 'SELECT "personalAccount", "serviceName", banks.name AS "bankName", \
                               "dateOfEnrollment", amount, "companyName", "paymentDate", "paymentDate" \
                       FROM payments JOIN services ON payments."serviceId" = services.id \
                                     JOIN banks ON payments."mfoSender" = banks.mfo \
                                     JOIN companies ON payments."companyId" = companies.id \
                       WHERE "idHouse" = ? \
                              AND EXTRACT(YEAR FROM DATE ("paymentDate")) = ? \
                              AND EXTRACT(MONTH FROM DATE ("paymentDate")) = ? \
                              ';

      if (companyId) {
        query += ' AND "companyId" = ' + companyId;
      }

      sequelize.query( query , null, {raw: true}, [idHouse, year, month])
        .success(function(data) {
          resolve(data);
        })
        .error(function(err) {
          reject(err);
        });
    });
  };
  Payment.deleteMonthPayments = function(companyId, year, month){
    return new Promise(function(resolve, reject){
      sequelize.query('DELETE FROM payments \
                       WHERE "companyId" = ? AND \
                              EXTRACT(YEAR FROM DATE ("paymentDate")) = ? AND \
                              EXTRACT(MONTH FROM DATE ("paymentDate")) = ?'
        ,null,{raw: true},
        [companyId, year, month])
        .success(function(data) {
          resolve(true);
        })
        .error(function(err) {
          reject(err);
        });
    });
  };
  return Payment;
};