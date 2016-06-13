(function() {
    'use strict';

    angular.module('app.dashboard', [
        'app.api',
        'app.core',
        'app.chart',
        'app.dashboard.table',
        'app.header',
        'app.socketService'
    ]);
})();
