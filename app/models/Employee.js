var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {
  var Employee = sequelize.define('Employee', {
      login: DataTypes.STRING,
      fio: DataTypes.STRING,
      password: DataTypes.STRING,
      cityId: DataTypes.INTEGER,
      companyId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER
    },
    {
      tableName: 'employees',
      timestamps: false
    });

  Employee.checkIfEmployeeExists = function (userLogin) {
    return new Promise(function (resolve, reject) {
      sequelize.query('SELECT id FROM employees WHERE "login"=?', null, {raw: true}, [userLogin])
        .success(function (data) {
          resolve(data);
        })
        .error(function (err) {
          reject(err);
        });
    })
  };

  Employee.addNewEmployee = function(userLogin, userFio, userEmail, userCity, userCompany, userRole, userCertTerm) {
    var randomLink = Math.random().toString(36).slice(-8);
    var randomPassword = Math.random().toString(36).slice(-8);
      return new Promise(function(resolve,reject) {
          sequelize.query('WITH emp AS (' +
                          'INSERT INTO employees("login", "fio", "email", "cityId", "companyId", "expirationDate", "isdisabled") ' +
                            'SELECT ?,?,?,?,?, CURRENT_DATE + integer \''+userCertTerm+'\', TRUE '+
                            'WHERE NOT EXISTS ' +
                            '(SELECT id FROM employees WHERE login = ? AND isdisabled = false) RETURNING login) ' +
                          'INSERT INTO "verificationLinks" ("login", "link", "expireson", "password") ' +
                            'SELECT emp.login, ?, CURRENT_DATE + integer \'2\',? ' +
                            'FROM emp ' +
                            'RETURNING *;',null,{raw: true, type: 'SELECT'},
                          [userLogin, userFio, userEmail, userCity, userCompany, userLogin, randomLink, randomPassword])
              .then(function(data) {
                  acl.addUserRoles(userLogin, userRole);
                  resolve(data);
      })
      .catch(function (err) {
        reject(err);
      });
    })
  };

  Employee.checkCertificateByTermOver = function (userLogin, userEmail) {
    return new Promise(function (resolve, reject) {
      sequelize.query(
        'SELECT "email", "login",  "fio", "expirationDate" FROM employees WHERE "expirationDate" ' +
        '< NOW() and employees.isdisabled = FALSE;'
        , null, {raw: true}, [userLogin, userEmail])
        .success(function (data) {
          sequelize.query('UPDATE employees SET isdisabled = true WHERE "expirationDate" < NOW() ' +
            'and employees.isdisabled = FALSE RETURNING  "expirationDate", email, login, fio',
            null, {raw: true, type:'SELECT'}, [userLogin, userEmail])
            .success(function(data) {
              resolve(data);
            })
            .error(function (err) {
              reject(err);
            });
        })
        .error(function (err) {
          reject(err);
        });
    })
  };

  Employee.rollbackAddingNewEmployee = function(userLogin, userRole) {
    return new Promise(function(resolve,reject) {
      sequelize.query('WITH del_first AS (' +
                      'DELETE FROM employees ' +
                      'WHERE login=?)' +
                      'DELETE FROM "verificationLinks" ' +
                      'WHERE login=?;',null,{raw: true}, [userLogin, userLogin])
        .success(function(data) {
          acl.removeUserRoles(userLogin,userRole);
          resolve(data);
        })
        .error(function (err) {
          reject(err);
        });
    })
  };

  Employee.generateLinkForRenewal = function(userLogin, userNewCertTerm) {
    var randomLink = Math.random().toString(36).slice(-8);
    var randomPassword = Math.random().toString(36).slice(-8);
    return new Promise(function(resolve,reject) {
      sequelize.query('UPDATE employees SET "expirationDate" = CURRENT_DATE + integer \'?\' WHERE login=?;',
                      null, {raw: true}, [userNewCertTerm, userLogin])
        .success(function(data) {
          sequelize.query('INSERT INTO "verificationLinks" ("login", "link", "expireson", "password") ' +
                          'VALUES (?, ?, CURRENT_DATE + integer \'2\', ?) RETURNING *;',
                          null, {raw: true, type:'SELECT'}, [userLogin, randomLink, randomPassword])
            .success(function(data) {
              resolve(data[0] || null);
            })
            .error(function (err) {
              reject(err);
            });
        })
        .error(function (err) {
          reject(err);
        });
    })
  };

  Employee.verifyEmployeeByLink = function(link) {
    return new Promise(function(resolve,reject) {
      sequelize.query('SELECT "verificationLinks"."login" FROM "verificationLinks" ' +
      'LEFT JOIN "employees" ON "verificationLinks"."login" = "employees"."login" ' +
      'WHERE "verificationLinks"."link"=? ' +
      'AND "verificationLinks"."expireson" >= CURRENT_DATE ' +
      'AND "employees"."isdisabled" IS TRUE;',null,{raw: true}, [link])
        .success(function(data) {
          resolve(data);
        })
        .error(function (err) {
          reject(err);
        });
    })
  };

  Employee.confirmEmployeeRegistration = function(link,password) {
    return new Promise(function(resolve,reject) {
      sequelize.query('SELECT "companyName", "email", "fio", "login", "nameUk", "expirationDate" - CURRENT_DATE AS days FROM employees ' +
      'LEFT JOIN cities ON employees."cityId"=cities."id" ' +
      'LEFT JOIN companies ON employees."companyId"=companies."id" ' +
      'WHERE "isdisabled" = TRUE AND login = ' +
      '(SELECT login FROM "verificationLinks" WHERE link=? AND password=? AND expireson >= CURRENT_DATE);', null, {raw: true}, [link,password])
      .success(function(data) {
          if (data.length > 0) {
            var userInfo = data[0];
            sequelize.query('UPDATE employees SET "isdisabled" = FALSE ' +
            'WHERE "isdisabled" = TRUE AND login = ' +
            '(SELECT login FROM "verificationLinks" WHERE link=? AND password=? AND expireson >= CURRENT_DATE);', null, {raw: true}, [link,password])
              .success(function(data) {
                resolve(userInfo);
              })
              .error(function(err) {
                reject(err);
              })
          } else {
            resolve(false);
          }
        })
        .error(function (err) {
          reject(err);
        });
    })
  };

  Employee.getAllEmployees = function() {
    return new Promise(function(resolve,reject) {
      sequelize.query('SELECT emp."id", "login", "fio", isdisabled, cities."nameUk", companies."companyName" FROM employees emp ' +
                      'LEFT JOIN cities ON emp."cityId" = cities.id ' +
                      'LEFT JOIN companies ON emp."companyId" = companies.id;',null,{raw: true}, [])
        .success(function(data) {
          resolve(data);
        })
        .error(function(err) {
          reject(err);
        });
    })
  };

  Employee.getEmployeeById = function (employeeId) {
    return new Promise(function (resolve, reject) {
      sequelize.query('SELECT * FROM employees WHERE id=?;', null, {raw: true}, [employeeId])
        .success(function (data) {
          resolve(data[0] || null);
        })
        .error(function (err) {
          reject(err);
        });
    })
  };

  Employee.allowToCompany = function (login, companyId, companyName) {
    return new Promise(function (resolve, reject) {
      sequelize.query('SELECT employees.id \
                       FROM employees INNER JOIN companies ON employees."companyId" = companies.id \
                       WHERE login = ? \
                             AND companies."companyName" = ? \
                             AND companies."companyId" = ?',
        null, {raw: true}, [login, companyName, companyId])
        .success(function (data) {
          if(data.length) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .error(function (err) {
          reject(err);
        });
    })
  };

  Employee.disableTheEmployee = function(employeeId) {
      return new Promise(function(resolve,reject) {
          sequelize.query('UPDATE employees SET isdisabled=TRUE WHERE id=?;',null,{raw: true}, [employeeId])
            .success(function(data) {
                resolve(data);
            })
            .error(function(err) {
                reject(err);
            });
      })
  };

  Employee.getEmployeeDataByLogin = function(employeeLogin) {
    return new Promise(function(resolve,reject) {
      sequelize.query('SELECT emp."fio", emp."email", emp."companyId", cities."nameUk", companies."companyName" ' +
                      'FROM employees emp ' +
                      'LEFT JOIN cities ON emp."cityId"=cities.id ' +
                      'LEFT JOIN companies ON emp."companyId"=companies.id ' +
                      'WHERE emp."login"=? AND emp."isdisabled" IS false;',null,{raw: true}, [employeeLogin])
        .success(function(data) {
          resolve(data);
        })
        .error(function(err) {
          reject(err);
        });
    })
  };

  return Employee;
};