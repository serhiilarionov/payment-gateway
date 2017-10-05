angular.module('adminApp')
  .service('transactionService', function ($http, $q) {

    this.getTransactions = function (date) {
      var deferred = $q.defer();
      $http.get('/admin/transactions/?date=' + date.toString())
        .success(function (response) {
          deferred.resolve(response);
        })
        .error(function (err) {
          alertify.error("Пробачте, виникла непербачена помилка");
          deferred.reject();
        });
      return deferred.promise;
    };


  });
