'use strict';

/**
 * @todo: Описать диррективу addressSelection
 * @returns {{templateUrl: string, replace: boolean, scope: {}, restrict: string, controller: Function, link: Function}}
 */
function addressSelection() {
    return {
      templateUrl: "/assets/user/views/AddressSelection.html",
      replace: true,
      scope: {},
      restrict:'E',
      controller: 'addressSelectionCtrl',
      link: function($scope, element, attrs) {
      }
    }
  }

angular.module('userApp')
  .directive("addressSelection", addressSelection);