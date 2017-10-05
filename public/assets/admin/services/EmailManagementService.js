angular.module('adminApp')
  .service('EmailManagementService', function ($q, $http) {
    this.sendPass = function (form) {
      var deferred = $q.defer();
      $http.post('/admin/mailer/sendpass', form)
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
    this.sendCertificate = function (form) {
      var deferred = $q.defer();
      $http.post('/admin/mailer/sendcertificate', form)
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
  });