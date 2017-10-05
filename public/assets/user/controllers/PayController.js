"use strict";

/**
 *
 * getAccruals возвращает масив с начислениями за определенный месяц
 * verification вызывает модалку для потверждение введенных данных
 */
function PayCtrl($scope, $filter, years, accrualsService, countersService, $localStorage, $modal) {
  var this_ = this;
  this.scope = $scope;
  this.filter = $filter;
  this.modal = $modal;
  $scope.dateInfo = {};
  $scope.years = years;
  this.localStorage = $localStorage;
  this.accrualsService = accrualsService;
  this.countersService = countersService;
  $scope.getAccruals = angular.bind(this, this.getAccruals);
  $scope.showCounter = angular.bind(this, this.showCounter);
  $scope.greaterThan = angular.bind(this, this.greaterThan);
  $scope.verification = angular.bind(this, this.verification);
  $scope.accruals = [];
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
  $scope.startOpened = [];
  $scope.endOpened = [];
  $scope.open = function ($event, opened, id) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope[opened][id] = true;
  };
  $scope.dateValid = true;
  $scope.now = new Date();
  $scope.selectedYear = new Date().getFullYear();
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
  $scope.selectedYear = new Date().getFullYear();
  $scope.selectedMonth = new Date().getMonth() + 1;
  $scope.address = $localStorage.address;
  $scope.getAccruals();
}

PayCtrl.prototype = {
  getAccruals: function() {
    var this_ = this;
    this_.accrualsService.getAccruals(this_.localStorage.idHouse, this_.scope.selectedYear, this_.scope.selectedMonth)
      .then(function (response) {
        if (!response.accruals.length) {
          alertify.error('За даний період дані відсутні');
          this_.scope.dateInfo.err = 'За даний період дані відсутні';
          this_.scope.dateInfo.title = null;
          this_.scope.dateInfo.text = null;
          this_.scope.gridOptions = {
            data: []
          };
          this_.scope.renters = [];
          this_.scope.payments = [];
        } else {
          var date = new Date(response.date);
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          if (month < 10) {
            month = '0' + month;
          }
          var day= date.getDate();
          if (day < 10) {
            day = '0' + day;
          }
          var textDate = day + '.' + month + '.' + date.getFullYear();
          date = moment(response.date);
          this_.scope.startDate =  this_.filter('date')(new Date(response.date), 'yyyy-MM-dd');
          this_.scope.endDate = this_.filter('date')(new Date(date.endOf('month')), 'yyyy-MM-dd');
          this_.scope.dateInfo.err = null;
          this_.scope.dateInfo.text = 'Інформація про нарахування за житлово-комунальні та інші послуги відображено станом на ' + textDate;
          this_.scope.renters = [];
          response.accruals.forEach(function (accrual) {
            accrual.leftToPay = (parseFloat(accrual.debt) + parseFloat(accrual.forPayment) - parseFloat(accrual.paid)).toFixed(2);
            accrual.toPay = '';
            accrual.expandableRow = false;
            accrual.startDate = this_.scope.startDate;
            accrual.endDate = this_.scope.endDate;
            this_.countersService.getCounters(accrual.id, accrual.companyId, accrual.serviceId, year, month)
              .then(function (response) {
                if (response.length)
                  accrual.counters = response;
                else
                  accrual.counters = [];
                this_.scope.renters.push({id: accrual.id, name: accrual.fio});
              })
              .catch(function (err) {
                console.error(err);
              });
          });
          this_.scope.renters = _.uniq(this_.scope.renters, false, function(obj) {return obj.fio});
          this_.scope.payments = response.accruals;
        }
      })
      .catch(function (err) {
        alertify.error("Пробачте, виникла неперебачена помилка");
        this_.scope.dateInfo = 'Пробачте, з’явилась непердбачена помилка.';
      });
  },
  showCounter: function(index) {
    var this_ = this;
    if (!this_.scope.payments[index].expandableRow) {
      this_.scope.payments[index].expandableRow = true;
    } else {
      this_.scope.payments[index].expandableRow = false;
    }
  },
  greaterThan: function (item) {
    item.toPay = item.toPay.replace(/,/g, ".");
    return item.toPay > 0;
  },
  verification: function() {
    var this_ = this;
    this_.scope.filterdPayments = this_.scope.payments.filter(this_.scope.greaterThan);
    if (this_.scope.filterdPayments.length && !this_.scope.toPayForm.$invalid) {
      var modalInstance = this_.modal.open({
        templateUrl: '/assets/user/views/modals/DataConfirmationModal.html',
        controller: 'DataConfirmationCtrl',
        size: 'lg',
        resolve: {
          variables: function () {
            return {payments: this_.scope.filterdPayments, payer: this_.scope.selectedRenter, idHouse: this_.localStorage.idHouse};
          }
        }
      });
    }
  }
};

PayCtrl.resolve = {
  years: function (accrualsService, $localStorage) {
    return accrualsService.minYear($localStorage.idHouse);
  }
};

function config( $stateProvider) {

  $stateProvider.state('subscriber./subscriber/to/pay', {
    url: '/to/pay',
    templateUrl: '/assets/user/views/Pay.html',
    controller: 'PayCtrl',
    ncyBreadcrumb: {
      parent: 'subscriber',
      label: 'Сплатити'
    },
   resolve: PayCtrl.resolve
  })
}

angular.module('userApp')
  .controller('PayCtrl', PayCtrl)
  .config(config);