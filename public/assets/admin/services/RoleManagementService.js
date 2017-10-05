angular.module('adminApp')
  .service('RoleManagementService', function ($q, $http) {
    this.getRoles = function () {
      var deferred = $q.defer();
      $http.get('/admin/roles/all')
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
  });