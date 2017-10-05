angular.module('adminApp')
  .service('accrualsService', function ($http, $q) {

    this.setClosingDate = function (date, companyId) {
      var deferred = $q.defer();
      $http.post('/admin/manage/accrual/closingDate/set', {
        date: date,
        companyId: companyId
      })
        .success(function (response) {
          deferred.resolve(true);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
  });
