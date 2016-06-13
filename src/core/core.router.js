(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(configFunction);

    configFunction.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configFunction($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'components/login/login.html',
                controller:'LoginController',
                controllerAs:'vm'
            })
            .state('dashboard', {
                url: '/dashboard',
                template: '<tmpl-dashboard></tmpl-dashboard>'
            })
            .state('signout',{
                url:'/',
                controller:'SignOutController'
            });
    }
})();
