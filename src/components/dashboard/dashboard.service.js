(function () {
    'use strict';
    angular.module('app.dashboard')
        .factory('DashboardService', dashboardService);

    dashboardService.$inject = ['$http','DataService','logger'];

    function dashboardService($http, DataService,logger) {

        var service,
        instruments = [];
        service = {
            createOrders: createOrders,
            getOrders: getOrders,
            getInstruments: getInstruments,
            deleteAllOrders: deleteAllOrders
        };

        init();

        return service;

        function createOrders(noOfOrder, traderId,inst) {
            return DataService.createOrders(generateOrderData(noOfOrder, traderId,inst));
        }

        function getOrders() {
            return DataService.getOrders();
        }

        function getInstruments() {
            DataService.getInstruments()
                .then(function (data) {
                    instruments = data;
                })
                .catch(function (error) {
                    logger.log('Server encountered error: ' + error);
                });
        }

        function deleteAllOrders() {
            return DataService.deleteAllOrders();
        }

        function generateOrderData(noOfOrder, traderId,intst) {
            var orderedData = [],
                side=['Buy','Sell'],
                sideIndex,
                instrumentsIndex;
            if(intst){
                instruments=intst;
            }
            for (var i = 0; i < noOfOrder; i++) {

                sideIndex=random(0,1);
                instrumentsIndex=random(0,instruments.length-1);
                orderedData.push
                ({
                    side: side[sideIndex], symbol: instruments[instrumentsIndex].symbol,
                    quantity: Math.floor(Math.random() * 1000 + 1),
                    limitPrice: Math.random() * 100, traderId: traderId
                });
            }

            return orderedData;
        }
        function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function init() {
            service.getInstruments();
        }

    }
})();
