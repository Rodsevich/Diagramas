'use strict';

angular.module('diagramasApp')
    .directive('operacion', [function () {
        return {
            template: '<div id="{{ tipo == \'importar\' ? \'file-image\' : \'\'}}"><input type="file" required accept="application/json"><img src="{{imagen || \'images/\' + tipo + \'.png\'}}"></img><span>{{tipo | capitalize}}</span></div>',
            restrict: 'E',
            scope: {
                tipo: '@',
                imagen: '@'
            },
            controller: ['$scope', function ($scope) {
                if (!$scope.$parent.exportar || !$scope.$parent.exportar) throw new Error('La directiva "operacion" deberia ser usada sobre el ambito del $scope que contenga las variables del diagrama');
                $scope.importar = function (eventoChangeDelInput) {
                    var archivo = eventoChangeDelInput.target.files[0];
                    var lector = new FileReader;
                    lector.onload = function () {
                        return function (archivo) {
                            var datos = JSON.parse(archivo.target.result);
                            $scope.$parent.diagrama.fromJSON(datos),
                                $scope.$parent.enlaces = datos.enlaces,
                                console.log($scope.$parent.enlaces)
                        }
                    }(archivo);
                    lector.readAsText(archivo)
                };
                $scope.exportar = function () {
                    var datos = $scope.$parent.diagrama.toJSON();
                    datos.enlaces = $scope.$parent.enlaces;
                    var datos = JSON.stringify(datos),
                        disparador = document.createElement('a');
                    disparador.href = window.URL.createObjectURL(new Blob([datos], {
                            type: 'text/json'
                        })),
                        disparador.setAttribute('download', 'diagrama.json'),
                        document.body.appendChild(disparador),
                        disparador.click(),
                        document.body.removeChild(disparador)
                }
            }],
            link: function ($scope, elemento) {
                var tagInput = elemento.find('input');
                switch ($scope.tipo) {
                case 'importar':
                    tagInput.on('change', $scope.importar);
                    break;
                case 'exportar':
                    tagInput.remove(),
                        elemento.on('click', $scope.exportar)
                }
            }
        }
    }]);