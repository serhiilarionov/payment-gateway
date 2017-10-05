'use strict';

function editableCombobox() {
    return {
      templateUrl: "/assets/user/views/EditableCombobox.html",
      replace: true,
      scope: {
        options: '='
      },
      restrict:'E',
      controller: function($scope, $http, $parse) {
      },
      compile: function compile(templateElement, templateAttrs) {
        return {
          pre: function preLink(scope, iElement, iAttrs, controller) {
            scope.$watchCollection('options', function(options, renters, objectEquality) {
              if(options) {
                templateElement[0].innerHTML = "";
                templateElement.combobox('clearElement');
                templateElement.combobox('clearTarget');
                options.forEach(function (option) {
                  templateElement.prepend('<option value="' + option.id + '">' + option.name + '</option>');
                });
                templateElement.combobox();
                templateElement.combobox('refresh');
              }
              if(templateElement[0].selectedOptions.length) {
                objectEquality.$parent.selectedRenter = {
                  id: templateElement[0].selectedOptions[0].value,
                  value: templateElement[0].selectedOptions[0].innerHTML
                };
              }
            });
          },
          post: function postLink(scope, iElement, iAttrs, controller) {

          }
        };
      },
      link: function (scope, element, attrs) {

      }
    }
  }

angular.module('userApp')
  .directive("editableCombobox", editableCombobox);