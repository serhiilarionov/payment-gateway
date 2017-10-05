angular.module('adminApp')
  .service('CliManagementService', function ($http, $q) {

    this.revokeEmployeeCertificate = function (id) {
      var deferred = $q.defer();
      $http.post('/admin/cli/revokecert', {id: id})
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    this.recreateEmployeeCertificate = function (id, userNewCertTerm) {
      var deferred = $q.defer();
      $http.post('/admin/cli/recreatecert', {id: id, userNewCertTerm: userNewCertTerm})
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
  });