
(function () {
    'use strict';
    angular.module('app.login')
    .factory('loginService', loginService);

    loginService.$inject=['$rootScope','$http','$cookieStore','DataService'];
    function loginService($rootScope,$http,$cookieStore,DataService) {
        var service = {
            getUsers:getUsers,
            setCredentials:setCredentials,
            clearCredentials:clearCredentials
        };

        return service;

       function getUsers () {
            return DataService.getUsers();
        }

        function setCredentials (traderName, traderId) {
            //var authdata = Base64.encode(username + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    traderName: traderName,
                    traderId:traderId
                   // authdata: authdata
                }
            };

            //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        }

        function clearCredentials () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
        }


    }

})();

