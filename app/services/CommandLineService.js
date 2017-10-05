var Promise = require('bluebird');
var fs = require('fs');
var Cli = {};

Cli.generateCertificate = function (userLogin, userCity, userCompany, userFio, userEmail, days) {
  return new Promise(function (resolve, reject) {
    var exec = require('child_process').exec;
    var command = 'openssl req -new -newkey rsa:1024 -nodes -keyout app/certificates/userCertificates/' + userLogin + '.key -days '+days+' -subj /C=UA/L=' + userCity + '/O=' + userCompany + '/CN=' + userLogin + '/emailAddress=' + userEmail + ' -out app/certificates/userCertificates/' + userLogin + '.csr';
    exec(command, function (error, stdout, stderr) {
      if (error == null) {
        resolve("Certificate request was generated successfully");
      } else {
        reject(error);
      }
    })
  })
};

Cli.signCertificate = function (userLogin,days) {
  return new Promise(function (resolve, reject) {
    var exec = require('child_process').exec;
    var command = 'openssl ca -days '+days+' -config app/certificates/configs/ca.config -in app/certificates/userCertificates/' + userLogin + '.csr -out app/certificates/userCertificates/' + userLogin + '.crt -batch';
    exec(command, function (error, stdout, stderr) {
      if (error == null) {
        resolve("Certificate was signed successfully");
      } else {
        reject(error);
      }
    })
  })
};

Cli.createPkcsFromCertificate = function (userLogin, userPassword) {
  return new Promise(function (resolve, reject) {
    var exec = require('child_process').exec;
    var command = 'openssl pkcs12 -export -in app/certificates/userCertificates/' + userLogin + '.crt -inkey app/certificates/userCertificates/' + userLogin + '.key -certfile app/certificates/CA/ca.crt -out app/certificates/userCertificates/' + userLogin + '.p12 -passout pass:' + userPassword;
    exec(command, function (error, stdout, stderr) {
      if (error == null) {
        resolve("PKCS#12 file was created successfully");
      } else {
        reject(error);
      }
    })
  })
};

Cli.revokeCertificate = function (login) {
  return new Promise(function (resolve, reject) {
    var exec = require('child_process').exec;
    var command = 'openssl ca -config app/certificates/configs/ca.config -revoke app/certificates/userCertificates/' + login + '.crt';
    fs.exists('app/certificates/userCertificates/' + login + '.crt', function(isExists) {
      if(isExists) {
        exec(command, function (error, stdout, stderr) {
          if (error == null) {
            resolve("Certificate " + login + ".crt has been revoked");
          } else {
            reject(error);
          }
        });
      } else {
        reject(new Error('No certificate file found'));
      }
    });
  })
};

Cli.updateCrtRevocationList = function () {
  return new Promise(function (resolve, reject) {
    var exec = require('child_process').exec;
    var command = 'openssl ca -gencrl -config app/certificates/configs/ca.config -out app/certificates/configs/ca.crl';
    exec(command, function (error, stdout, stderr) {
      if (error == null) {
        resolve("Revocation list has been updated");
      } else {
        reject(error);
      }
    })
  })
};

Cli.deleteRevokedCertificates = function (login) {
  return new Promise(function (resolve, reject) {
    var exec = require('child_process').exec;
    var command = 'rm app/certificates/userCertificates/' + login + '.*';
    exec(command, function (error, stdout, stderr) {
      if (error == null) {
        resolve("All revoked certificates have been deleted");
      } else {
        reject(error);
      }
    })
  })
};
module.exports.Cli = Cli;