/**
 * Created by newromka on 11.09.15.
 */
'use strict';
function addressSelectionCtrl($scope, $localStorage, $location, $modal, addressSelectionService, GeneratorIdHouseService, LETTERS) {
	this.scope = $scope;
	this.location = $location;
	this.localstorage = $localStorage;
	this.modal = $modal;
	this.addressSelectionService = addressSelectionService;
	$localStorage.idHouse = null;
	$scope.street = {};
	$scope.streets = [];
	$scope.city = [];
	$scope.cities = [];
	$scope.selectedBuildingLetter='00';
	$scope.selectedFlatLetters='00';
	$scope.showAccrualss = angular.bind(this, this.showAccrualss);
	$scope.generatePinCode = angular.bind(this, this.generatePinCode);
	$scope.change = angular.bind(this, this.change);
	$scope.refreshCity = angular.bind(this, this.refreshCity);
	$scope.refreshStreets = angular.bind(this, this.refreshStreets);
	$scope.generateIdHouse = angular.bind(this, this.generateIdHouse);
	this.scope = $scope;
	$scope.storage = $localStorage;
	$scope.renterValid = false;
	$scope.addressObj = {};
	$scope.addressSelectionService = addressSelectionService;
	$scope.GeneratorIdHouseService = GeneratorIdHouseService;
	$scope.letters = LETTERS;
	$scope.renters = [];
	$scope.selectedBuildingLetter = '00';
	$scope.selectedFlatLetters = '00';
	$scope.selectedCity = {};
	addressSelectionService.getCities()
		.then (function (cities) {
		$scope.cities = cities;
	})
		.catch (function (err) {
		console.log(err);
		alertify.alert('Вибачте. Виникла не передбачувана помилка.');
	});


		$scope.getRenters = function() {
			var idHouse = $scope.idHouse.substring(0, 19);
			if(idHouse.length == 19) {
				$http.post('/get/renter/byAddress', {idHouse: idHouse})
					.success(function (data) {
						$scope.renters = data;
					})
					.error(function (err) {
						$scope.renters = [];
					});
			} else {
				alertify.log("Заповнені не всі поля", type, 4);
			}

		};
		$scope.validate = function(){
			$scope.generateIdHouse();
			var this_ = this;
			var renterRegExp = new RegExp('^[0-9]{0,1}$');
			$scope.renterValid = renterRegExp.test(this_.addressSelectionForm.address_number_renter.$viewValue);
		};

}


addressSelectionCtrl.prototype= {
	change : function() {
		var this_ = this;
		var $scope = this.scope;
		this_.addressSelectionService.getStreets($scope.city.selected.id)
			.then (function (data) {
			if(data != undefined) {
				$scope.street.selected = null;
				$scope.streets = data;
			} else {
				alertify.alert("В обраному місті програма не працює");
			}
		})
			.catch (function () {
			alertify.alert("Пробачте, виникла непередбачена помилка");
		})
	}, refreshCity : function (search, lang){
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
					alertify.alert("В обраному місті програма не працює");
				}
			})
				.catch (function () {
				alertify.alert("Пробачте, виникла непередбачена помилка");
			});
		}
	},
	generateIdHouse : function() {
		var this_ = this;
		var addressObj = {};
		var userDate = [this_.scope.city.selected, this_.scope.street.selected, this_.scope.address_number_building,
			this_.scope.address_housing, this_.scope.selectedBuildingLetter, this_.scope.address_number_flats,
			this_.scope.selectedFlatLetters, this_.scope.address_number_renter];
		var idHouse = this_.scope.GeneratorIdHouseService.genereteIdHouse(userDate);
		addressObj = {
			city: userDate[0].nameUk || '',
      streetTypesUk: userDate[1].streetTypesUk || 'вул',
			street: userDate[1].nameUk || '',
			buildingNumber: userDate[2] || '',
			housing: userDate[3] || '',
			buildingLetter: this_.scope.letters[userDate[4]].value || '',
			numberFlat: userDate[5] || '',
			flatLetter: this_.scope.letters[userDate[6]].value || '',
			renter: userDate[7] || ''
		};
    var address = 'м. '+ userDate[0].nameUk + ', вул. ' + userDate[1].nameUk + ', буд.' + userDate[2];
    if(userDate[4] != undefined) {
      address += this_.scope.letters[userDate[4]].value;
    }
    if(userDate[3] != undefined && userDate[3] != "") {
      address +=', корп.' + userDate[3];
    }
    if(userDate[5] != undefined && userDate[5] != "") {
      address +=', кв.' + userDate[5];
    }
    if(userDate[6] != undefined && userDate[6] != "") {
      address += this_.scope.letters[userDate[6]].value;
    }
    if(userDate[7] != undefined && userDate[7] != "") {
      address += ', наймач:' + userDate[7];
    }
		this_.scope.idHouse = idHouse;
		this_.scope.storage.addressObj = addressObj;
		this_.scope.storage.address = address;
		this_.scope.storage.idHouse = idHouse;
	},
	showAccrualss : function() {
		var this_ = this,
			$scope = this_.scope;
		this_.generateIdHouse();
		var idHouseRegExp = new RegExp('^[0-9]{20,20}$');
		if(idHouseRegExp.test(this_.localstorage.idHouse)) {
			this_.location.path('/accruals');
		} else {
			alertify.alert("Не вірно введена адреса");
		}
	},
	generatePinCode : function() {
		var this_ = this,
			$scope = this_.scope;
		var idHouseRegExp = new RegExp('^[0-9]{20,20}$');
		this.generateIdHouse();
		if(idHouseRegExp.test($scope.storage.idHouse)) {
			this_.modal.open({
				backdrop: 'static',
				templateUrl: '/assets/employee/views/modals/PassportData.html',
				controller: 'PassportDataCtrl',
				resolve: {
					variables: function() {
						return {idHouse: $scope.storage.idHouse, addressObj: $scope.storage.addressObj};
					}
				}
			})
		} else {
			alertify.alert("Не вірно введена адреса");
		}
	}
};

function config($routeProvider){
	$routeProvider
		.when('/pin',{
			templateUrl: '/assets/employee/views/AddressSelection.html',
			controller : addressSelectionCtrl
		})
		.when('/address',{
			templateUrl: '/assets/employee/views/AddressSelection.html',
			controller : addressSelectionCtrl
		})
}

angular.module('employeeApp')
	.controller('addressSelectionCtrl', addressSelectionCtrl)
	.config(config);