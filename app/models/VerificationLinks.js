var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var VerificationLinks = sequelize.define('VerificationLinks',
    {
      login: DataTypes.STRING,
      link: DataTypes.STRING,
      exprieson: DataTypes.DATE,
      password: DataTypes.STRING
    },
    {
      tableName: 'verificationLinks',
      timestamps: false
    }
  );

  return VerificationLinks;
};

