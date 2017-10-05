angular.module('adminApp').filter('roleOfEmployee', function() {
  return function(input) {
    if (input == 'administrator') return 'Адміністратор';
    else if (input == 'employee') return 'Робітник компанії';
    else return 'Мешканець';
  };
});