(function() {
    'use strict';

    angular.module('app', [
        // Common (everybody has access to these)
        'app.core',

        // Features (listed alphabetically)
        'app.approot',
        'app.constant',
        'app.socket',
        'app.dashboard',
        'app.topnav',
        'app.login',
        'app.signout'
    ]);
})();
