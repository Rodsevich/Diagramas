'use strict';

/**
 * @ngdoc function
 * @name diagramasApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the diagramasApp
 *
 *   angular.element($("#panel")).scope()
 */
angular.module('diagramasApp')
    .controller('MainCtrl', ['$scope', 'joint', 'elementosJoint', 'enlacesJoint',
        function ($scope, joint, elementosJoint, enlacesJoint) {
            $scope.elementos = [];
            $scope.modo = '';
            $scope.enlaces = [];
            $scope.diagrama = new joint.dia.Graph();
            $scope.conectorElegido = '';
            $scope.papel_diagrama = new joint.dia.Paper({
                el: $('#hoja'),
                width: $('#hoja').width(),
                height: $('#hoja').height() + 200,
                model: $scope.diagrama,
                gridSize: 1
            });

            $scope.onDropComplete = function (elemento, evt) {
                //		console.log("drop success, data:", data);
                //		console.log("drop success, evt:", evt);
                var posX = evt.tx - $scope.papel_diagrama.el.offsetLeft - parseInt($scope.papel_diagrama.$el.css('padding-left'), 10);
                var posY = evt.ty - $scope.papel_diagrama.el.offsetTop - parseInt($scope.papel_diagrama.$el.css('padding-top'), 10);

                var elem = elemento.clone();
                //		console.log("Hay q posicionar esto en x: ", posX, " y: ", posY);
                elem.translate(posX, posY);
                $scope.diagrama.addCell(elem);
            };

            $scope.figuras = []; //Todo lo que pongo en esta variable va a aparecer en el panel como elemento agregable al diagrama
            var i = 0;
            for (var elem in elementosJoint) {
                if (elem == "Comienzo" || elem == "Fin") {
                    $scope.elementos[elem] = new elementosJoint[elem]({
                        size: {
                            width: 20,
                            height: 20
                        }
                    });
                } else {
                    $scope.elementos[elem] = new elementosJoint[elem]({
                        name: elem,
                        attributes: ["atributos[] :String"],
                        methods: ['+ getAlgo():Type', '+ setAlgo():Type'],
                    });
                }
                //console.log($scope.elementos[elem]);
                $scope.diagrama.addCell($scope.elementos[elem]);
                $scope.figuras[i] = $scope.papel_diagrama.findViewByModel($scope.elementos[elem]).$el.clone();
                $scope.figuras[i++].id = joint.util.uuid();
            }
            $scope.conectores = []; //Todo lo que pongo en esta variable va a aparecer en el panel como conector de elementos del diagrama
            i = 0;
            for (var enlace in enlacesJoint) {
                $scope.enlaces[enlace] = new enlacesJoint[enlace]({
                    source: {
                        x: 10,
                        y: 50
                    },
                    target: {
                        x: 110,
                        y: 50
                    },
                    vertices: [{
                        x: 40,
                        y: 20
                    }, {
                        x: 70,
                        y: 80
                    }]
                });
                $scope.enlaces[enlace].label(0, {
                    position: .5,
                    attrs: {
                        rect: {
                            fill: 'white'
                        },
                        text: {
                            fill: 'black',
                            text: enlace
                        }
                    }
                });
                $scope.diagrama.addCell($scope.enlaces[enlace]);
                $scope.conectores[i] = $scope.papel_diagrama.findViewByModel($scope.enlaces[enlace]).$el.clone();
                $scope.conectores[i].indice = i;
                $scope.conectores[i++].id = joint.util.uuid();
//                console.log($scope.conectores[i-1]);
            }
            $scope.seleccionarConector = function(conector){
                conector = conector.indice;
                console.log($("#conector" + conector)[0].classList);
                if($scope.conectorElegido != ''){
                    $("#conector" + $scope.conectorElegido)[0].classList = [];
                    if($scope.conectorElegido != conector){
                        $scope.conectorElegido = conector;
                        $("#conector" + $scope.conectorElegido)[0].classList.add("elegido");
                    }else
                        $scope.conectorElegido = '';
                }else{
                    $scope.conectorElegido = conector;
                    $("#conector" + $scope.conectorElegido)[0].classList.add("elegido");
                }
            }
            $scope.papel_diagrama.on('cell:pointerdblclick', function (cellView, evt, x, y) {
                switch ($scope.modo) {
                case 'borrado':
                    //console.log("borrar ", cellView, "con evento: ", evt, "En la pos: ", x, y);
                    $scope.diagrama.getCell(cellView.model.id).remove();
                    break;
                case 'enlace':
                    //			console.log("enlazar ", cellView, "con evento: ", evt, "En la pos: ", x, y);

                    if ($scope.enlaceAux) {
                        var enlace = $scope.enlaces.estandar.clone();
                        enlace.set('source', {
                            id: $scope.enlaceAux.model.id
                        });
                        enlace.set('target', {
                            id: cellView.model.id
                        });
                        $scope.diagrama.addCell(enlace);
                        $scope.enlaceAux.unhighlight();
                        $scope.enlaceAux = undefined;
                    } else {
                        $scope.enlaceAux = cellView;
                        cellView.highlight();
                    }

                    break;
                default:
                    //console.log("Editar atributos del elemento: ", cellView);
                    var textos = $('#' + cellView.id + ' text');
                    //console.log('Meter editores para los textos.. ', textos);
                    for (var i = 0; i < textos.length; i++) {
                        var texto = textos[i];
                        console.log(texto);
                        var editor = document.createElement('textarea');
                        /*var editor = document.createElement('input');
			    editor.setAttribute('type', 'text');*/
                        var estilo = editor.style;
                        $('body').append(editor);
                        var medidas = texto.getBoundingClientRect();
                        console.log(medidas);
                        console.log(editor);
                        estilo.position = 'absolute';
                        estilo.top = parseInt(medidas.top) + "px";
                        estilo.left = parseInt(medidas.left) + "px";
                        estilo.height = parseInt(medidas.height) + "px";
                        estilo.fontSize = texto.attributes["font-size"].nodeValue + 'px';
                        editor.rows = 1;
                        estilo.width = parseInt(medidas.width + 30) + "px";
                        estilo.padding = 0;
                        editor.value = $scope.diagrama.getCell(cellView.model.id).attr('text/text');
                        editor.focus();
                        editor.setSelectionRange(0, editor.textLength);
                        editor.referenciaTexto = texto;
                        editor.referenciaCell = $scope.diagrama.getCell(cellView.model.id);
                        editor.onblur = (function (evt) {
                            console.log(this, evt);
                            //                    this.referenciaTexto.innerHTML = this.value;
                            this.referenciaCell.attr('text/text', this.value);
                            this.id = 'sacame'
                            $('#sacame').remove();
                        });
                        editor.onkeypress = function (evt) {

                            }
                            //console.log(texto);

                    }
                }
            });

            /*function mostrar(elem){
            console.log(elem.getClientRects());
            var DOMRect = elem.getBoundingClientRect();
            var div = document.createElement("div");
            div.style.top = DOMRect.top + 'px';
            div.style.left = DOMRect.left + 'px';
            div.style.width = DOMRect.width + 'px';
            div.style.height = DOMRect.height + 'px';
            div.style.position = 'absolute';
            div.style.border = '1px black solid';
            $("body").append(div);
        }*/

            document.getElementById('files').addEventListener('change',
                function (evt) {
                    console.log(evt);
                    var files = evt.target.files; // FileList object
                    // Loop through the FileList and render image files as thumbnails.
                    for (var i = 0, f; f = files[i]; i++) {
                        var reader = new FileReader();

                        reader.onload = (function (theFile) {
                            return function (e) {
                                console.log(e.target.result);
                                $scope.diagrama.fromJSON(JSON.parse(e.target.result));
                            }
                        })(f);
                        reader.readAsText(f);
                    }
                }, false);
            $scope.importar = function () {
                alert('importa traqnuilo ;) ');
            }
            $scope.exportar = function () {
                console.log($scope.diagrama.toJSON());
                console.log(JSON.stringify($scope.diagrama.toJSON()));
                var pom = document.createElement('a');
                //              pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify($scope.diagrama.toJSON())));
                pom.href = window.URL.createObjectURL(new Blob([encodeURIComponent(JSON.stringify($scope.diagrama.toJSON()))], {
                    type: 'text/json'
                }));
                pom.setAttribute('download', "diagrama.json");
                document.body.appendChild(pom);
                pom.click();
                document.body.removeChild(pom);
            }
            $scope.papel_diagrama.el.addEventListener('mousedown', function (evt) {
                if ($scope.modo !== '') { //	Evita que se empiece a mover nada
                    evt.stopPropagation(); //porque el modo actual no lo permite
                }
            }, true);
            $scope.diagrama.clear();
 }]); //angular.element($("#panel")).scope().papel_panel.findViewByModel(angular.element($("#panel")).scope().elementos[0]).$el
//$("#v-2").append(angular.element($("#panel")).scope().papel_diagrama.findViewByModel(angular.element($("#panel")).scope().elementos[0]).$el.clone())