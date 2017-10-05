angular.module('adminApp')
  .service('UserManagementService', function ($http, $q) {
    this.checkIfLoginExists = function (login) {
      var deferred = $q.defer();
      $http.get('/admin/employees/check', {params: {'userLogin': login}})
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    this.addNewEmployee = function (form) {
      var deferred = $q.defer();
      $http.post('/admin/employees/addnewemployee', form)
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    this.getAllEmployees = function () {
      var deferred = $q.defer();
      $http.post('/admin/employees/getallemployees', {})
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

  });