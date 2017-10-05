'use strict';
function addressSelectionCtrl($scope,  $state, $rootScope, $localStorage, addressSelectionService, LETTERS ) {

  this.letters=$scope.letters;
  this.scope = $scope;
  this.rootScope = $rootScope;
  this.state = $state;
  this.localStorage = $localStorage;
  this.addressSelectionService = addressSelectionService;
  $scope.street = {};
  $scope.streets = [];
  $scope.city = [];
  $scope.cities = [];
  $scope.selectedBuildingLetter='00';
  $scope.selectedFlatLetters='00';
  $scope.letters = LETTERS;
  $scope.checkAddress = angular.bind(this, this.checkAddress);
  $scope.change = angular.bind(this, this.change);
  $scope.open = angular.bind(this, this.open);
  $scope.refreshCity = angular.bind(this, this.refreshCity);
  $scope.refreshStreets =  angular.bind(this, this.refreshStreets);

  addressSelectionService.getCities()
    .then (function (cities) {
      $scope.cities = cities;
    })
    .catch (function (err) {
    console.log(err);
    alertify.alert('Вибачте. Виникла не передбачувана помилка.');
  });
}

addressSelectionCtrl.prototype = {
  checkAddress : function (){
    var this_ = this;
    if (this_.localStorage.address) {
      this_.scope.addressCheck = this_.localStorage.address;
      return true;
    } else {
      return false;
    }
  },
  change : function() {
    var this_ = this;
    var $scope = this.scope;
    this_.addressSelectionService.getStreets($scope.city.selected.id)
      .then (function (data) {
        if(data != undefined) {
          $scope.street.selected = null;
          $scope.streets = data;
        } else {
          alertify.error("В обраному місті програма не працює");
        }
      })
        .catch (function () {
        alertify.error("Пробачте, виникла непередбачена помилка");
      })
    },
  refreshCity : function (search, lang){
    var this_ = this,
      $scope = this_.scope,
      addressSelectionService = this_.addressSelectionService;
    addressSelectionService.getCities(search, lang)
      .then (function (cities) {
      $scope.cities = cities;
    })
      .catch (function (err) {
      console.log(err);
      alertify.alert('Вибачте. Виникла не передбачувана помилка.');
    });
  },
  refreshStreets : function (search, lang){
    var this_ = this,
      $scope = this_.scope,
      addressSelectionService = this_.addressSelectionService;
    if ($scope.city.selected) {
      addressSelectionService.getStreets($scope.city.selected.id, search, lang)
        .then (function (data) {
        if(data != undefined) {
          $scope.street.selected = null;
          $scope.streets = data;
        } else {
          alertify.error("В обраному місті програма не працює");
        }
      })
        .catch (function () {
        alertify.error("Пробачте, виникла непередбачена помилка");
      });
    }
  },
  open : function() {
    var this_ = this,
      $scope = this.scope,
      $rootScope = this.rootScope,
      $state = this.state,
      address = '';
    var userDate = [$scope.city.selected, $scope.street.selected, $scope.address_number_building,
      $scope.address_housing, $scope.selectedBuildingLetter, $scope.address_number_flats,
      $scope.selectedFlatLetters, $scope.address_number_renter];
    this_.userDate=userDate;
    if (!$scope.addressSelecionForm.$invalid) {
      address = 'місто '+ userDate[0].nameUk + ', ' + (userDate[1].streetTypesUk || 'вул') + userDate[1].nameUk + ', буд.' + userDate[2];
      if(userDate[4] != undefined) {
        address += $scope.letters[userDate[4]].value;
      }
      if(userDate[3] != undefined && userDate[3] != "") {
        address +=', корп.' + userDate[3];
      }
      if(userDate[5] != undefined && userDate[5] != "") {
        address +=', кв.' + userDate[5];
      }
      if(userDate[6] != undefined && userDate[6] != "") {
        address += $scope.letters[userDate[6]].value;
      }
      if(userDate[7] != undefined && userDate[7] != "") {
        address += ', наймач:' + userDate[7];
      }
      this_.address = address;
      $rootScope.address = address;
      $rootScope.variables =  {userDate:this_.userDate, address:this_.address};

      $state.go('subscriber./subscriber/pin');
    } else {
      if(userDate[0] == undefined) {
        alertify.alert( "Будь ласка, оберіть місто! ");
      } else if(userDate[1] == undefined) {
        alertify.alert( "Будь ласка, оберіть вулицю! ");
      } else if(userDate[2] == undefined) {
        alertify.alert( "Будь ласка, оберіть номер будинку! ");
      } else {
        alertify.alert( "Будь ласка, введіть коректні данні!");
      }
    }
  }
};


function config($stateProvider){
  $stateProvider
    .state('subscriber.initUser',{
      url: '/init',
      templateUrl: '/assets/user/views/InitialUserPage.html',
      ncyBreadcrumb:{
        skip: true
      },
      controller: addressSelectionCtrl
    })

}

angular.module('userApp')
  .controller('addressSelectionCtrl', ['$scope',  '$state', '$rootScope', '$localStorage', 'addressSelectionService', 'LETTERS',  addressSelectionCtrl])
  .config(config);