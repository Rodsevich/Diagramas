'use strict';

angular.module('diagramasApp')
    .run(["joint", function (joint) {
        // No hago nada, esto es solo para llamar al factory y q borre el joint global
    }])
    .factory("joint", ["$window", function ($window) {
        var joint = $window.joint;
        //$window.joint = null;
        //delete($window.joint);
        
        // Plugin para trabajar con Ports
        joint.shapes.devs = {};

joint.shapes.devs.Model = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/><g class="manejarPorts"/></g>',
    portMarkup: '<g class="port port<%= id %>"><rect class="port-body"/><text class="port-label"/><text></text></g>',
    manejarPortsMarkup: '<g class="manejarInPorts"><path class="agregar"/><rect class="remover"/></g><g class="manejarOutPorts"><path class="agregar"/><rect class="remover"/></g>',

    defaults: joint.util.deepSupplement({

        type: 'devs.Model',
        
        inPorts: [],
        outPorts: [],

        attrs: {
            '.': { magnet: false },
            '.body': {
                width: 100, height: 100,
                'follow-scale': true,
                stroke: '#000000'
            },
            '.port-body': {
                magnet: true,
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
//            '.manejarPorts': {x:-20, y:-20, ref: '.body', width: 140, height: 120},
            '.manejarPorts path': {'d': "m0,5l5,0l0,-5l5,0l0,5l5,0l0,5-5,0l0,5l-5,0l0,-5l-5,0z", 'stroke-width': 2, stroke:'#000', fill: '#5F5'},
            '.manejarPorts .remover': {width: 15, height: 6, 'stroke-width': 3, stroke:'#000', fill: '#F55', y: 21},
            '.manejarPorts .manejarInPorts': {ref: '.body', 'ref-x':-30, 'ref-y':-40},
            '.manejarPorts .manejarOutPorts': {ref: '.body', 'ref-dx':10, 'ref-y':-40}
        }

    }, joint.shapes.basic.Generic.prototype.defaults),
    agregarPort: function(tipo){
        var arrayPorts = (tipo == "in") ? this.get("inPorts") : this.attributes.outPorts;
        var nombre = prompt("Mete el nombre del " + tipo +"Port:", tipo + "Port" + (arrayPorts.length + 1));
        arrayPorts.push(nombre);
        this.trigger("change:" + tipo + "Ports");
    },
    removerPort: function(tipo){
        var arrayPorts = (tipo == "in") ? this.attributes.inPorts : this.get("outPorts");
        arrayPorts.splice(-1, 1);
        this.trigger("change:" + tipo + "Ports");
    },
    //Hacer algo en el initialize
//    initialize: function(){
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
        type: 'devs.Link',
        attrs: { '.connection' : { 'stroke-width' :  2 }}
    }
});

joint.shapes.devs.ModelView = joint.dia.ElementView.extend(_.extend({}, joint.shapes.basic.PortsViewInterface,{
    update: function(){
        this.$container = this.$('.manejarPorts').empty();
        this.herramientasPorts = V(this.model.manejarPortsMarkup);
        for(var i = 0; i < this.herramientasPorts.length; i++)
            this.$container.append(this.herramientasPorts[i].node);
        joint.shapes.basic.PortsViewInterface.update.apply(this, arguments);
        var funcAgregar = this.model.agregarPort;
        var funcRemover = this.model.removerPort;
        var modelo = this.model;
        this.$('.manejarPorts .manejarInPorts .agregar').on('click',function(){ funcAgregar.apply(modelo, ["in"])});
        this.$('.manejarPorts .manejarInPorts .remover').on('click', function(){ funcRemover.apply(modelo, ["in"])});
        this.$('.manejarPorts .manejarOutPorts .agregar').on('click', function(){ funcAgregar.apply(modelo, ["out"])});
        this.$('.manejarPorts .manejarOutPorts .remover').on('click', function(){ funcRemover.apply(modelo, ["out"])});
    },
//    initialize: function(){
//        joint.shapes.basic.PortsViewInterface.initialize.apply(this, arguments);
//        this.listenTo(this.model, 'change:nombre', this.actualizarNombre);
//    },
//    actualizarNombre: function(){
//        
//    }
}));

        return (joint);
    }]);