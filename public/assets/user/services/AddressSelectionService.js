/**
 * Created by newromka on 10.09.15.
 */
'use strict';
angular.module('userApp')
	.service('addressSelectionService', function ($http, $q) {
		this.getCities = function (search, lang) {
			var deferred = $q.defer();
			$http.get('/cities/all/?search='+search+'&lang='+lang)
				.success(function (data) {
					deferred.resolve(data);
				})
				.error(function (err) {
					deferred.reject(err);
				});
			return deferred.promise;
		};
		this.getStreets = function (cityId, search, lang) {
			var deferred = $q.defer();
			$http.get('/streets/search/?&cityId='+cityId+'&search='+search+'&lang='+lang+'')
				.success(function (data) {
					deferred.resolve(data);
				})
				.error(function (err) {
					deferred.reject(err);
				});
			return deferred.promise;
		};
	});
