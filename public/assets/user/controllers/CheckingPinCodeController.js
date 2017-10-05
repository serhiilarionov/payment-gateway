function CheckingPinCodeCtrl($scope, $http, $location, $rootScope, GeneratorIdHouseService, $localStorage, $state) {
	$scope.GeneratorIdHouseService = GeneratorIdHouseService;
	this.scope = $scope;
	this.rootScope = $rootScope;
  $scope.address = this.rootScope.address;
  this.http = $http;
  this.location = $location;
  this.storage = $localStorage;
  this.scope.submit = angular.bind(this, this.submit);
  this.state = $state;
}
CheckingPinCodeCtrl.prototype = {
	submit: function () {
		var this_ = this;
		if (!this_.scope.checkingPinCodeForm.$invalid) {
			this_.scope.idHouse = this_.scope.GeneratorIdHouseService.genereteIdHouse(this_.rootScope.variables.userDate);

			this_.http({method: 'POST', url: '/user/check/pinCode',
				data: {idHouse :this_.scope.idHouse, pin_code :this_.scope.pin_code}})
				.success(function (data, res) {

					if(res == 200) {
						this_.storage.address = this_.rootScope.address;
						this_.storage.idHouse = this_.scope.idHouse;
						this_.storage.userDate = this_.rootScope.variables.userDate;
						this_.state.go('subscriber./accrual/amounts');
					}
				});

		} else {
			alertify.alert("Некоректно введений пін код");
		}
	}
};

function config($stateProvider){
	$stateProvider.state('subscriber./subscriber/pin',{
		url: '/init',
		templateUrl: '/assets/user/views/PinCode.html',
		ncyBreadcrumb:{
			skip: true
		}
	})
}

angular.module('userApp')
	.controller('CheckingPinCodeCtrl', CheckingPinCodeCtrl)
	.config(config);
