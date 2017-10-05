"use strict";

var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var PersonalAccount = sequelize.define('PersonalAccount',
    {
      id: DataTypes.INTEGER,
      number: DataTypes.STRING,
      idHouse: DataTypes.STRING,
      companyId: DataTypes.INTEGER,
      debt: DataTypes.DECIMAL,
      accrual: DataTypes.DECIMAL,
      forPayment: DataTypes.DECIMAL,
      paid: DataTypes.DECIMAL,
      dateOfAccrued: DataTypes.DATE,
      serviceId: DataTypes.INTEGER
    },
    {
      tableName: 'personal_accounts',
      timestamps: false
    }
  );

  PersonalAccount.getAccrualsByPeriod = function(idHouse, year, month, companyId, serviceId) {
    return new Promise(function(resolve, reject){
      var query = 'SELECT  pa."id", \
                               "transcript", \
                               "number", \
                               pa."companyId", \
                               "companyName", \
                               pa."serviceId", \
                               "serviceName", \
                               "debt", \
                               "accrual", \
                               "forPayment", \
                               "paid", \
                               "dateOfAccrued", \
                               "lastName", \
                               "firstName", \
                               "patronymic" \
                              FROM personal_accounts pa\
                              join companies on pa."companyId" = companies.id \
                              join services on pa."serviceId" = services.id \
                              WHERE "idHouse" = \'' + idHouse + '\' \
                              AND EXTRACT(YEAR FROM DATE ("dateOfAccrued")) = ' + year;
      if(month) {
        query += ' AND EXTRACT(MONTH FROM DATE ("dateOfAccrued")) = ' + month;
      }
      if(companyId) {
        query += ' AND pa."companyId" = \'' + companyId + '\'';
      }
      if(serviceId) {
        query += ' AND pa."serviceId" = ' + serviceId;
      }
      sequelize.query(query)
        .success(function(data) {
          resolve(data);
        })
        .error(function(err) {
          reject(err);
        });
    });
  };

  PersonalAccount.getMinYearByIdHouse = function(idHouse){
    return new Promise(function(resolve, reject){
      sequelize.query('SELECT MIN(EXTRACT(YEAR FROM DATE ("dateOfAccrued"))) AS date \
                        FROM personal_accounts \
                        WHERE "idHouse" = \'' + idHouse + '\'')
        .success(function(data) {
          resolve(data[0].date);
        })
        .error(function(err) {
          reject(err);
        });
    });
  };

  PersonalAccount.deleteMonthAccruals = function(companyId, year, month){
    return new Promise(function(resolve, reject){
      sequelize.query('DELETE FROM personal_accounts \
                       WHERE "companyId" = ? AND ((SELECT "closingDate" FROM companies WHERE id = ?) ISNULL OR \
                                                  EXTRACT(YEAR FROM DATE ("dateOfAccrued")) = ? AND \
                                                  EXTRACT(MONTH FROM DATE ("dateOfAccrued")) = ?)'
        ,null,{raw: true},
        [companyId, companyId, year, month])
        .success(function(data) {
          resolve(true);
        })
        .error(function(err) {
          reject(err);
        });
    });
  };
  PersonalAccount.addAccrual = function(accrual, systemServiceId, systemCompanyId, accrualDate){
    return new Promise(function(resolve, reject){
      sequelize.query('INSERT INTO personal_accounts(number, "idHouse", \
                                              "companyId", debt, \
                                                accrual, "forPayment", \
                                                paid, "dateOfAccrued", \
                                                "serviceId", "lastName", \
                                                "firstName", patronymic, transcript) \
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id'
        ,null,{raw: true, type:'SELECT'},
        [accrual.number, accrual.idHouse, systemCompanyId, accrual.debt, accrual.accrual, accrual.forPayment,
          accrual.paid, accrualDate, systemServiceId, accrual.lastName, accrual.firstName, accrual.patronymic,
          accrual.transcript])
        .success(function(data) {
          resolve(data[0].id);
        })
        .error(function(err) {
          reject(err);
        });
    });
  };

  return PersonalAccount;
};