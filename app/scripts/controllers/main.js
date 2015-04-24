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
            $scope.elementos = {};
            $scope.modo = '';
            $scope.enlaces = [];
            $scope.diagrama = new joint.dia.Graph();
            $scope.conectorElegido = '';
            $scope.papel_diagrama = new joint.dia.Paper({
                el: $('#hoja'),
                width: $('#hoja').width(),
                height: $('#hoja').height(),
                model: $scope.diagrama,
                linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
                gridSize: 1
            });

            $scope.onDropComplete = function (elemento, evt) {
                //		console.log("drop success, data:", data);
                //		console.log("drop success, evt:", evt);
                var posX = evt.tx - $scope.papel_diagrama.el.offsetLeft - parseInt($scope.papel_diagrama.$el.css('padding-left'), 10);
                var posY = evt.ty - $scope.papel_diagrama.el.offsetTop - parseInt($scope.papel_diagrama.$el.css('padding-top'), 10);
//                console.log(elemento);
                var elem = elemento.clone();
//                console.log("Hay q posicionar esto en x: ", posX, " y: ", posY);
                elem.translate(posX , posY);
                $scope.diagrama.addCell(elem);
                elem.toFront();
            };

            $scope.figuras = []; //Todo lo que pongo en esta variable va a aparecer en el panel como elemento agregable al diagrama
            var i = 0;
            for (var elem in elementosJoint) {
                //Arreglando aca
                $scope.elementos[elem] = new elementosJoint[elem]();
                $scope.elementos[elem].set('inPorts', ['in1','in2']);
                $scope.elementos[elem].set('outPorts', ['out']);
                $scope.elementos[elem].set($scope.elementos[elem].editables[0], elem);
                $scope.diagrama.addCell($scope.elementos[elem]);
                var BBox = $scope.elementos[elem].findView($scope.papel_diagrama).getBBox();
//                console.log(BBox);
                var transX = Math.abs(BBox.x) + 2;
                var transY = Math.abs(BBox.y) - 2;
                //Transladar segun los valores de BBox
                $scope.elementos[elem].translate(transX, transY);
                $scope.figuras[i] = $scope.papel_diagrama.findViewByModel($scope.elementos[elem]).$el.clone();
                $scope.figuras[i].id = joint.util.uuid();
                $scope.figuras[i].ancho = BBox.width;
                $scope.figuras[i].alto = BBox.height;
//                $scope.elementos[elem].transX = transX;
//                $scope.elementos[elem].transY = transY;
                $scope.figuras[i++].referenciaElemento = $scope.elementos[elem];
            }
            $scope.conectores = []; //Todo lo que pongo en esta variable va a aparecer en el panel como conector de elementos del diagrama
            i = 0;
            for (var enlace in enlacesJoint) {
                $scope.enlaces[enlace] = new enlacesJoint[enlace]({
                    source: {x: 10,y: 50},
                    target: {x: 110,y: 50},
                    vertices: [{x: 40,y: 20}, {x: 70,y: 80}]
                });
                $scope.enlaces[enlace].label(0, {
                    position: .5,
                    attrs: {
                        rect: {fill: 'white'},
                        text: {fill: 'black',text: enlace}
                    }
                });
                $scope.diagrama.addCell($scope.enlaces[enlace]);
                $scope.conectores[i] = $scope.papel_diagrama.findViewByModel($scope.enlaces[enlace]).$el.clone();
                $scope.conectores[i].indice = i;
                $scope.conectores[i].nombre = enlace;
                $scope.conectores[i++].id = joint.util.uuid();
//                console.log($scope.conectores[i-1]);
            }
            $scope.seleccionarConector = function(conector){
                conector = conector.indice;
//                console.log($("#conector" + conector)[0].classList);
                if($scope.conectorElegido !== ''){
                    $("#conector" + $scope.conectorElegido)[0].classList.remove("elegido");;
                    if($scope.conectorElegido != conector){
                        $scope.conectorElegido = conector;
                        $("#conector" + $scope.conectorElegido)[0].classList.add("elegido");
                        $scope.modo = 'enlace';
                    }else{
                        $scope.modo = '';
                        $scope.conectorElegido = '';
                    }
                }else{
                    $scope.conectorElegido = conector;
                    $("#conector" + $scope.conectorElegido)[0].classList.add("elegido");
                    $scope.modo = 'enlace';
                }
//                console.log($scope.modo, $scope.conectorElegido);
            }
//            $scope.elemFoco = null;
//            $scope.papel_diagrama.on('cell:pointerclick', function (cellView, evt) {
//                $scope.elemFoco = $scope.diagrama.getCell(cellView.model.id);
//                console.log(evt);
//            });
//            $scope.papel_diagrama.on('cell:mouseout', function (cellView, evt) {
//                $scope.elemFoco = null;
//                console.log(evt);
//            });
            document.onkeypress = function (e) {
//                console.log(e);
                if($scope.elemFoco != null){
                    e = e || window.event;
                    var elem = $scope.diagrama.getCell($scope.elemFoco.model.id);
                    var tamanios = elem.getBBox();
                    var tamanio_cambio = (e.shiftKey) ? 10 : 1;
                    // use e.keyCode
                    if(e.key == '+' || e.charCode == 43){
                        elem.resize(tamanios.width + tamanio_cambio,tamanios.height + tamanio_cambio);
                    }
                    if(e.key == '-' || e.charCode == 45){
                        elem.resize(tamanios.width - tamanio_cambio,tamanios.height - tamanio_cambio);
                    }
                }
            };

            $scope.papel_diagrama.on('blank:pointerclick', function (cellView, evt, x, y) {
                if($scope.elemFoco != null){
                    $scope.elemFoco.unhighlight();
                    $scope.elemFoco = null;
                }
            });
            
            $scope.papel_diagrama.on('cell:pointerclick', function (cellView, evt, x, y) {
                if(evt.ctrlKey){
                    if($scope.elemFoco == null){
                        $scope.elemFoco = cellView;
                        cellView.highlight();
                    }else{
                        $scope.elemFoco.unhighlight();
                        if($scope.elemFoco == cellView)
                            $scope.elemFoco = null;
                        else{
                            cellView.highlight();
                            $scope.elemFoco = cellView;
                        }
                    }
                }
//                $scope.diagrama.getCell(cellView.model.id).resize(width, height);
                
            });
            $scope.papel_diagrama.on('cell:pointerdblclick', function (cellView, evt, x, y) {
                switch ($scope.modo) {
                case 'borrado':
                    //console.log("borrar ", cellView, "con evento: ", evt, "En la pos: ", x, y);
                    $scope.diagrama.getCell(cellView.model.id).remove();
                    break;
                case 'enlace':
                    //			console.log("enlazar ", cellView, "con evento: ", evt, "En la pos: ", x, y);
//                        console.log($scope.conectores[$scope.conectorElegido].nombre);
                    if ($scope.enlaceAux) {
                        var enlace = new enlacesJoint[$scope.conectores[$scope.conectorElegido].nombre]();
                        enlace.set('source', {
                            id: $scope.enlaceAux.model.id
                        });
                        enlace.set('target', {
                            id: cellView.model.id
                        });
                        $scope.diagrama.addCell(enlace);
                        $scope.enlaceAux.unhighlight();
                        $scope.enlaceAux = undefined;
                        $scope.modo = '';
                    } else {
                        $scope.enlaceAux = cellView;
                        cellView.highlight();
                    }

                    break;
                default:
                    //console.log("Editar atributos del elemento: ", cellView);
                        
//                    var editables = $('#' + cellView.id + ' text');
                    var elem = $scope.diagrama.getCell(cellView.model.id);
                    var pathEdicion = elem.editables;
                    window.elem = elem;
                    window.vista = cellView;
//                    console.log(elem, vista, evt, x, y);
                    for (var i = 0; i < pathEdicion.length; i++) {
                        var editando = cellView.$(elem.editablesRenderizadosEnVista[i]);
                        if (editando.length != 1){
                            console.error(elem.attributes.type + ".editablesRenderizadosEnVista esta mal definido");
                            break;
                        }
                        editando = editando[0];
//                        console.log(editando);
                        /*var editor = document.createElement('input');
			    editor.setAttribute('type', 'text');*/
                        var editor = document.createElement('textarea');
                        var estilo = editor.style;
                        $('body').append(editor);

                        var medidas = editando.getBoundingClientRect();
                        estilo.position = 'absolute';
                        estilo.top = parseInt(medidas.top) + "px";
                        estilo.left = parseInt(medidas.left) + "px";
                        estilo.height = parseInt(medidas.height) + "px";
                        estilo.fontSize = editando.attributes["font-size"].nodeValue + 'px';
//                        editor.rows = 1;
                        estilo.width = parseInt(medidas.width + 30) + "px";
                        estilo.padding = 0;
                        editor.value = editando.textContent;
//                        editor.focus();
//                        editor.setSelectionRange(0, editor.textLength);
                        editor.referenciaCell = elem;
                        editor.referenciaEditable = pathEdicion[i];
                        editor.classList.add("volame");
                        editor.onblur = (function (evt) {
                            this.referenciaCell.set(this.referenciaEditable, this.value);
                            this.id = 'sacame';
                            $('#sacame').remove();
                        });
                        editor.onfocus = function (evt) {
                            this.classList.remove("volame");
//                            console.log(this);
                            $('.volame').remove();
                        }
                            //console.log(editando);
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
                    var files = evt.target.files; // FileList object
                    // Loop through the FileList and render image files as thumbnails.
                    for (var i = 0, f; f = files[i]; i++) {
                        var reader = new FileReader();

                        reader.onload = (function (theFile) {
                            return function (e) {
                                var datos = JSON.parse(e.target.result);
                                $scope.diagrama.fromJSON(datos);
                                $scope.enlaces = datos.enlaces;
                                console.log($scope.enlaces);
                            }
                        })(f);
                        reader.readAsText(f);
                    }
                }, false);
            $scope.importar = function () {
                alert('importa traqnuilo ;) ');
            }
            $scope.exportar = function () {
                var data = $scope.diagrama.toJSON();
                //Agregamos los links de los ports al JSON
                data.enlaces = $scope.enlaces;
                var texto = JSON.stringify(data);

                var pom = document.createElement('a');
                pom.href = window.URL.createObjectURL(new Blob([texto], {
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
            
            window.enlaces = $scope.enlaces = {};
            $scope.diagrama.on("add", function(cell){
               if(cell.attributes.type == "link"){
                   $scope.enlaces[cell.id] = '';
               }
            });
            $scope.diagrama.on("remove", function(cell){
               if(cell.attributes.type == "link"){
                   delete $scope.enlaces[cell.id];
               }
            });
            $scope.diagrama.on('change:source change:target', function(link) {
                var target = link.get('target');
                if( target.id ){
                    var source = link.get('source');
                    var sourcePort = source.port;
                    var sourceNombre = $scope.diagrama.getCell(source.id).attr('.label/text');
                    var targetPort = link.get('target').port;
                    var targetNombre = $scope.diagrama.getCell(target.id).attr('.label/text');
                    var desde = sourceNombre + '.' + sourcePort;
                    var hasta = targetNombre + '.' + targetPort;
                    $scope.enlaces[link.id] = {
                        textual: desde + " --> " + hasta,
                        logico: source.id + " --> " + target.id
                    };
//                    console.log(JSON.stringify($scope.enlaces));
//                    console.log($scope.enlaces);
//                    console.log(desde,hasta);
                }
            });
            window.escope = $scope;
 }]); //angular.element($("#panel")).scope().papel_panel.findViewByModel(angular.element($("#panel")).scope().elementos[0]).$el
//$("#v-2").append(angular.element($("#panel")).scope().papel_diagrama.findViewByModel(angular.element($("#panel")).scope().elementos[0]).$el.clone())