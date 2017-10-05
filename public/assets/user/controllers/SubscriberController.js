'use strict';

function subscriberCtrl($scope, $localStorage, $location, $state) {
	this.scope = $scope;
	this.location = $location;
	this.localstorage = $localStorage;
	$scope.logOut = angular.bind(this, this.logOut);
	$scope.auth = angular.bind(this, this.auth);
	$scope.isActive = angular.bind(this, this.isActive);
	$scope.getClass = angular.bind(this, this.getClass);
	$location.href = '/#/subscriber/init';
}

subscriberCtrl.prototype= {
	logOut: function () {
		var this_ = this;
		delete this_.localstorage.address;
		delete this_.localstorage.idHouse;
		delete this_.localstorage.userDate;
	},
	auth: function () {
		var this_ = this;
		if (this_.localstorage.idHouse) {
			return(false)
		} else {
			return(true);
		}
	},
	isActive : function (viewLocation) {
		var this_ = this;
		var active = (viewLocation === this_.location.path());
		return active;
	}
}
subscriberCtrl.resolve = {}

function config( $stateProvider) {

}


angular.module('userApp')
	.controller('subscriberCtrl',['$scope', '$localStorage', '$location', '$state', subscriberCtrl])
	.config(config);