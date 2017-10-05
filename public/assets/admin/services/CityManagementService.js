angular.module('adminApp')
  .service('CityManagementService', function ($http, $q) {
    this.getCities = function (search, lang) {
      var deferred = $q.defer();
      $http.get('/cities/all/?search='+search+'&lang='+lang)
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
    this.getCompanies = function (selectedCity) {
      var deferred = $q.defer();
      $http.post('/companies/all', selectedCity)
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
  });