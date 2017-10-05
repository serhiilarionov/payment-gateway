angular.module('adminApp')
  .service('paymentSystemService', function ($http, $q) {

    this.getPaymentSystems = function () {
      var deferred = $q.defer();
      $http.get('/admin/manage/paymentSystem/liqpay/get/params')
        .success(function (response) {
          deferred.resolve(response);
        })
        .error(function (err) {
          deferred.resolve([]);
        });
      return deferred.promise;
    };

    this.setPaymentSystemOptions = function (id, name, options) {
      var deferred = $q.defer();
      if(name == 'liqpay') {
        $http.post('/admin/manage/paymentSystem/liqpay/set/params',
          {
            name: name,
            public_key: options.public_key,
            private_key: options.private_key,
            sandbox: options.sandbox,
            id: id
          })
          .success(function (response) {
            alertify.success("Дані успішно занесені в базу.");
            deferred.resolve(true);
          })
          .error(function (err) {
            deferred.resolve(false);
          });
      }

      return deferred.promise;
    };

  });
