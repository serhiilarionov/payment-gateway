'use strict';

/**
 * @param $scope
 * activeMenu назначает активным элемент бокового меню
 * auth проверяет наличие коректного idhouse и picode
 */
function mainCtrl($scope, $localStorage, $location, $state, AuthentificationService) {
	this.scope = $scope;
	this.location = $location;
	this.localstorage = $localStorage;
	$scope.logOut = angular.bind(this, this.logOut);
	$scope.auth = angular.bind(this, this.auth);
	$scope.isActive = angular.bind(this, this.isActive);
	$scope.getClass = angular.bind(this, this.getClass);
	$state.go('/home');
	AuthentificationService.isAuth()
		.then(function(data) {
			$scope.isAuth = data;
	});
}

mainCtrl.prototype= {
	isActive : function (viewLocation) {
		var this_ = this;
		var active = (viewLocation === this_.location.path());
		return active;
	},
	getClass : function (path) {
		var this_ = this;
		if (this_.location.path().substr(0, path.length) === path) {
			return 'active';
		} else {
			return '';
		}
	},
	isAuth : {

	}
};

mainCtrl.resolve = {};

function config ($stateProvider){
	$stateProvider.state('/home',{
		url: '/',
		templateUrl: '/assets/user/views/home.html',
		ncyBreadcrumb:{
			label:  'Головна'
		},
		controller: 'mainCtrl',
		resolve: mainCtrl.resolve
	});
	$stateProvider.state('subscriber',{
		url: '/subscriber',
		templateUrl: '/assets/user/views/Subscriber.html',
		ncyBreadcrumb:{
			label:  'Абонент'
		},
		controller : subscriberCtrl
	});
  $stateProvider.state('subscriber./payments/online',{
    url: '/payments/online',
    templateUrl: '/assets/user/views/PaymentOnline.html',
    ncyBreadcrumb:{
      label: 'Історія платежів online'
    },
    controller: 'PaymentOnlineCtrl',
    resolve: PaymentOnlineCtrl.resolve
  })
}
angular.module('userApp')
	.controller('mainCtrl', mainCtrl)
  .config(config);