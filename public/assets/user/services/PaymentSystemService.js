'use strict';

angular.module('userApp')
  .service('paymentSystemsService', function ($http, $q) {
    this.getPaymentSystems = function () {
      var deferred = $q.defer();
      $http.get('/admin/manage/paymentSystem/liqpay/get/params')
        .success(function (systems) {
          deferred.resolve(systems);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
  });
