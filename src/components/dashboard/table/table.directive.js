'use strict';
(function () {
    angular.module('app.dashboard.table')
        .directive('customTable',customTable);

    function customTable(){
        var directive={};
        directive.restrict='E';
        directive.templateUrl='components/dashboard/table/table.html';
        directive.controller='TableController';
        directive.controllerAs='vm';
        directive.scope={
            orderedData:'=tableData'
        }
        return directive;
    }
})();
