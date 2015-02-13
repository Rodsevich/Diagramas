'use strict';

/**
 * @ngdoc directive
 * @name diagramasApp.directive:figura
 * @description
 * # figura
 */
angular.module('diagramasApp')
    .directive('figura', function () {
        return {
            template: '<svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="120px"></svg>',
            restrict: 'E',
            scope: {
                figura: '=figura'
            },
            link: function postLink(scope, element, attrs) {
                //	  console.log("scope", scope);
                //	  console.log("element", element);
                //	  console.log("attrs", attrs);
                element.children().append(angular.element(scope.figura));
                element.attr("ng-drag", true);
                
            }
        };
    });