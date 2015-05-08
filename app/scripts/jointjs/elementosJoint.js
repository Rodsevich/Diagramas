'use strict';

angular.module('diagramasApp')
    .factory('elementosJoint', ['joint', function (joint) {
        joint.shapes.elementos = {};
        if (!joint.shapes.uml)
            joint.shapes.uml = {};
        joint.shapes.uml.Class = joint.shapes.basic.Generic.extend({

            markup: [
        '<g class="rotatable">',
          '<g class="scalable">',
            '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect"/><rect class="uml-class-methods-rect"/>',
          '</g>',
          '<text class="uml-class-name-text"/><text class="uml-class-attrs-text"/><text class="uml-class-methods-text"/>',
        '</g>'
    ].join(''),

            defaults: joint.util.deepSupplement({

                type: 'uml.Class',
                size: { width: 100, height: 90 },
                attrs: {
                    rect: {
                        'width': 200
                    },

                    '.uml-class-name-rect': {
                        'stroke': 'black',
                        'stroke-width': 2,
                        'fill': '#3498db'
                    },
                    '.uml-class-attrs-rect': {
                        'stroke': 'black',
                        'stroke-width': 2,
                        'fill': '#2980b9'
                    },
                    '.uml-class-methods-rect': {
                        'stroke': 'black',
                        'stroke-width': 2,
                        'fill': '#2980b9'
                    },

                    '.uml-class-name-text': {
                        'ref': '.uml-class-name-rect',
                        'ref-y': .5,
                        'ref-x': .5,
                        'text-anchor': 'middle',
                        'y-alignment': 'middle',
                        'font-weight': 'bold',
                        'fill': 'black',
                        'font-size': 12,
                        'font-family': 'Times New Roman'
                    },
                    '.uml-class-attrs-text': {
                        'ref': '.uml-class-attrs-rect',
                        'ref-y': 5,
                        'ref-x': 5,
                        'fill': 'black',
                        'font-size': 12,
                        'font-family': 'Times New Roman'
                    },
                    '.uml-class-methods-text': {
                        'ref': '.uml-class-methods-rect',
                        'ref-y': 5,
                        'ref-x': 5,
                        'fill': 'black',
                        'font-size': 12,
                        'font-family': 'Times New Roman'
                    }
                },

                name: [],
                attributes: ["atributos[] :String"],
                methods: ['+ getAlgo():Type', '+ setAlgo():Type'],
            }, joint.shapes.basic.Generic.prototype.defaults),
            //El primer item es el usado para nombrar al elemento
            editables: ['name', 'attributes', 'methods'],
            editablesRenderizadosEnVista: ['.uml-class-name-text/text', '.uml-class-attributes-text/text', '.uml-class-methods-text/text'],

            initialize: function () {

                this.on('change:name change:attributes change:methods', function () {
                    this.updateRectangles();
                    this.trigger('uml-update');
                }, this);

                this.updateRectangles();

                joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
            },

            getClassName: function () {
                return this.get('name');
            },

            updateRectangles: function () {

                var attrs = this.get('attrs');

                var rects = [
                    {
                        type: 'name',
                        text: this.getClassName()
                    },
                    {
                        type: 'attrs',
                        text: this.get('attributes')
                    },
                    {
                        type: 'methods',
                        text: this.get('methods')
                    }
                ];

                var offsetY = 0;

                _.each(rects, function (rect) {

                    var lines = _.isArray(rect.text) ? rect.text : [rect.text];
                    var rectHeight = lines.length * 20 + 20;

                    attrs['.uml-class-' + rect.type + '-text'].text = lines.join('\n');
                    attrs['.uml-class-' + rect.type + '-rect'].height = rectHeight;
                    attrs['.uml-class-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

                    offsetY += rectHeight;
                });
            }

        });

        joint.shapes.uml.ClassView = joint.dia.ElementView.extend({

            initialize: function () {

                joint.dia.ElementView.prototype.initialize.apply(this, arguments);

                this.listenTo(this.model, 'uml-update', function () {
                    this.update();
                    this.resize();
                });
            }
        });

        joint.shapes.uml.Abstract = joint.shapes.uml.Class.extend({

            defaults: joint.util.deepSupplement({
                type: 'uml.Abstract',
                attrs: {
                    '.uml-class-name-rect': {
                        fill: '#e74c3c'
                    },
                    '.uml-class-attrs-rect': {
                        fill: '#c0392b'
                    },
                    '.uml-class-methods-rect': {
                        fill: '#c0392b'
                    }
                }
            }, joint.shapes.uml.Class.prototype.defaults),

            getClassName: function () {
                return ['<<Abstract>>', this.get('name')];
            }

        });
        joint.shapes.uml.AbstractView = joint.shapes.uml.ClassView;

        joint.shapes.uml.Interface = joint.shapes.uml.Class.extend({

            defaults: joint.util.deepSupplement({
                type: 'uml.Interface',
                attrs: {
                    '.uml-class-name-rect': {
                        fill: '#f1c40f'
                    },
                    '.uml-class-attrs-rect': {
                        fill: '#f39c12'
                    },
                    '.uml-class-methods-rect': {
                        fill: '#f39c12'
                    }
                }
            }, joint.shapes.uml.Class.prototype.defaults),

            getClassName: function () {
                return ['<<Interface>>', this.get('name')];
            }

        });
        joint.shapes.uml.InterfaceView = joint.shapes.uml.ClassView;

        // Statechart

        joint.shapes.uml.State = joint.shapes.basic.Generic.extend({

            markup: [
        '<g class="rotatable">',
          '<g class="scalable">',
            '<rect class="uml-state-body"/>',
          '</g>',
          '<path class="uml-state-separator"/>',
          '<text class="uml-state-name"/>',
          '<text class="uml-state-events"/>',
        '</g>'
    ].join(''),

            defaults: joint.util.deepSupplement({

                type: 'uml.State',
                size: { width: 100, height: 90 },
                attrs: {
                    '.uml-state-body': {
                        'width': 200,
                        'height': 200,
                        'rx': 10,
                        'ry': 10,
                        'fill': '#ecf0f1',
                        'stroke': '#bdc3c7',
                        'stroke-width': 3
                    },
                    '.uml-state-separator': {
                        'stroke': '#bdc3c7',
                        'stroke-width': 2
                    },
                    '.uml-state-name': {
                        'ref': '.uml-state-body',
                        'ref-x': .5,
                        'ref-y': 5,
                        'text-anchor': 'middle',
                        'fill': '#000000',
                        'font-family': 'Courier New',
                        'font-size': 14
                    },
                    '.uml-state-events': {
                        'ref': '.uml-state-separator',
                        'ref-x': 5,
                        'ref-y': 5,
                        'fill': '#000000',
                        'font-family': 'Courier New',
                        'font-size': 14
                    }
                },

                name: 'State',
                events: []

            }, joint.shapes.basic.Generic.prototype.defaults),

            initialize: function () {

                this.on({
                    'change:name': this.updateName,
                    'change:events': this.updateEvents,
                    'change:size': this.updatePath
                }, this);

                this.updateName();
                this.updateEvents();
                this.updatePath();

                joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
            },

            updateName: function () {

                this.attr('.uml-state-name/text', this.get('name'));
            },

            updateEvents: function () {

                this.attr('.uml-state-events/text', this.get('events').join('\n'));
            },

            updatePath: function () {

                var d = 'M 0 20 L ' + this.get('size').width + ' 20';

                // We are using `silent: true` here because updatePath() is meant to be called
                // on resize and there's no need to to update the element twice (`change:size`
                // triggers also an update).
                this.attr('.uml-state-separator/d', d, {
                    silent: true
                });
            }

        });

        joint.shapes.uml.StartState = joint.shapes.basic.Circle.extend({

            defaults: joint.util.deepSupplement({

                type: 'uml.StartState',
                size: {
                    width: 20,
                    height: 20
                },
                attrs: {
                    circle: {
                        'fill': '#34495e',
                        'stroke': '#2c3e50',
                        'stroke-width': 2,
                        'rx': 1
                    }
                }

            }, joint.shapes.basic.Circle.prototype.defaults)

        });

        joint.shapes.uml.EndState = joint.shapes.basic.Generic.extend({

            markup: '<g class="rotatable"><g class="scalable"><circle class="outer"/><circle class="inner"/></g></g>',

            defaults: joint.util.deepSupplement({

                type: 'uml.EndState',
                size: {
                    width: 20,
                    height: 20
                },
                attrs: {
                    'circle.outer': {
                        transform: 'translate(10, 10)',
                        r: 10,
                        fill: '#ffffff',
                        stroke: '#2c3e50'
                    },

                    'circle.inner': {
                        transform: 'translate(10, 10)',
                        r: 6,
                        fill: '#34495e'
                    }
                }

            }, joint.shapes.basic.Generic.prototype.defaults)

        });
        
        joint.shapes.elementos.Base = joint.shapes.devs.Model.extend({
           defaults: joint.util.deepSupplement({
               type: 'elementos.Base',
               size: {
                   width: 110,
                   height: 110
               },
               inPorts: [],
               outPorts: [],
               attrs: {
                   '.body': { fill: '#90b42d', rx: 2, ry: 2,
                             magnet: true },
                   '.label': {
                        text: 'Nombrame',
//                        'ref-x': 0.5,
                        'ref-y': 0.5,
//                        'x-alignment': 'middle',
                        'y-alignment': 'middle',
                        fill: '#260b81',
                        'font-size': 22
                    },
                   '.inPorts .port-label': { fill: '#004', 'font-weight':'bold'},
                   '.inPorts rect': { fill: '#f25242' },
                   '.outPorts rect': { fill: '#983126' },
//                   '.inPorts .port-label': {  },
//                   '.outPorts .port-label': {}
               },
               nombre: "Nombrame",
           }, joint.shapes.devs.Model.prototype.defaults),
           //En el primer elemento de 'editables' pone lo que va a servir como nombre del objeto
            editables: ['nombre'],
            editablesRenderizadosEnVista: ['.label'],
            initialize: function(){
                var parent = this.constructor.__super__;
                while(!parent.hasOwnProperty("initialize")){
                    parent = parent.constructor.__super__;
                }
//                parent = parent.constructor.__super__;
                parent.initialize.apply(this, arguments);
                this.on("change:nombre", function(modelo, nuevoValor, opciones){
                    //modelo === this
                    this.attr(".label/text", nuevoValor);
                })
            },
        });
        
        joint.shapes.elementos.Contenedor = joint.shapes.devs.Model.extend({
            portMarkup: '<g class="port port<%= id %>"><rect class="port-body"/><text class="port-label"/></g>',
            moveTool: false,
            defaults: joint.util.deepSupplement({
                type: 'elementos.Contenedor',
                size: {
                   width: 190,
                   height: 100
               },
               inPorts: [],
               outPorts: [],
               attrs: {
                   '.body': { fill: 'rgba(0,0,0,0.04)', rx: 3, ry: 3 },
                   '.label': {
                       text: 'Nombrame',
                       ref: '.body',
                       'ref-x': 10,
                       'ref-y': 2,
                       'x-alignment': 'left',
                       'y-alignment': 'top',
                       'text-anchor': 'left',
                       fill: '#000',
                       'font-size': 22
                    },
                   '.port-body': {
                       magnet: true,
                       stroke: '#000000',
                       height: 20,
                       x: -10, y: -10
                    },
                   //Le agrege en getPortAttrs la ref a sus port-label:
                   '.inPorts .port-body': { fill: 'rgba(240,170,170,1)' },
                   '.outPorts .port-body': { fill: 'rgba(170,240,170,1)' },
//                   '.outPorts .port-label': { x:15 },
                   '.inPorts .port-label': { fill: '#004', 'font-size': 14, 'font-weight':'bold', 'text-anchor': 'start', x:-5, 'ref-y': 5 }
               },
               nombre: "Nombrame",
           }, joint.shapes.devs.Model.prototype.defaults),
           //En el primer elemento de 'editables' pone lo que va a servir como nombre del objeto
            editables: ['nombre'],
            editablesRenderizadosEnVista: ['.label'],
            initialize: function(){
//                joint.shapes.basic.PortsModelInterface.initialize.apply(this, arguments);
                var parent = this.constructor.__super__;
                while(!parent.hasOwnProperty("initialize")){
                    parent = parent.constructor.__super__;
                }
//                parent = parent.constructor.__super__;
                parent.initialize.apply(this, arguments);
                this.on("change:nombre", function(modelo, nuevoValor, opciones){
                    //modelo === this
                    this.attr(".label/text", nuevoValor);
                })
            },
            //Alterar la posicion de los inPorts poniendolos mas abajo, pa q se vea mejor el titulo
            getPortAttrs: function(portName, index, total, selector, type){
                var attrs = joint.shapes.devs.Model.prototype.getPortAttrs.apply(this, arguments);
                if (selector === '.inPorts'){
                    attrs[selector+">.port"+index]['ref-y'] = (index + 0.7) * (1 / total);
                }
                return attrs;
            }
        });
        
        joint.shapes.elementos.BaseView = joint.shapes.devs.ModelView;
        joint.shapes.elementos.ContenedorView = joint.shapes.devs.ModelView.extend({
            update: function(){
                joint.shapes.devs.ModelView.prototype.update.apply(this, arguments);
                //Ajustar el tamaño de los inPorts al de sus labels
                var ports = this.$(".inPorts .port");
//                console.log(ports);
                for(var i = 0; i < ports.length; i++){
                    var body = ports[i].children[0];
                    var label = ports[i].children[1];
                    body.setAttribute("width", label.getBBox().width + 10);
                };
//                this.model.attr(".label/x", ports[0].children[0].getAttribute("width"));
            }
        });

        return {
            Proceso: joint.shapes.elementos.Base,
            Contenedor: joint.shapes.elementos.Contenedor,
//            Comienzo: joint.shapes.uml.StartState,
//            Fin: joint.shapes.uml.EndState,
//            Clase: joint.shapes.uml.Class,
//            ClaseAbstracta: joint.shapes.uml.Abstract,
//            Interfaz: joint.shapes.uml.Interface,
//            Estado: joint.shapes.uml.State
        }
    }]);