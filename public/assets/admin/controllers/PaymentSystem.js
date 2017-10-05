function PaymentSystemCtrl($scope, paymentSystems, paymentSystemService) {
  $scope.paymentSystems = paymentSystems;
  $scope.paymentSystemService = paymentSystemService;
  $scope.liqpay = {
    name: 'liqpay',
    id: null,
    options: {
      sandbox: false,
      public_key: '',
      private_key: ''
    }
  };
  var liqpayData = _.findWhere(paymentSystems, {name: "liqpay"});
  if(liqpayData) {
    $scope.liqpay = liqpayData;
  }
  $scope.setChanges = function() {
    paymentSystemService.setPaymentSystemOptions($scope.liqpay.id, $scope.liqpay.name, $scope.liqpay.options);
  }
}
PaymentSystemCtrl.prototype = {};

PaymentSystemCtrl.resolve = {
  paymentSystems: function (paymentSystemService) {
    return paymentSystemService.getPaymentSystems();
  }
};

function config($routeProvider) {
  $routeProvider.when('/paymentSystem',{
    templateUrl: '/assets/admin/views/PaymentSystem.html',
    controller: 'PaymentSystemCtrl',
    resolve: PaymentSystemCtrl.resolve
  })
    .otherwise({
      redirectTo: '/'
    });
}

angular.module('adminApp')
  .controller('PaymentSystemCtrl', PaymentSystemCtrl)
  .config(config);