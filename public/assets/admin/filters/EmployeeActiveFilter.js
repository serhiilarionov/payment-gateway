angular.module('adminApp').filter('isEmployeeActive', function() {
  return function(input) {
    return (input == true)? 'Ні': 'Так';
  };
});