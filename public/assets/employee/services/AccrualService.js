angular.module('employeeApp')
  .service('accrualService', function ($http, $q) {

    this.getAccruals = function (idHouse, year, month, companyId, serviceId) {
      var deferred = $q.defer();

      $http.get('/employee/accruals', {
        params: {
          idHouse: idHouse,
          year: year,
          month: month,
          serviceId: serviceId
        }
      })
        .then(function (response) {
          var accruals = [];
          for(var i= 0; i < response.data.length; i++) {
            accruals.push({
                "transcript": response.data[i].transcript,
                "number": response.data[i].number,
                "companyName": response.data[i].companyName,
                "serviceName": response.data[i].serviceName,
                "debt": response.data[i].debt,
                "accrual": response.data[i].accrual,
                "paid": response.data[i].paid,
                "forPayment": response.data[i].forPayment,
                "companyId": response.data[i].companyId,
                "serviceId": response.data[i].serviceId,
                "dateOfAccrued": response.data[i].dateOfAccrued
            });
          }
          var date = null;
          if (response.length) {
            date = response[0].dateOfAccrued;
          }
          deferred.resolve({accruals: accruals, date: date});
        })
        .catch(function (err) {
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
