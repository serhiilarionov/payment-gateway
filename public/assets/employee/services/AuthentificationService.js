'use strict';

/**
 * @todo: Описать сервис AuthentificationService
 */

angular.module('employeeApp')
  .service('AuthentificationService', function($http,$q) {
    this.isAuth = function() {
      var deferred = $q.defer();
      $http.post('/get/authorized/info',{})
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      $http.get('/get/ErrLinkMsg',{})
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
  });