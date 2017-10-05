"use strict";

/**
 * getPaymentSystems возвращает массив платежных систем
 * createPaymentForm создание кнопки для проведения платежного документа
 * checkPayment проверка статуса платежного документа
 * @param $scope
 */
function ChoicePaymentSystemCtrl($scope, $http, $localStorage, paymentSystemsService) {
  var this_ = this;
  this.scope = $scope;
  this.http = $http;
  this.localStorage = $localStorage;
  this.paymentSystemsService = paymentSystemsService;
  $scope.getPaymentSystems = angular.bind(this, this.getPaymentSystems);
  $scope.createPaymentForm = angular.bind(this, this.createPaymentForm);
  $scope.checkPayment = angular.bind(this, this.checkPayment);
  $scope.getPaymentSystems();
  $scope.paymentSystems = [];
  $scope.paymentButton = "";
}

ChoicePaymentSystemCtrl.prototype = {
  getPaymentSystems: function () {
    var this_ = this;
    this_.paymentSystemsService.getPaymentSystems()
      .then(function(paymentSystems) {

        //установка по умолчанию liqpay
        this_.scope.selected = 0;
        for(var i = 0, l = paymentSystems.length; i < l; i++) {
          if(paymentSystems[i].name == "liqpay")
            this_.scope.selected = paymentSystems[i].id;
        }
        //обновление данных для отправки в платежную систему
        this_.createPaymentForm();
        this_.scope.paymentSystems = paymentSystems;
      })
      .catch(function(error) {
        alertify.error("Виникла непердбачена помилка");
      });
  },
  createPaymentForm: function() {
    var this_ = this;
    this_.http({method: 'POST', url: '/create/payment/form',
      data: {"selectedSystem": this_.scope.selected, "orderId": this_.localStorage.orderId,
        "sum": this_.localStorage.sum, "address": this_.localStorage.address}
    })
      .success(function (options, res) {
        if(res == 200) {
          this_.scope.liqPayForm.data.$setViewValue(options.data);
          this_.scope.liqPayForm.signature.$setViewValue(options.signature);
        } else {
          alertify.error("Виникла непердбачена помилка");
        }
      })
      .error(function (data, res) {
        alertify.error("Виникла непердбачена помилка");
      });
  }
};
function config($stateProvider) {
  $stateProvider.state('subscriber./choice/payment/system',{
    url: '/choice/payment/system',
    templateUrl: '/assets/user/views/ChoicePaymentSystem.html',
    ncyBreadcrumb:{
      skip: true
    },
    controller: 'ChoicePaymentSystemCtrl'
  })

}

function v () {
  var el = angular.element('.control-label');
  el.style('color:red');
  el.attr("color", "red");
  alert('sdf');
  var elo = angular.element('#liqpay');
  elo.attr("selected");
}

angular.module('userApp')
  .controller('ChoicePaymentSystemCtrl', ChoicePaymentSystemCtrl)
  .config(config);