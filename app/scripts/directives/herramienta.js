'use strict';

/**
 * @ngdoc directive
 * @name diagramasApp.directive:herramienta
 * @description
 * # herramienta
 */
angular.module('diagramasApp')
    .directive('herramienta', ["$compile", function ($compile) {
        return {
            template: '<img src="{{imagen}}" activo="{{modo == operacion}}"></img><span data-tooltip aria-haspopup="true" class="has-tip" title="Hace doble click sobre los elementos">{{operacion | capitalize}}</span></div>',
            restrict: 'E',
            scope: {
                operacion: '@',
                imagen: '@',
                modo: '=varModo'
            },
            link: function preLink(scope, element, attrs) {
                //	  console.log("scope", scope);
                //	  console.log("element", element);
                //	  console.log("attrs", attrs);
                //	  var modo = "modo" + attrs.operacion.substr(0,1).toUpperCase() + attrs.operacion.substr(1);
                //	  element.children().attr("src", attrs.imagen);
                //	  element.children().attr("ng-attr-activo", "{{" + modo + "}}");
                //			console.log("Operacion: ", scope.imagen);
                //			console.log("Operacion: ", scope.operacion);
                //			console.log("Modo: ", scope.modo);
                element.children().on("click", function (event) {
                    scope.$apply(function () {
                        scope.modo = scope["modo"] == scope.operacion ? '' : scope.operacion;
                        //				console.log(scope.modo);
                    })
                });
                //			$compile(element.children());
            }
        };
     }]);