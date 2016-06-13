(function () {
    'use strict';
    angular.module('app.confirmationBox')
        .controller('ConfirmController',confirmController);

    confirmController.$inject=['DashboardService','logger'];

    function confirmController(DashboardService,logger) {
        /* jshint validthis: true */
        
        var cnfController=this;
        cnfController.deleteAllOrders=deleteAllOrders;

        //delete all orders from server
        function deleteAllOrders() {
            DashboardService.deleteAllOrders()
                .then(function () {
                    logger.log('All order deleted');
                })
                .catch(function (error) {
                    logger.log('Server encountered error: ' + error);
                });
        }
    }
})();
