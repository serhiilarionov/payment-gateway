var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var PinCode = sequelize.define('PinCode',
    {
      idHouse: DataTypes.STRING,
      pinCode: DataTypes.INTEGER
    },
    {
      tableName: 'pin_codes',
      timestamps: false
    }
  );

  PinCode.getPinCode = function(idHouse, pinCode){
    return new Promise(function(resolve, reject){
      sequelize.query('SELECT id FROM pin_codes WHERE "isDeleted" = FALSE AND "idHouse" = \'' + idHouse + '\' AND "pinCode" = ' + pinCode)
        .success(function (data) {
          if(data.length) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .error(function (err) {
          resolve(err);
        });
    });
  };

  PinCode.getRenter = function(idHouse){
    return new Promise(function(resolve, reject){
      sequelize.query('SELECT DISTINCT "idHouse" \
                       FROM pin_codes \
                       WHERE "idHouse" LIKE \'' + idHouse + '%\'')
        .success(function (data) {
          resolve(data);
        })
        .error(function (err) {
          resolve(err);
        });
    });
  };
  PinCode.addPinCode = function(idHouse, pinCode, whenIssuedPassport, issuedPassport, passportNumber, firstName, lastName, patronymic){
    return new Promise(function(resolve, reject){
      sequelize.query('WITH updated_pin AS ( \
      UPDATE pin_codes SET "isDeleted" = TRUE WHERE "idHouse" =  ?) \
      INSERT INTO pin_codes("idHouse", "pinCode", "whenIssuedPassport", "issuedPassport", "passportNumber", "firstName", "lastName", patronymic, "isDeleted") \
      VALUES (?, ?, ?::DATE, ?, ?, ?, ?, ?, false)'
        ,null,{raw: true},
        [idHouse, idHouse, pinCode, whenIssuedPassport, issuedPassport, passportNumber, firstName,lastName, patronymic])
        .success(function (data) {
          sequelize.query('SELECT count(id), (SELECT id FROM pin_codes WHERE "idHouse" = ? AND  "isDeleted" = FALSE LIMIT 1) as id \
                           FROM pin_codes \
                           WHERE "idHouse" = ?'
            ,null,{raw: true},[idHouse, idHouse])
            .success(function (data) {
              resolve(data[0]);
            })
            .error(function (err) {
              resolve(err);
            });
        })
        .error(function (err) {
          resolve(err);
        });
    });
  };
  return PinCode;
};

