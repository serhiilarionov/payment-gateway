'use strict';

/**
 * Тестовые данные и функции по заполнению в базу
 * before - заполняет тестовыми данными базу
 * after - удаляет тестовые данные из базы
 */


var testData = {
  data: {
    cities: {
      id: null,
      url: null,
      text: null,
      createdAt: null,
      updatedAt: null,
      nameRus: null,
      nameUk: null
    },
    companies: {
      id: null,
      cityId: null,
      companyName: null,
      companyId: null,
      closingDate: null,
      edrpoy: null,
      bankAccount: null
    },
    counter_payment_document: {
      id: null,
      data: null,
      idHouse: null,
      counterId: null,
      companyId: null,
      serviceId: null,
      position: null,
      meterReading: null
    },
    counters: {
      id: null,
      personalAccountId: null,
      idHouse: null,
      companyId: null,
      serviceId: null,
      position: null,
      meterReading: null,
      date: null
    },
    employees: {

    }

  }
};
 testData.before = function() {

 };

testData.after = function() {

};



module.exports = testData;
