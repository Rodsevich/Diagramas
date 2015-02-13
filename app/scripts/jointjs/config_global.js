'use strict';

angular.module('diagramasApp')
    .run(["joint", function (joint) {
        // No hago nada, esto es solo para llamar al factory y q borre el joint global
    }])
    .factory("joint", ["$window", function ($window) {
        var joint = $window.joint;
        //$window.joint = null;
        //delete($window.joint);

        return (joint);
    }]);