/**
 * Created by newromka on 11.09.15.
 */
'use strict';

function mainCtrl($scope, $location) {
	this.scope = $scope;
	this.location = $location;
	$scope.logOut = angular.bind(this, this.logOut);
	$scope.auth = angular.bind(this, this.auth);
	$scope.isActive = angular.bind(this, this.isActive);
	$scope.getClass = angular.bind(this, this.getClass);

/*	AuthentificationService.isAuth()
		.then(function(data) {
			$scope.isAuth = data;
		});*/
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
	}
}
mainCtrl.resolve = {}

function config() {
}


angular.module('adminApp')
	.controller('mainCtrl', mainCtrl)
	.config(config);