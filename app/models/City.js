var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var City = sequelize.define('City',
    {
      nameRus: DataTypes.STRING,
      nameUk: DataTypes.STRING
    },
    {
      tableName: 'cities',
      timestamps: false
    }
  );
  City.addCity = function(nameRus, nameUk) {
    return new Promise(function(resolve, reject){
      sequelize.query('INSERT INTO cities("nameRus", "nameUk") \
                             VALUES (?,?) RETURNING id', null, {raw: true, type:'SELECT'},
        [nameRus, nameUk])
        .success(function(data) {
          resolve(data[0].id);
        })
        .error(function(err) {
          reject(err)
        });
    });
  };
  City.getCities = function(search, lang){
    return new Promise(function(resolve, reject){
      if (search != 'undefined' && lang != 'undefined') {
        search = search.toLowerCase();
        sequelize.query('SELECT "id", "nameRus", "nameUk" FROM cities WHERE LOWER ("'+lang+'") LIKE \'%'+search+'%\' ORDER BY "nameUk"')
          .success(function (data) {
            resolve(data);
          })
          .error(function (err) {
            reject(err);
          });
      } else {
        sequelize.query('SELECT "id", "nameRus", "nameUk" FROM cities ORDER BY "nameUk"')
          .success(function (data) {
            resolve(data);
          })
          .error(function (err) {
            reject(err);
          });
      }
    });
  };
  return City;
};

