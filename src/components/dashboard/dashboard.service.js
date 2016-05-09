(function () {
    'use strict';
    angular.module('app.dashboard')
        .factory('DashboardService', dashboardService);

    dashboardService.$inject = ['$http','DataService'];

    function dashboardService($http, DataService) {

        var instruments, service, orders,
        instruments = [];
        service = {
            createOrders: createOrders,
            getOrders: getOrders,
            getInstruments: getInstruments,
            deleteAllOrders: deleteAllOrders
        };

        init();

        return service;

        function createOrders(noOfOrder, traderId) {
            return DataService.createOrders(generateOrderData(noOfOrder, traderId))
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
                    console.log('Server encountered error: ' + error);
                })
        }

        function deleteAllOrders() {
            return DataService.deleteAllOrders();
        }

        function generateOrderData(noOfOrder, traderId) {
            var orderedData = [],
                side,
                symbol;

            for (var i = 0; i < noOfOrder; i++) {
                if (i !== 0) {
                    side = orderedData[i - 1].side;
                    side = getSide(side);
                }
                else {
                    side = 'Sell'
                }
                orderedData.push
                ({
                    side: side, symbol: instruments[i].symbol, quantity: Math.floor(Math.random() * 1000 + 1),
                    limitPrice: Math.random() * 100, traderId: traderId
                })
            }

            return orderedData;
        }

        function getSide(prevValue) {
            var side = 'Buy';
            if (prevValue === 'Sell' || undefined) {
                return side;
            }
            else {
                return side = 'Sell';
            }
        }

        function init() {
            service.getInstruments();
        }

    }
})();
