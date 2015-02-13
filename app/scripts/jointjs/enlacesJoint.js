'use strict';

/**
 * @ngdoc service
 * @name diagramasApp.enlaces
 * @description
 * # enlaces
 * Value in the diagramasApp.
 */
angular.module('diagramasApp')
    .factory('enlacesJoint', ['joint', function (joint) {
        if (!joint.shapes.uml)
            joint.shapes.uml = {};
        joint.shapes.uml.Transition = joint.dia.Link.extend({
            defaults: {
                type: 'uml.Transition',
                attrs: {
                    '.marker-target': {
                        d: 'M 10 0 L 0 5 L 10 10 z',
                        fill: '#34495e',
                        stroke: '#2c3e50'
                    },
                    '.connection': {
                        stroke: '#2c3e50'
                    }
                }
            }
        });
        joint.shapes.uml.Generalization = joint.dia.Link.extend({
            defaults: {
                type: 'uml.Generalization',
                attrs: {
                    '.marker-target': {
                        d: 'M 20 0 L 0 10 L 20 20 z',
                        fill: 'white'
                    }
                }
            }
        });

        joint.shapes.uml.Implementation = joint.dia.Link.extend({
            defaults: {
                type: 'uml.Implementation',
                attrs: {
                    '.marker-target': {
                        d: 'M 20 0 L 0 10 L 20 20 z',
                        fill: 'white'
                    },
                    '.connection': {
                        'stroke-dasharray': '3,3'
                    }
                }
            }
        });

        joint.shapes.uml.Aggregation = joint.dia.Link.extend({
            defaults: {
                type: 'uml.Aggregation',
                attrs: {
                    '.marker-target': {
                        d: 'M 40 10 L 20 20 L 0 10 L 20 0 z',
                        fill: 'white'
                    }
                }
            }
        });

        joint.shapes.uml.Composition = joint.dia.Link.extend({
            defaults: {
                type: 'uml.Composition',
                attrs: {
                    '.marker-target': {
                        d: 'M 40 10 L 20 20 L 0 10 L 20 0 z',
                        fill: 'black'
                    }
                }
            }
        });

        joint.shapes.uml.Association = joint.dia.Link.extend({
            defaults: {
                type: 'uml.Association'
            }
        });

        joint.shapes.uml.Flecha = joint.dia.Link.extend({
            defaults: {
                type: 'uml.Flecha',
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
        return {
            Herencia: joint.shapes.uml.Flecha,
            Asociacion: joint.shapes.uml.Association,
            Transicion: joint.shapes.uml.Transition,
            Generalizacion: joint.shapes.uml.Generalization,
            Implementacion: joint.shapes.uml.Implementation,
            Composicion: joint.shapes.uml.Composition
        }
    }]);