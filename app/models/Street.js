var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var Street = sequelize.define('Street',
    {
      nameRus: DataTypes.STRING,
      nameUk: DataTypes.STRING,
      cityId: DataTypes.INTEGER
    },
    {
      tableName: 'streets',
      timestamps: false
    }
  );
  Street.addStreet = function(nameRus, nameUk, cityId) {
    return new Promise(function (resolve, reject) {
      if(!isNaN(+cityId)) {
        sequelize.query('INSERT INTO streets("nameRus", "nameUk", "cityId") \
                           VALUES (?,?,?) RETURNING id', null, {raw: true, type:'SELECT'},
          [nameRus, nameUk, cityId])
          .success(function(data) {
            resolve(data[0].id);
          })
          .error(function(err) {
            reject(err)
          });
      } else {
        resolve({error: 'Не коректно задано місто.'});
      }
    });
  };
  Street.getStreets = function(cityId, search, lang) {
    return new Promise(function (resolve, reject) {
      if(!isNaN(+cityId)) {
        if (search != 'undefined' && lang != 'undefined'){
          search = search.toLowerCase();
          sequelize.query('SELECT streets."id", streets."nameRus", streets."nameUk", LOWER(street_types."nameRus") AS "streetTypesRus", ' +
          'LOWER(street_types."nameUk") AS "streetTypesUk" FROM streets ' +
          'LEFT JOIN street_types on streets."streetType" = street_types.id ' +
          'WHERE "cityId" = ' + cityId + ' AND CONCAT(LOWER(street_types."'+lang+'"), LOWER(streets."'+lang+'")) LIKE (\'%' + search+'%\')')
            .success(function (data) {
              resolve(data);
            })
            .error(function (err) {
              reject(err);
            });
        } else {
          sequelize.query('SELECT streets."id", streets."nameRus", streets."nameUk", LOWER(street_types."nameRus") AS "streetTypesRus", ' +
          'LOWER(street_types."nameUk") AS "streetTypesUk" FROM streets ' +
          'LEFT JOIN street_types on streets."streetType" = street_types.id ' +
          'WHERE "cityId" = ' + cityId)
            .success(function (data) {
              resolve(data);
            })
            .error(function (err) {
              reject(err);
            });
        }
      } else {
        resolve({error: 'Не коректно задано місто.'});
      }
    });
  };
  return Street;
};

