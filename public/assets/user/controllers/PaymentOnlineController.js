"use strict";

/**
 * getPayments возвращает массив платежей
 */
function PaymentOnlineCtrl($scope, years, paymentService, $localStorage, uiGridConstants) {
  var this_ = this;
  this.scope = $scope;
  $scope.dateInfo = {};
  $scope.years = years;
  this.localStorage = $localStorage;
  this.paymentService = paymentService;
  $scope.getPaymentsOnline = angular.bind(this, this.getPaymentsOnline);
  $scope.gridOptions = {
    enableColumnMenus: false,
    enableSorting: false,
    enableCellEditOnFocus: false,
    showColumnFooter: true,
    columnDefs: [
      {field: 'date', displayName: 'Дата платежу', aggregationType: uiGridConstants.aggregationTypes.count, aggregationLabel: 'Всього: '},
      {field: 'status', width: '15%', displayName: 'Статус',
        filter: {
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: '0', label: 'В обробці' }, { value: '1', label: 'Успішно' }, { value: '2', label: 'Не успішно'}, { value: '3', label: 'Тест'}]
        },
        cellFilter: 'transactionStatusFilter'
      },
      {field: 'amount', displayName: 'Сумма', aggregationType:  uiGridConstants.aggregationTypes.sum, aggregationLabel: ' '},
      {field: 'startDate', displayName: 'Початок періоду'},
      {field: 'endDate', displayName: 'Кінець періоду'},
      {field: 'companyName', displayName:'Підприємство'},
      {field: 'serviceName', displayName: 'Послуга'}
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
  $scope.getPaymentsOnline();
}

PaymentOnlineCtrl.prototype = {
  getPaymentsOnline: function() {
    var this_ = this;
  this.paymentService.getPaymentsOnline(this_.localStorage.idHouse, this.scope.selectedYear, this.scope.selectedMonth)
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
PaymentOnlineCtrl.resolve = {
  years: function (paymentService, $localStorage) {
    return paymentService.minYear($localStorage.idHouse);
  }
};

angular.module('userApp')
  .controller('PaymentOnlineCtrl', ['$scope', 'years', 'paymentService', '$localStorage', 'uiGridConstants', PaymentOnlineCtrl])
  .config(config)
  .filter('transactionStatusFilter', function() {
    var transactionStatusFilter = {
      0: 'В обробці',
      1: 'Успішно',
      2: 'Не успішно',
      3: 'Тест'
    };

    return function(input) {
      if (!input && input != '0'){
        return '';
      } else {
        return transactionStatusFilter[input];
      }
    };
  });