(function () {

    'use strict';

    angular.module('app.dashboard')
        .directive('tmplDashboard', directiveFunction);
       // .controller('DashboardController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/dashboard/dashboard.html',
            scope: {
            },
            controller: 'DashboardController',
            controllerAs: 'vm'
        };

        return directive;
    }

})();
