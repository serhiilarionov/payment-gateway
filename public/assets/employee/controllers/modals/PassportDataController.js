function PassportDataCtrl($scope, $http, $modalInstance, $state, variables, $filter) {
  $scope.variables = variables;
  $scope.lastName = '';
  $scope.firstName = '';
  $scope.patronymic = '';
  $scope.whenIssuedPassport = '';
  $scope.passportNumber = '';
  $scope.issuedPassport = '';
  $scope.dateValid = true;
  $scope.now = new Date();
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };
  $scope.generatePinCode = function() {
    var date = $filter('date')($scope.whenIssuedPassport, 'yyyy-MM-dd', '');
    $http.post('/generate/pinCode', {
      idHouse: $scope.variables.idHouse,
      addressObj: $scope.variables.addressObj,
      whenIssuedPassport: date,
      issuedPassport: $scope.issuedPassport,
      passportNumber: $scope.passportNumber,
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      patronymic: $scope.patronymic
    })
      .success(function (data) {
        if(data > 1) {
          alertify.alert("Повторна видача пін коду");
        } else {
          alertify.alert("Пін успішно згенеровано");
        }
        window.location.reload();
      })
      .error(function (err) {
        alertify.error("Помилка генерації пін коду");
      });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}
PassportDataCtrl.prototype = {

};

function config($routeProvider){

}

angular.module('employeeApp')
  .controller('PassportDataCtrl', PassportDataCtrl)
  .config(config);