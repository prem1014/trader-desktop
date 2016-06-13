(function () {
    'use strict';
    angular.module('app.core')
        .run(runAppCore);
    runAppCore.$inject = ['$rootScope', '$location', '$cookieStore'];
    function runAppCore($rootScope, $location, $cookieStore) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        /*if ($rootScope.globals.currentUser) {
        }*/
        $rootScope.$on('$locationChangeStart', function () {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }
})();
