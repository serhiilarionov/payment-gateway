function addressSelection() {
  return {
    templateUrl: "/assets/employee/views/AddressSelection.html",
    replace: true,
    scope: {},
    restrict: 'E',
    controller: 'addressSelectionCtrl',
    link: function ($scope, element, attrs) {
    }
  }

}

angular.module('employeeApp')
  .directive("addressSelection", addressSelection);