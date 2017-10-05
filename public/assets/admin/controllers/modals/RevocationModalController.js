function RevocationModalController($scope, $timeout, $modalInstance, currentSelection, gridOptions, CliManagementService, UserManagementService) {
  $scope.currentSelection = currentSelection;
  $scope.gridOptions = gridOptions;
  $scope.userNewCertTerm = 30;
  $scope.ok = function() {
    CliManagementService.revokeEmployeeCertificate($scope.currentSelection.id).then(function(data) {
      UserManagementService.getAllEmployees().then(function(data) {
        $scope.gridOptions.data = data;
      });
      $scope.data = data;
      $timeout($modalInstance.close, 3000);
    }).catch(function(err) {
      $scope.err = err;
      $timeout($modalInstance.close, 3000);
    })
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  $scope.recreate = function() {
    CliManagementService.recreateEmployeeCertificate($scope.currentSelection.id, $scope.userNewCertTerm).then(function(data) {
      UserManagementService.getAllEmployees().then(function(data) {
        $scope.gridOptions.data = data;
      });
      $scope.data = data;
      $timeout($modalInstance.close, 3000);
    }).catch(function(err) {
      $scope.err = err;
      $timeout($modalInstance.close, 3000);
    })
  }
}

angular.module('adminApp')
  .controller('RevocationModalController', RevocationModalController);