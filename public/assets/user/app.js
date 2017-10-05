'use strict';

/**
 * @ngdoc overview
 * @name userApp
 * @description
 * # adminApp
 *
 * Main module of the application.
 */
angular
  .module('userApp', [
    'ui.bootstrap',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.grid',
    'ngStorage',
    'ui.grid.selection',
    'ui.grid.expandable',
    'ui.select',
    'ui.grid.pinning',
    'ui.router',
    'ncy-angular-breadcrumb'
  ])
  .config(function ($httpProvider, $routeProvider, uiSelectConfig,$breadcrumbProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    $httpProvider.interceptors.push(function() {
      return {
        responseError: function(response) {
          if(response.data && response.data.hasOwnProperty('status_code') && response.data.hasOwnProperty('message')) {
            if(TRANSLATIONS[response.data.message]){
              response.data.message = TRANSLATIONS[response.data.message];
            }
            switch (response.data.status_code) {
              case 5000:
              case 5999: alertify.error(response.data.message);break;
              default:  alertify.alert(response.data.message);

            }
          }
          return response;
        },
        response: function(response) {
          if(response.data && response.data.hasOwnProperty('status_code') && response.data.hasOwnProperty('message')) {
            if(TRANSLATIONS[response.data.message]){
              response.data.message = TRANSLATIONS[response.data.message];
            }
           alertify.log(response.data.message);
          }
          return response;
        }
      };
    });
      uiSelectConfig.theme = 'bootstrap';
      $breadcrumbProvider.setOptions({
        prefixStateName: '/home'
      });
  })


