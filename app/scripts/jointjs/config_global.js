'use strict';

angular.module('diagramasApp')
    .run(["joint", function (joint) {
        // No hago nada, esto es solo para llamar al factory y q borre el joint global
    }])
    .factory("joint", ["$window", function ($window) {
        var joint = $window.joint;
        var V = $window.V;
        //$window.joint = null;
        //delete($window.joint);

        //Adicion de herramienta de resize en todas las vistas
        // Plugin para trabajar con Ports
        joint.shapes.devs = {};

//joint.shapes.devs.Model = joint.shapes.devs.Modeloo.extend( joint.plugins.TooledModelInterface);
//joint.shapes.devs.Modeloo = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
joint.shapes.devs.Modeloo = joint.shapes.basic.Generic.extend( joint.plugins.TooledModelInterface);
joint.shapes.devs.Model = joint.shapes.devs.Modeloo.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/><g class="portsTool"/><g class="resizeTool"/><g class="moveTool"/></g>',
    portMarkup: '<g class="port port<%= id %>"><rect class="port-body"/><text class="port-label"/><text></text></g>',

    defaults: joint.util.deepSupplement({

        type: 'devs.Model',
        
        inPorts: [],
        outPorts: [],

        attrs: {
            '.': { magnet: 'false' },
            '.body': {
                width: 100, height: 100,
                'follow-scale': 'true',
                stroke: '#000000'
            },
            '.port-body': {
                magnet: 'true',
                stroke: '#000000',
                width: 20, height: 20,
                x: -10, y: -10
            },
            text: {
                'pointer-events': 'none'
            },
            '.label': { 'ref-x': .5, 'ref-y': 10, ref: '.body', 'text-anchor': 'middle', fill: '#000' },
            '.outPorts .port-label': { x: 15, fill: '#000' },
            '.inPorts .port-label': { x:-15, 'text-anchor': 'end'},
//            '.portsTools': {x:-20, y:-20, ref: '.body', width: 140, height: 120},
            
        }

    }, joint.shapes.basic.Generic.prototype.defaults),
    //Hacer algo en el initialize
//    initialize: function(){
//        console.error("este mensaje no deberia salir");
//        joint.shapes.basic.PortsModelInterface.initialize.apply(this, arguments);
//    },
    getPortAttrs: function(portName, index, total, selector, type) {

        var attrs = {};

        var portClass = 'port' + index;
        var portSelector = selector + '>.' + portClass;
        var portLabelSelector = portSelector + '>.port-label';
        var portBodySelector = portSelector + '>.port-body';

        attrs[portLabelSelector] = { text: portName };
        attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
//        attrs[portBodySelector] = { ref: portLabelSelector, port: { id: portName || _.uniqueId(type) , type: type } };
        attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };

        if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }

        return attrs;
    }
}));

joint.shapes.devs.Link = joint.dia.Link.extend({
    defaults: {
        type: 'link',
        attrs: {
            '.connection': {
                stroke: 'black',
                'stroke-width': 3
            },
            '.marker-target': {
                stroke: 'black',
                fill: 'black',
                d: 'M 10 0 L 0 5 L 10 10 z'
            }
        }
    }
});

//,{
var p = joint.dia.ElementView.extend(joint.shapes.basic.PortsViewInterface);
joint.shapes.devs.ModelView = p.extend(joint.plugins.TooledViewInterface);
//joint.shapes.devs.ModelView = pp.extend(joint.plugins.TooledViewInterface);
//    update: function(){
//        
//        joint.shapes.basic.PortsViewInterface.update.apply(this, arguments);
//        
//    },
//    initialize: function(){
//        joint.shapes.basic.PortsViewInterface.initialize.apply(this, arguments);
//        this.listenTo(this.model, 'change:nombre', this.actualizarNombre);
//    },
//    actualizarNombre: function(){
//        
//    }
//}
//));
//        window.longa = decoy;
//        joint.shapes.devs.ModelView = decoy.extend(joint.plugins.TooledViewInterface);

        return (joint);
    }]);