"use strict";

var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {
  var Counter = sequelize.define('Counter',
    {
      id: DataTypes.INTEGER,
      personalAccountId: DataTypes.INTEGER,
      idHouse: DataTypes.STRING,
      serviceId: DataTypes.INTEGER,
      companyId: DataTypes.INTEGER,
      position: DataTypes.STRING,
      meterReading: DataTypes.DECIMAL,
      date: DataTypes.DATE
    },
    {
      tableName: 'counters',
      timestamps: false
    }
  );

  Counter.addCounter = function(personalAccountId, idHouse, companyId, serviceId, position, meterReading, date) {
    return new Promise(function(resolve, reject){
      sequelize.query('INSERT INTO counters("personalAccountId", "idHouse", \
                            "companyId", "serviceId", position, "meterReading", date) \
                             VALUES (?,?,?,?,?,?,?) RETURNING id', null, {raw: true, type:'SELECT'},
        [personalAccountId, idHouse, companyId, serviceId, position, meterReading, date])
        .success(function(data) {
          resolve(data[0].id);
        })
        .error(function(err) {
          reject(err)
        });
    });
  };

  Counter.deleteMonthCounters = function(companyId, year, month){
    return new Promise(function(resolve, reject){
      sequelize.query('DELETE FROM counters \
                       WHERE "companyId" = ? AND ((SELECT "closingDate" FROM companies WHERE id = ?) ISNULL OR \
                                                  EXTRACT(YEAR FROM DATE ("date")) = ? AND \
                                                  EXTRACT(MONTH FROM DATE ("date")) = ?)'
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

  Counter.getCounters = function(personalAccountId, companyId, serviceId, month, year) {
    return new Promise(function(resolve, reject) {
      sequelize.query('SELECT "id", "personalAccountId", "idHouse", "serviceId", "companyId", "position", "meterReading", "date" \
      FROM counters \
      WHERE "personalAccountId"=? AND "companyId"=? AND "serviceId"=? \
          AND EXTRACT(MONTH FROM DATE ("date")) = ? \
          AND EXTRACT(YEAR FROM DATE ("date")) = ?', null, {raw: true},
        [personalAccountId, companyId, serviceId, month, year])
        .success(function(data) {
          resolve(data);
        })
        .error(function(err) {
          reject(err);
        });
    });
  };

  return Counter;
};



