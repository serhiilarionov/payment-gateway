var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var Service = sequelize.define('Service',
    {
      id: DataTypes.INTEGER,
      serviceId: DataTypes.STRING,
      serviceName: DataTypes.STRING,
      companyId: DataTypes.INTEGER
    },
    {
      tableName: 'services',
      timestamps: false
    }
  );
  Service.addService = function(companyId, serviceName, serviceId) {
    return new Promise(function(resolve, reject){
      sequelize.query('INSERT INTO services("companyId", "serviceName", "serviceId") \
                             VALUES (?,?,?) RETURNING id', null, {raw: true, type:'SELECT'},
        [companyId, serviceName, serviceId])
        .success(function(data) {
          resolve(data[0].id);
        })
        .error(function(err) {
          reject(err)
        });
    });
  };

  Service.addOrSelectService = function(companyId, serviceName, serviceId){
    return new Promise(function(resolve, reject){
      sequelize.query('SELECT id \
                        FROM services \
                        WHERE "serviceName" = ? \
                        AND "serviceId" = ?'
        ,null,{raw: true},
        [serviceName, serviceId])
        .success(function(data) {
          if(data.length) {
            resolve(data[0].id);
          } else {
            sequelize.query('INSERT INTO services("serviceName", "serviceId", "companyId") \
                              VALUES (?, ?, ?) RETURNING id'
              ,null,{raw: true},
              [serviceName, serviceId, companyId])
              .success(function(data) {
                resolve(data[0].id);
              })
              .error(function(err) {
                reject(err);
              });
          }
        })
        .error(function(err) {
          reject(err);
        });
    });
  };
  return Service;
};