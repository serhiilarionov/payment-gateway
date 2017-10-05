var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var Company = sequelize.define('Company',
    {
      id: DataTypes.INTEGER,
      cityId: DataTypes.INTEGER,
      companyName: DataTypes.STRING,
      companyId: DataTypes.INTEGER
    },
    {
      tableName: 'companies',
      timestamps: false
    }
  );
  Company.addCompany = function(cityId, companyName, companyId) {
    return new Promise(function(resolve, reject){
      sequelize.query('INSERT INTO companies("cityId", "companyName", "companyId") \
                             VALUES (?,?, ?) RETURNING id', null, {raw: true, type:'SELECT'},
        [cityId, companyName, companyId])
        .success(function(data) {
          resolve(data[0].id);
        })
        .error(function(err) {
          reject(err)
        });
    });
  };
  Company.getCompanyId = function(companyName, companyId){
    return new Promise(function(resolve, reject){
      sequelize.query('SELECT id \
                        FROM companies \
                        WHERE "companyName" = ? \
                              AND "companyId" = ? LIMIT 1',
        null, {raw: true}, [companyName, companyId])
        .success(function (data) {
          resolve(data[0].id);
        })
        .error(function (err) {
          reject(err);
        });
    });
  };

  Company.getCompanies = function (cityId) {
    return new Promise(function (resolve, reject) {
      sequelize.query('SELECT "id", "companyName" FROM companies WHERE "cityId"=?', null, {raw: true}, [cityId])
        .success(function (data) {
          resolve(data);
        })
        .error(function (data) {
          reject(data);
        });
    });
  };

  Company.setClosingDate = function (closingDate, id) {
    return new Promise(function (resolve, reject) {
      sequelize.query('UPDATE companies SET "closingDate" = \'' + closingDate + '\'::DATE WHERE id = ?', null, {raw: true}, [id])
        .success(function () {
          resolve(true);
        })
        .error(function (data) {
          reject(data);
        });
    });
  };

  Company.checkClosingDate = function (year, month, id) {
    return new Promise(function (resolve, reject) {
      sequelize.query('SELECT id \
                      FROM companies \
                      WHERE id = ? AND ("closingDate" ISNULL OR \
                                       (EXTRACT(YEAR FROM DATE ("closingDate")) < ? \
                                       OR (EXTRACT(YEAR FROM DATE ("closingDate")) = ? \
                                           AND EXTRACT(MONTH FROM DATE ("closingDate")) < ?)))',
        null, {raw: true}, [id, year, year, month])
        .success(function (data) {
          if (data.length) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .error(function (data) {
          reject(data);
        });
    });
  };
  return Company;
};