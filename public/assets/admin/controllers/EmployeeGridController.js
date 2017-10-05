function EmployeeGridController($scope, $modal, allemployees, UserManagementService) {
  $scope.allemployees = allemployees;
  $scope.gridOptions = {
    enableSorting: true,
    enableColumnMenus: false,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
    multiSelect: false,
    columnDefs: [
      {field: 'login', displayName: 'Логін'},
      {field: 'fio', displayName: 'ПІБ'},
      {field: 'nameUk', displayName: 'Місто'},
      {field: 'companyName', displayName: 'Компанія'},
      {field: 'roles', displayName: 'Роль', cellFilter: 'roleOfEmployee'},
      {field: 'isdisabled', displayName: 'Активний?', cellFilter: 'isEmployeeActive'}
    ],
    data: allemployees
  };
  $scope.gridOptions.onRegisterApi = function(gridApi) {
    $scope.gridApi = gridApi;
    gridApi.selection.on.rowSelectionChanged($scope,function(row){
      $scope.currentSelection = row.entity;
      $scope.isRowSelected = row.isSelected;
    });
  };

  $scope.revokeCertificate = function() {
    var modalInst = $modal.open({
      templateUrl: '/assets/admin/views/modals/certRevocationModal.html',
      controller: 'RevocationModalController',
      size: 'sm',
      resolve: {
        currentSelection: function () {
          return $scope.currentSelection;
        },
        gridOptions: function () {
          return $scope.gridOptions;
        }
      }
    });
  };

  $scope.generateNewCertificate = function() {
    var modalInst = $modal.open({
      templateUrl: '/assets/admin/views/modals/certRecreationModal.html',
      controller: 'RevocationModalController',
      size: 'md',
      resolve: {
        currentSelection: function () {
          return $scope.currentSelection;
        },
        gridOptions: function () {
          return $scope.gridOptions;
        }
      }
    });
  };
}

EmployeeGridController.resolve = {
  allemployees: function(UserManagementService) {
    return UserManagementService.getAllEmployees();
  }
};

function config($routeProvider) {
  $routeProvider.when('/allemployees', {
    templateUrl: '/assets/admin/views/employeeGrid.html',
    controller: EmployeeGridController,
    resolve: EmployeeGridController.resolve
  })
  .otherwise({
    redirectTo: '/'
  });
}

angular.module('adminApp')
  .controller('EmployeeGridController', EmployeeGridController)
  .config(config);


