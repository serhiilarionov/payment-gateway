'use strict';

angular.module('userApp')
  .service('countersService', function ($http, $q) {
    this.getCounters = function (personalAccountId, companyId, serviceId, year, month) {
      var deferred = $q.defer();
      $http.post('/get/counters', {
        personalAccountId: personalAccountId,
        companyId: companyId,
        serviceId: serviceId,
        year: year,
        month: month
      })
        .success(function (response) {
            var counters = [];
            for(var i= 0; i < response.length; i++) {
              counters.push({
                  "id": response[i].id,
                  "personalAccountId": response[i].personalAccountId,
                  "idHouse": response[i].idHouse,
                  "serviceId": response[i].serviceId,
                  "companyId": response[i].companyId,
                  "position": response[i].position,
                  "meterReading": response[i].meterReading,
                  "date": response[i].date
                }
              );
            }
          deferred.resolve(counters);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
  });
