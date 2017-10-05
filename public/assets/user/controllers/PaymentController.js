"use strict";

/**
 * getPayments возвращает массив платежей
 */
function PaymentCtrl($scope, years, paymentService, $localStorage, uiGridConstants) {
  var this_ = this;
  this.scope = $scope;
  $scope.dateInfo = {};
  $scope.years = years;
  this.localStorage = $localStorage;
  this.paymentService = paymentService;
  $scope.getPayments = angular.bind(this, this.getPayments);
  $scope.gridOptions = {
    enableColumnMenus: false,
    enableSorting: false,
    enableCellEditOnFocus: false,
    showColumnFooter: true,
    columnDefs: [
      {field: 'Особовий рахунок', displayName: 'Особовий рахунок'},
      {field: 'Підприємство', displayName:'Підприємство'},
      {field: 'Послуга', displayName: 'Послуга',
        footerCellTemplate: '<div class="ui-grid-cell-contents" >Разом: </div>'  },
      {field: 'Банк', displayName:'Банк'},
      {field: 'Сума', displayName: 'Сума',  aggregationType:  uiGridConstants.aggregationTypes.sum, aggregationLabel: ' '},
      {field: 'Дата платежу', displayName: 'Дата платежу'},
      {field: 'Дата зарахування', displayName: 'Дата зарахування'}
    ]
  };
  $scope.selectedYear =  new Date().getFullYear();
  $scope.monthStatic = [{name: 'Січень', number: 1},
    {name: 'Лютий', number: 2},
    {name: 'Березень', number: 3},
    {name: 'Квітень', number: 4},
    {name: 'Травень', number: 5},
    {name: 'Червень', number: 6},
    {name: 'Липень', number: 7},
    {name: 'Серпень', number: 8},
    {name: 'Вересень', number: 9},
    {name: 'Жовтень', number: 10},
    {name: 'Листопад', number: 11},
    {name: 'Грудень', number: 12}];
  $scope.selectedYear =  new Date().getFullYear();
  $scope.selectedMonth = new Date().getMonth()+1;
  $scope.address = 'Адреса: ' + $localStorage.address;
  $scope.getPayments();
}

PaymentCtrl.prototype = {
  getPayments: function() {
    var this_ = this;
  this.paymentService.getPayments(this_.localStorage.idHouse, this.scope.selectedYear, this.scope.selectedMonth)
    .then(function (payments) {
      if(!payments.length) {
        this_.scope.dateInfo.text = null;
        this_.scope.dateInfo.title = null;
        this_.scope.dateInfo.err = 'За даний період дані відсутні.';
        alertify.error("За даний період дані відсутні");
      } else {
        var textDate = this_.scope.monthStatic[this_.scope.selectedMonth - 1].name + ' ' + this_.scope.selectedYear;
        this_.scope.dateInfo.err = null;
        this_.scope.dateInfo.text = 'Інформація про оплату комунальних послуг на '+ textDate + ' року';
      }
      this_.scope.gridOptions = {
        enableColumnMenus: false,
        enableSorting: false,
        enableCellEditOnFocus: false,
        data: payments
      };
    })
    .catch(function (err) {
      alertify.error("Пробачте, з’явилась непередбачена помилка");
      this_.scope.dateInfo = 'Пробачте, з’явилась непередбачена помилка.';
    });
  }
};
PaymentCtrl.resolve = {
  years: function (paymentService, $localStorage) {
    return paymentService.minYear($localStorage.idHouse);
  }
};

function config($stateProvider) {
  $stateProvider.state('subscriber./payments', {
    url: '/payments',
    templateUrl: '/assets/user/views/Payment.html',
    controller: 'PaymentCtrl',
    ncyBreadcrumb: {
      parent: 'subscriber',
      label: 'Історія платежів'
    },
    resolve: PaymentCtrl.resolve
  });
}

angular.module('userApp')
  .controller('PaymentCtrl', PaymentCtrl)
  .config(config);