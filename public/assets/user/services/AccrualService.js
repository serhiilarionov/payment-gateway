'use strict';

/**
 * @todo: Описать сервис accrualsService
 */

angular.module('userApp')
  .service('accrualsService', function ($http, $q) {

    this.getAccruals = function (idHouse, year, month) {
      var deferred = $q.defer();
      $http.post('/get/accruals', {
        idHouse: idHouse,
        year: year,
        month: month
      })
        .success(function (response) {
            var accruals = [];
            for(var i= 0; i < response.length; i++) {
              accruals.push({
                  "id": response[i].id,
                  "transcript": response[i].transcript,
                  "number": response[i].number,
                  "companyId": response[i].companyId,
                  "companyName": response[i].companyName,
                  "serviceId": response[i].serviceId,
                  "serviceName": response[i].serviceName,
                  "debt": response[i].debt,
                  "accrual": response[i].accrual,
                  "forPayment": response[i].forPayment,
                  "paid": response[i].paid,
                  "fio": response[i].lastName + " " + response[i].firstName + " " + response[i].patronymic
                }
              );
            }
          var date = null;
          if(response.length) {
            date = response[0].dateOfAccrued;
          }
            deferred.resolve({accruals: accruals, date: date});
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
    this.minYear = function (idHouse) {
      var deferred = $q.defer();
      $http.post('/get/accruals/year/minimal', {idHouse: idHouse})
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
