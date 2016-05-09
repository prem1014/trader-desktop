(function() {
    'use strict';

    angular.module('app.dashboard', [
        'app.api',
        'app.core',
        'ngCookies',
        'app.dashboard.chart',
        'app.dashboard.table',
        'app.header',
        'app.socketService'
    ]);
})();
