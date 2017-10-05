'use strict';

var testingData = require('./testingData')
  , db = require('../../../app/models')
  , Promise = require('bluebird');



module.exports = {
  addCompany: function addCompany() {
    return new Promise(function(resolve, reject) {
      db.City.addCity(testingData.city.nameRus, testingData.city.nameUk)
        .then(function (data) {
          if (data) {
            testingData.city.id = data;
            db.Company.addCompany(testingData.city.id, testingData.company.companyName, testingData.company.companyId)
              .then(function (data) {
                if (data) {
                  testingData.company.id = data;
                  resolve(testingData);
                }
                else
                  reject();
              })
              .catch(function (err) {
                console.log(err);
                reject(err);
              })
          }
          else
            reject();
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    })
  },
  addStreet: function addStreet() {
    return new Promise(function(resolve, reject) {
      db.City.addCity(testingData.city.nameRus, testingData.city.nameUk)
        .then(function (data) {
          if (data) {
            testingData.city.id = data;
            db.Street.addStreet(testingData.street.nameRus, testingData.street.nameUk, testingData.city.id)
              .then(function (data) {
                if (data) {
                  testingData.street.id = data;
                  resolve(testingData);
                }
                else
                  reject();
              })
              .catch(function (err) {
                console.log(err);
                reject(err);
              })
          }
          else
            reject();
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    })
  },
  addPaymentDocument: function addPaymentDocument() {
    return new Promise(function(resolve, reject) {
      db.PaymentDocument.addPaymentDocument(testingData.PdOpt.date, testingData.PdOpt.sum, testingData.PdOpt.payer.value,
        testingData.PdOpt.idHouse, testingData.PdOpt.hash)
        .then(function (id) {
          if (id) {
            testingData.PdOpt.id = id;
            resolve(testingData);
          } else {
            reject();
          }
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        })
    })
  },
  addPaymentsPaymentDocument: function addPaymentsPaymentDocument() {
    return new Promise(function(resolve, reject) {
       db.PaymentDocument.addPaymentDocument(testingData.PdOpt.date, testingData.PdOpt.sum, testingData.PdOpt.payer.value,
        testingData.PdOpt.idHouse, testingData.PdOpt.hash)
        .then(function (id) {
          if (id) {
            testingData.PdOpt.id = id;
            db.City.addCity(testingData.city.nameRus, testingData.city.nameUk)
              .then(function (data) {
                if (data) {
                  testingData.city.id = data;
                  db.Company.addCompany(testingData.city.id, testingData.company.companyName, testingData.company.companyId)
                    .then(function (data) {
                      if (data) {
                        testingData.company.id = data;
                        db.Service.addService(testingData.company.id, testingData.service.serviceName, testingData.service.serviceId)
                          .then(function (data) {
                            if (data) {
                              testingData.service.id = data;
                              db.PersonalAccount.addAccrual(testingData.accrualsOptions, testingData.company.id,
                                testingData.service.id, testingData.accrualsOptions.dateOfAccrued)
                                .then(function(accrualId) {
                                  db.PaymentsPaymentDocument.addPaymentsPaymentDocument(testingData.idHouse, accrualId, testingData.company.id,
                                    testingData.service.id, null, null, testingData.PdOpt.id, null, null)
                                    .then(function(paymentsPaymentDocumentId) {
                                      testingData.paymentsPaymentDocument.id = paymentsPaymentDocumentId;
                                      resolve(testingData);
                                    })
                                    .catch(function(err) {
                                      console.log(err);
                                      reject(err);
                                    });
                                })
                                .catch(function() {
                                  console.log(err);
                                  reject(err);
                                });
                            }
                            else
                              reject();
                          })
                          .catch(function (err) {
                            console.log(err);
                            reject(err);
                          })
                      }
                      else
                        reject();
                    })
                    .catch(function (err) {
                      console.log(err);
                      reject(err);
                    })
                }
                else
                  reject();
              })
              .catch(function (err) {
                console.log(err);
                reject(err);
              });
          } else {
            reject();
          }
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        })
    })
  },
  addService: function addService() {
    return new Promise(function (resolve, reject) {
      db.City.addCity(testingData.city.nameRus, testingData.city.nameUk)
        .then(function (data) {
          if (data) {
            testingData.city.id = data;
            db.Company.addCompany(testingData.city.id, testingData.company.companyName, testingData.company.companyId)
              .then(function (data) {
                if (data) {
                  testingData.company.id = data;
                  db.Service.addService(testingData.company.id, testingData.service.serviceName, testingData.service.serviceId)
                    .then(function (data) {
                      if (data) {
                        testingData.service.id = data;
                        resolve(testingData);
                      }
                      else
                        reject();
                    })
                    .catch(function (err) {
                      console.log(err);
                      reject(err);
                    })
                }
                else
                  reject();
              })
              .catch(function (err) {
                console.log(err);
                reject(err);
              })
          }
          else
            reject();
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    })
  },
  addCounter: function addCounter() {
    return new Promise(function(resolve, reject) {
      db.City.addCity(testingData.city.nameRus, testingData.city.nameUk)
        .then(function (data) {
          if (data) {
            testingData.city.id = data;
            db.Company.addCompany(testingData.city.id, testingData.company.companyName, testingData.company.companyId)
              .then(function (data) {
                if (data) {
                  testingData.company.id = data;
                  db.Service.addService(testingData.company.id, testingData.service.serviceName, testingData.service.serviceId)
                    .then(function (data) {
                      if (data) {
                        testingData.service.id = data;
                        db.PersonalAccount.addAccrual(testingData.accrualsOptions, testingData.company.id,
                          testingData.service.id)
                          .then(function(data) {
                            if (data) {
                              testingData.accrualsOptions.id = data;
                              db.Counter.addCounter(testingData.accrualsOptions.id, testingData.counter.idHouse, testingData.company.id,
                                testingData.service.id, testingData.counter.position, testingData.counter.meterReading, testingData.counter.date)
                                .then(function (data) {
                                  if (data) {
                                    testingData.counter.id = data;
                                    resolve(testingData);
                                  }
                                  else
                                    reject();
                                })
                                .catch(function (err) {
                                  console.log(err);
                                  reject(err);
                                })
                            }
                            else
                              reject();
                          })
                          .catch(function (err) {
                            console.log(err);
                            reject(err);
                          })
                      }
                      else
                        reject();
                    })
                    .catch(function (err) {
                      console.log(err);
                      reject(err);
                    })
                }
                else
                  reject();
              })
              .catch(function (err) {
                console.log(err);
                reject(err);
              })
          }
          else
            reject();
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    })
  },
  addPersonalAccaunt: function addPersonalAccaunt() {
    return new Promise(function (resolve, reject) {
      db.City.addCity(testingData.city.nameRus, testingData.city.nameUk)
        .then(function (data) {
          if (data) {
            testingData.city.id = data;
            db.Company.addCompany(testingData.city.id, testingData.company.companyName, testingData.company.companyId)
              .then(function (data) {
                if (data) {
                  testingData.company.id = data;
                  db.Service.addService(testingData.company.id, testingData.service.serviceName, testingData.service.serviceId)
                    .then(function (data) {
                      if (data) {
                        testingData.service.id = data;
                        db.PersonalAccount.addAccrual(testingData.accrualsOptions, testingData.company.id,
                          testingData.service.id)
                          .then(function(data) {
                            if (data) {
                              testingData.accrualsOptions.id = data;
                              resolve(testingData);
                            }
                            else
                              reject();
                          })
                          .catch(function (err) {
                            console.log(err);
                            reject(err);
                          })
                      }
                      else
                        reject();
                    })
                    .catch(function (err) {
                      console.log(err);
                      reject(err);
                    })
                }
                else
                  reject();
              })
              .catch(function (err) {
                console.log(err);
                reject(err);
              })
          }
          else
            reject();
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    })
  },
  removeCompany: function removeCompany() {
    return new Promise(function(resolve, reject) {
      if (testingData.company.id) {
        db.Company.destroy({id: testingData.company.id})
          .then(function () {
            if (testingData.city.id) {
              db.City.destroy({id: testingData.city.id})
                .then(function () {
                  resolve(true);
                })
                .catch(function (err) {
                  console.log(err);
                  reject(err);
                })
            } else {
              resolve();
            }
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          })
      }
    })
  },
  removeStreet: function removeCompany() {
    return new Promise(function(resolve, reject) {
      if (testingData.street.id) {
        db.Street.destroy({id: testingData.street.id})
          .then(function () {
            if (testingData.city.id) {
              db.City.destroy({id: testingData.city.id})
                .then(function () {
                  resolve(true);
                })
                .catch(function (err) {
                  console.log(err);
                  reject(err);
                })
            } else {
              resolve();
            }
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          })
      }
    })
  },
  removePaymentDocument: function removePaymentDocument() {
    return new Promise(function(resolve, reject) {
      if (testingData.accrualsOptions.id) {
        db.PaymentDocument.destroy({id: testingData.accrualsOptions.id})
          .then(function () {
            resolve(true);
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          })
      } else {
        resolve();
      }
    })
  },
  removeService: function removeService() {
    return new Promise(function(resolve, reject) {
      if (testingData.service.id) {
        db.Service.destroy({id: testingData.service.id})
          .then(function () {
            if (testingData.company.id) {
              db.Company.destroy({id: testingData.company.id})
                .then(function () {
                  if (testingData.city.id) {
                    db.City.destroy({id: testingData.city.id})
                      .then(function () {
                        resolve(true);
                      })
                      .catch(function (err) {
                        console.log(err);
                        reject(err);
                      })
                  } else {
                    resolve();
                  }
                })
                .catch(function (err) {
                  console.log(err);
                  reject(err);
                })
            }
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          })
      } else {
        resolve();
      }
    })
  },
  removeCounter: function removeCounter() {
    return new Promise(function(resolve, reject) {
        if (testingData.accrualsOptions.id) {
          db.PersonalAccount.destroy({id: testingData.accrualsOptions.id})
            .then(function () {
              if (testingData.counter.id) {
                db.Counter.destroy({id: testingData.counter.id})
                  .then(function () {
                    if (testingData.service.id) {
                      db.Service.destroy({id: testingData.service.id})
                        .then(function () {
                          if (testingData.company.id) {
                            db.Company.destroy({id: testingData.company.id})
                              .then(function () {
                                if (testingData.city.id) {
                                  db.City.destroy({id: testingData.city.id})
                                    .then(function () {
                                      resolve(true);
                                    })
                                    .catch(function (err) {
                                      console.log(err);
                                      reject(err);
                                    })
                                } else {
                                  resolve();
                                }
                              })
                              .catch(function (err) {
                                console.log(err);
                                reject(err);
                              })
                          } else {
                            resolve();
                          }
                        })
                        .catch(function (err) {
                          console.log(err);
                          reject(err);
                        })
                    } else {
                      resolve();
                    }
                  })
                  .catch(function (err) {
                    console.log(err);
                    reject(err);
                  })
              } else {
                resolve();
              }
            })
            .catch(function (err) {
              console.log(err);
              reject(err);
            })
        } else {
          resolve();
        }
    })
  },
  removePersonalAccaunt: function removePersonalAccaunt() {
    return new Promise(function(resolve, reject) {
      if (testingData.accrualsOptions.id) {
        db.PersonalAccount.destroy({id: testingData.accrualsOptions.id})
          .then(function () {
            if (testingData.service.id) {
              db.Service.destroy({id: testingData.service.id})
                .then(function () {
                  if (testingData.company.id) {
                    db.Company.destroy({id: testingData.company.id})
                      .then(function () {
                        if (testingData.city.id) {
                          db.City.destroy({id: testingData.city.id})
                            .then(function () {
                              resolve(true);
                            })
                            .catch(function (err) {
                              console.log(err);
                              reject(err);
                            })
                        } else {
                          resolve();
                        }
                      })
                      .catch(function (err) {
                        console.log(err);
                        reject(err);
                      })
                  } else {
                    resolve();
                  }
                })
                .catch(function (err) {
                  console.log(err);
                  reject(err);
                })
            } else {
              resolve();
            }
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          })
      } else {
        resolve();
      }
    })
  }
};