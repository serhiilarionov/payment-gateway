'use strict';

/**
 * @todo: Описать сервис paymentService
 */

angular.module('userApp')
  .service('paymentService', function ($http, $q) {

    this.getPayments = function (idHouse, year, month) {
      var deferred = $q.defer();
      $http.post('/get/payments', {
        year: year,
        month: month,
        idHouse: idHouse
      })
        .success(function (data) {
          var payments = [];
          for(var i= 0; i < data.length; i++) {
            data[i].paymentDate = moment(data[i].paymentDate).format('DD.MM.YYYY');
            data[i].dateOfEnrollment = moment(data[i].dateOfEnrollment).format('DD.MM.YYYY');
            payments.push({
                "Особовий рахунок": data[i].personalAccount,
                "Підприємство": data[i].companyName,
                "Послуга": data[i].serviceName,
                "Банк": data[i].bankName,
                "Сума": data[i].amount,
                "Дата платежу": data[i].paymentDate,
                "Дата зарахування": data[i].dateOfEnrollment
              }
            );
          }
          deferred.resolve(payments);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    this.getPaymentsOnline = function (idHouse, year, month) {
      var deferred = $q.defer();
      $http.get('/payment/data/online', {params: {
        year: year,
        month: month,
        idhouse: idHouse
      }
      })
        .success(function (payments) {
          for(var i= 0; i < payments.length; i++) {
            payments[i].endDate = moment(payments[i].paymentDate).format('DD.MM.YYYY');
            payments[i].startDate = moment(payments[i].dateOfEnrollment).format('DD.MM.YYYY');
            payments[i].date = moment(payments[i].date).format('DD.MM.YYYY');
          }
          deferred.resolve(payments);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    this.minYear = function (idHouse) {
      var deferred = $q.defer();
      $http.post('/get/payments/year/minimal', {
        idHouse: idHouse
      })
        .success(function (minYear) {
          if(minYear != null) {
            var years = [], yearNow = new Date().getFullYear();
            for(var i = minYear; i <= yearNow; i++) {
              years.push(i);
            }
            deferred.resolve(years);
          } else {
            deferred.resolve([]);
          }
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    this.getPaymentSystems = function (idHouse) {
      var deferred = $q.defer();
      $http.post('/get/payments/year/minimal', {
        idHouse: idHouse
      })
        .success(function (minYear) {
          if(minYear != null) {
            var years = [], yearNow = new Date().getFullYear();
            for(var i = minYear; i <= yearNow; i++) {
              years.push(i);
            }
            deferred.resolve(years);
          } else {
            deferred.resolve([]);
          }
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
  });