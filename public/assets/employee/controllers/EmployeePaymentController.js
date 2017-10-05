"use strict";

function EmployeePaymentCtrl($scope, years, employeePaymentService, $localStorage, uiGridConstants) {
  var this_ = this;
  this.scope = $scope;
  $scope.dateInfo = {};
  $scope.years = years; //[2014, 2015];
  this.localStorage = $localStorage;
  this.employeePaymentService = employeePaymentService;
  $scope.getPayments = angular.bind(this, this.getPayments);
  $scope.gridOptions = {
      enableColumnMenus: false,
      enableSorting: false,
      enableCellEditOnFocus: false,
      showColumnFooter: true,
      columnDefs: [
        {field: 'Особовий рахунок', displayName: 'Особовий рахунок'},
        {field: 'Підприємство', displayName: 'Підприємство'},
        {
          field: 'Послуга', displayName: 'Послуга',
          footerCellTemplate: '<div class="ui-grid-cell-contents" >Разом: </div>'
        },
        {field: 'Банк', displayName: 'Банк'},
        {
          field: 'Сума',
          displayName: 'Сума',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationLabel: ' '
        },
        {field: 'Дата платежу', displayName: 'Дата платежу'},
        {field: 'Дата зарахування', displayName: 'Дата зарахування'}
      ]
    };
  $scope.employeeData =  employeePaymentService.getEmployeeData();
  $scope.companyId =  $scope.employeeData.companyId;
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
  //$scope.selectedYear =  new Date().getFullYear();
  $scope.selectedMonth = new Date().getMonth()+1;
 $scope.address = 'Адреса: місто '+ $localStorage.userDate[0].nameUk + ', ' + $localStorage.userDate[1].nameUk +' буд.'
 + $localStorage.userDate[2] + ' кв.' + $localStorage.userDate[5];
  $scope.getPayments();
}

EmployeePaymentCtrl.prototype = {
  getPayments: function() {
    var this_ = this;
  this.employeePaymentService.getPayments(this_.localStorage.idHouse, this.scope.selectedYear, this.scope.selectedMonth)
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
    })
  }
};

EmployeePaymentCtrl.resolve = {
  years: function (employeePaymentService, $localStorage) {
    return employeePaymentService.minYear($localStorage.idHouse);
  }
};

function config($routeProvider) {
  //$stateProvider.state('payments', {
  //  url: '/payments',
  //  templateUrl: '/assets/employee/views/Payment.html',
  //  controller: 'EmployeePaymentCtrl',
  //  ncyBreadcrumb: {
  //    parent: 'employee',
  //    label: 'Історія платежів'
  //  },
  //  resolve: EmployeePaymentCtrl.resolve
  //});

  $routeProvider.when('/payments',{
    templateUrl: '/assets/employee/views/Payment.html',
    controller: 'EmployeePaymentCtrl',
    resolve: EmployeePaymentCtrl.resolve
  })
}

angular.module('employeeApp')
  .controller('EmployeePaymentCtrl', EmployeePaymentCtrl)
  .config(config);