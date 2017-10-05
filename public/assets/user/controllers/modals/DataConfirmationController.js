"use strict";

/**
 *
 * @param variables объект с платежами, плательщиком и idHouse
 * @constructor
 */
function DataConfirmationCtrl($scope, $filter, $state, $http, $location, $localStorage, $modalInstance, variables) {
  this.scope = $scope;
  $scope.filter = $filter;
  this.modalInstance = $modalInstance;
  this.location = $location;
  this.http = $http;
  this.state = $state;
  this.storage = $localStorage;
  $scope.variables = variables;
  $scope.payments = variables.payments;
  $scope.payer = variables.payer;
  this.scope.submit = angular.bind(this, this.submit);
}
DataConfirmationCtrl.prototype = {
  submit: function () {
    var this_ = this;
      this_.http({method: 'POST', url: '/create/payment/document',
        data: {"variables": this_.scope.variables}
      })
        .success(function (data, res) {
          if(res == 200) {
            this_.modalInstance.close();
            this_.storage.sum = data.sum;
            this_.storage.orderId = data.orderId;
            this_.state.go('subscriber./choice/payment/system');
          } else {
            alertify.error("Виникла непердбачена помилка");
          }
        })
        .error(function (data, res) {
          if(res == 401) {
            alertify.error("Невірно введений пін код");
          } else {
            alertify.error("Виникла непердбачена помилка");
          }
        });
  }
};

angular.module('userApp')
  .controller('DataConfirmationCtrl', ['$scope', '$filter', '$state', '$http', '$location', '$localStorage', '$modalInstance', 'variables', DataConfirmationCtrl])
  .config(config);