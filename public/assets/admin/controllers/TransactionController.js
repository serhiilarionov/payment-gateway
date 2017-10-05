function TransactionCtrl($scope, transactionService, uiGridConstants) {
  this.scope = $scope;
  $scope.maxDate = new Date();
  $scope.transactionData = [];
  $scope.transactions = [];
  $scope.selectedDate = new Date();
  this.transactionService = transactionService;
  $scope.getTransactions = angular.bind(this, this.getTransactions);
  $scope.$watch('selectedDate', function (newValue) {
    $scope.getTransactions();
  });
  $scope.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    enableCellEditOnFocus: true,
    showColumnFooter: true,
    data: $scope.transactions,
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    },
    columnDefs: [
      {field: 'id', name: 'Усього', width: '10%', displayName: 'Номер', enableSorting: false, enableCellEdit: false, aggregationType: uiGridConstants.aggregationTypes.count, aggregationLabel: ' '},
      {field: 'status', width: '15%', displayName: 'Статус',
        filter: {
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: '0', label: 'В обробці' }, { value: '1', label: 'Успішно' }, { value: '2', label: 'Не успішно'}, { value: '3', label: 'Тест'}]
        },
        cellFilter: 'transactionStatusFilter'
      },
      {field: 'senderName', displayName: 'Відправник', width: '20%'},
      {field: 'recipientName', displayName: 'Одержувач', width: '15%'},
      {field: 'accrual', width: '9%', displayName: 'Сума', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationLabel: ' '},
      {field: 'paymentDocumentId', width: '15%', displayName: 'Платіжний документ'},
      {field: 'senderBankAccount', width: '15%', displayName: 'Рахунок відправника'},
      {field: 'recipientBankAccount', width: '15%', displayName: 'Рахунок одержувача'},
      {field: 'senderEdrpoy', width: '15%', displayName: 'ЕДРПОУ відправника'},
      {field: 'recipientEdrpoy', width: '15%', displayName: 'ЕДРПОУ одержувача'},
      {field: 'senderMfo', width: '15%', displayName: 'МФО відправника'},
      {field: 'recipientMfo', width: '15%', displayName: 'МФО одержувача'},
      {field: 'paymentSystemName', width: '15%', displayName: 'Платіжна система'},
      {field: 'receiptOfThePaymentSystem', width: '15%', displayName: 'Квитанція від платіжної системи'}
    ]
  };
}

TransactionCtrl.prototype = {
  getTransactions: function() {
    var this_ = this;
    this_.transactionService.getTransactions(this_.scope.selectedDate)
      .then(function(data) {
        this_.scope.transactionData = data;
        this_.scope.gridOptions = {
          data: this_.scope.transactionData
        };
       // console.log(this_.scope.gridOptions.data); WTF ????
      })
      .catch(function() {
        this_.scope.transactions = [];
      });
  }
};

TransactionCtrl.resolve = {};

function config($routeProvider) {
  $routeProvider.when('/transaction',{
    templateUrl: '/assets/admin/views/Transaction.html',
    controller: 'TransactionCtrl',
    resolve: TransactionCtrl.resolve
  })
    .otherwise({
      redirectTo: '/'
    });
}

angular.module('adminApp')
  .controller('TransactionCtrl', ['$scope', 'transactionService', 'uiGridConstants', TransactionCtrl])
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