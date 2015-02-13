'use strict';

/**
 * @ngdoc directive
 * @name diagramasApp.directive:conector
 * @description
 * # conector
 */
angular.module('diagramasApp')
    .directive('conector', function () {
        return {
            template: '<svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="120px" height="90px" id="conector{{indice}}"></svg>',
            restrict: 'E',
            scope: {
                conector: '=',
                seleccionarConector: '&funcionConectora',
                indice: '@'
            },
            link: function postLink(scope, element, attrs) {
                element.children().append(angular.element(scope.conector));
                var nodos = element.children().children()[0].childNodes;
                nodos[7].remove();
                nodos[6].remove();
                nodos[5].remove();
                scope.elegido = false;
                element.on("click", function (evt) {
                    scope.elegido = !scope.elegido;
                    if (scope.elegido) {
//                        angular.element(scope.conector)[0].parentNode.classList.add("elegido");
                        scope.seleccionarConector(scope.indice);
                    } else {
                        scope.seleccionarConector('');
                    }
                });
            }
        };
    });