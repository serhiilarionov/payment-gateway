var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var Bank = sequelize.define('Bank',
    {
      id: DataTypes.INTEGER,
      mfo: DataTypes.INTEGER,
      name: DataTypes.STRING
    },
    {
      tableName: 'banks',
      timestamps: false
    }
  );

  Bank.addOrSelectBank = function(mfo, name) {
    return new Promise(function (resolve, reject) {
      if (!mfo) {
        return resolve(false);
      }
      sequelize.query('SELECT name \
                        FROM banks \
                        WHERE "mfo" = ?'
        , null, {raw: true},
        [mfo])
        .success(function (data) {
          if (data.length) {
            resolve(true);
          } else {
            sequelize.query('INSERT INTO banks(mfo, name) \
                              VALUES (?, ?)'
              , null, {raw: true},
              [mfo, name])
              .success(function () {
                resolve(true);
              })
              .error(function (err) {
                reject(err);
              });
          }
        })
        .error(function (err) {
          reject(err);
        });
    });
  };

  return Bank;
};