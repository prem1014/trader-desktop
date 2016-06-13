(function() {
    'use strict';

    angular.module('app', [
        // Common (everybody has access to these)
        'app.core',
        'ui.bootstrap',
        // Features (listed alphabetically)
        'app.approot',
        'app.constant',
        'app.confirmationBox',
        'app.promptBox',
        'app.alertBox',
        'app.socket',
        'app.dashboard',
        'app.topnav',
        'app.login',
        'app.signout'
    ]);
})();
