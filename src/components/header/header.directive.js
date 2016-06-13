
(function () {
    'use strict';
    angular.module('app.header')
        .directive('customHeader',customHeader);

    function customHeader() {
        var directive={};

        directive.restrict='E';
        directive.templateUrl='components/header/header.html';
        directive.controller='HeaderController';
        directive.controllerAs='vm';
        directive.scope={

        };
        return directive;
    }
})();
