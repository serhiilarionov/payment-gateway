function ManageAccrualCtrl($scope, cities, CityManagementService, accrualsService) {
  var this_ = this;
  this.scope = $scope;
  this.accrualsService = accrualsService;
  this.CityManagementService = CityManagementService;
  $scope.getCompanies = angular.bind(this, this.getCompanies);
  $scope.setClosingDate = angular.bind(this, this.setClosingDate);
  $scope.cities = cities;
  $scope.selectedCity = cities[0].id;
  $scope.companies = [];
  $scope.selectedCompany = 0;
  $scope.getCompanies();
  $scope.closingDate = new Date();
}

ManageAccrualCtrl.prototype = {
  setClosingDate: function() {
    var this_ = this;
    this.accrualsService.setClosingDate(this_.scope.closingDate, this_.scope.selectedCompany)
      .then(function(data) {
        alertify.success("Дані успішно занесені до бази");
      })
      .catch(function(err) {
        alertify.error("Виникла непередбачена помилка");
      });
  },
  getCompanies: function() {
    var this_ = this;
    this.CityManagementService.getCompanies({id: this_.scope.selectedCity})
      .then(function(data) {
        this_.scope.companies = data;
        this_.scope.selectedCompany = data[0].id;
      })
      .catch(function(err) {
        alertify.error("Помилка завантаження підпрємств");
      });
  }
};

ManageAccrualCtrl.resolve = {
  cities: function (CityManagementService) {
    return CityManagementService.getCities();
  }
};

function config($routeProvider){
  $routeProvider.when('/manage/companies',{
    templateUrl: '/assets/admin/views/ManageAccrual.html',
    controller: 'ManageAccrualCtrl',
    resolve: ManageAccrualCtrl.resolve
  })
    .otherwise({
      redirectTo: '/'
    });
}

angular.module('adminApp')
  .controller('ManageAccrualCtrl', ManageAccrualCtrl)
  .config(config);