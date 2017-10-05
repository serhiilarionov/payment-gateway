var Promise = require('bluebird'),
    moment = require('moment');

var SYSTEM_INFO = require('../../info/options.js');

module.exports = function (sequelize, DataTypes) {

  var TransactionLog = sequelize.define('TransactionLog',
    {
      paymentDocumentId: DataTypes.INTEGER,
      date: DataTypes.DATE,
      accrual: DataTypes.DECIMAL,
      hash: DataTypes.STRING,
      receiptOfThePaymentSystem: DataTypes.STRING,
      senderName: DataTypes.STRING,
      senderEdrpoy: DataTypes.INTEGER,
      senderMfo: DataTypes.INTEGER,
      senderBankAccount: DataTypes.STRING,
      recipientName: DataTypes.STRING,
      recipientEdrpoy: DataTypes.INTEGER,
      recipientMfo: DataTypes.INTEGER,
      recipientBankAccount: DataTypes.STRING,
      status: DataTypes.INTEGER
    },
    {
      tableName: 'transaction_log',
      timestamps: false,
      classMethods: {
        getUserPaymentsByPeriod: function(idHouse, year, month) {
          return new Promise(function(resolve, reject){
            sequelize.query('SELECT transaction_log.status, payments_payment_document.sum as amount, payments_payment_document.date as date, services."serviceName", \
                                    companies."companyName", payments_payment_document."startDate", payments_payment_document."endDate" \
                            FROM transaction_log \
                                  LEFT JOIN payment_document ON transaction_log."paymentDocumentId" = payment_document.id \
                                  LEFT JOIN payments_payment_document ON payment_document.id = payments_payment_document."paymentDocumentId" \
                                  LEFT JOIN companies ON payments_payment_document."companyId" = companies.id \
                                  LEFT JOIN services ON payments_payment_document."serviceId" = services.id \
                            WHERE EXTRACT(YEAR FROM DATE (transaction_log.date)) =' + year +
                                  ' AND EXTRACT(MONTH FROM DATE (transaction_log.date)) = ' + month +
                                  ' AND payment_document."idHouse" = \'' + idHouse + '\'', null, {raw: true, type:'SELECT'})
              .success(function(data) {
                resolve(data);
              })
              .error(function(err) {
                reject(err)
              });
          });
        }
      }
    }
  );

  TransactionLog.addRecord = function(paymentDocumentId, accrual, hash, receiptOfThePaymentSystem,
                senderName, senderEdrpoy, senderMfo, senderBankAccount,
                recipientName, recipientEdrpoy, recipientMfo, recipientBankAccount, status, paymentSystemId) {
    return new Promise(function(resolve, reject){
      sequelize.query('INSERT INTO transaction_log("paymentDocumentId", accrual, hash, "receiptOfThePaymentSystem", \
              "senderName", "senderEdrpoy", "senderMfo", "senderBankAccount",\
              "recipientName", "recipientEdrpoy", "recipientMfo", "recipientBankAccount", status) \
                      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id', null, {raw: true, type:'SELECT'},
        [paymentDocumentId, accrual, hash, receiptOfThePaymentSystem,
          senderName, senderEdrpoy, senderMfo, senderBankAccount,
          recipientName, recipientEdrpoy, recipientMfo, recipientBankAccount, status])
        .success(function(data) {
          resolve(data[0].id);
        })
        .error(function(err) {
          reject(err)
        });
    });
  };

  TransactionLog.updateStatusById = function(id, status, receiptOfThePaymentSystem) {
    return new Promise(function(resolve, reject) {
      sequelize.query('UPDATE transaction_log SET "status" = ?, "receiptOfThePaymentSystem" = ? ' +
      ' WHERE id = ?;', null, {raw: true}, [status, receiptOfThePaymentSystem, id])
        .success(function() {
          resolve(true);
        })
        .error(function(err) {
          reject(err)
        });
    });
  };

  TransactionLog.getTransactions = function(date) {
    date = moment(date).format('YYYY-MM-DD');
    return sequelize.query('SELECT transaction_log.id, "paymentDocumentId", transaction_log.date, transaction_log.accrual, \
                                transaction_log.hash, transaction_log."receiptOfThePaymentSystem", "senderName", "senderMfo", \
                                "senderEdrpoy", "senderBankAccount", "recipientBankAccount", "recipientName", "recipientEdrpoy", "recipientMfo", \
                                status , payment_systems."name" as "paymentSystemName" \
                              FROM transaction_log LEFT JOIN payment_systems ON transaction_log."paymentSystemId" = payment_systems.id \
                              WHERE DATE("date") = ?', null, {raw: true, type:'SELECT'}, [date])
  };

  TransactionLog.getProgressingTransactions = function() {
    return sequelize.query('SELECT transaction_log.id, payment_systems.name, accrual, date \
                            FROM transaction_log LEFT JOIN payment_systems ON transaction_log."paymentSystemId" = payment_systems.id \
                            WHERE status = 0 AND transaction_log."paymentSystemId" IS NOT NULL')
  };

  TransactionLog.updatePaymentSystemId = function(id, paymentSystemId) {
    return sequelize.query('UPDATE transaction_log SET "paymentSystemId" = ? WHERE id = ? ;', null, {raw: true}, [paymentSystemId, id])
  };



  return TransactionLog;
};
