(function () {
    'use strict';
    angular.module('app.promptBox',[])
        .controller('PromptController',promptController);

    promptController.$inject=['$cookieStore','DashboardService','logger'];

    function promptController($cookieStore,DashboardService,logger) {
        /* jshint validthis: true */

        var promptCtrl=this;

        promptCtrl.createOrders=createOrders;

        //creates new order
        function createOrders(inst) {

            DashboardService.createOrders(promptCtrl.noOfOrders, $cookieStore.get('globals').currentUser.traderId,inst)
                .then(function () {

                })
                .catch(function (error) {
                    logger.log('Server encountered error: ' + error);
                });
        }
    }
})();
