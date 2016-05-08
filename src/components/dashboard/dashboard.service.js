(function () {
    'use strict';
    angular.module('app.dashboard')
        .factory('DashboardService', dashboardService);

    dashboardService.$inject = ['$http', 'socket', 'DataService', 'SocketService'];

    function dashboardService($http, socket, DataService, SocketService) {

        var instruments, service, orders;
        orders = [];
        instruments = [];
        service = {
            traderObj:{
                orders:orders
            },
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
            return DataService.getOrders()
                .then(function (orders) {
                    service.traderObj.orders=orders;
                })
                .catch(function(error){
                    console.log('Server encountered error: ' + error);
                })
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
            service.getOrders();
            service.getInstruments();
           // orderCreatedEvent();
            //placementCreated();
            //executionCreated();
           // allOrdersDeleted();
        }

        function orderCreatedEvent() {
            SocketService.listenSocket('orderCreatedEvent', onOrderCreated)
        }

        function placementCreated() {
            SocketService.listenSocket('placementCreatedEvent', onPlacementCreated)
        }

        function executionCreated() {
            SocketService.listenSocket('executionCreatedEvent', onExecutionCreated)
        }

        function allOrdersDeleted() {
            SocketService.listenSocket('allOrdersDeletedEvent', onAllOrdersDeleted)
        }

        function onOrderCreated(order) {
            if(service.traderObj.orders!==undefined){
                service.traderObj.orders.push
                ({
                    id: order.id,
                    creationTime: order.creationTime,
                    side: order.side,
                    symbol: order.symbol,
                    quantity: order.quantity,
                    quantityPlaced: order.quantityPlaced,
                    quantityExecuted: order.quantityExecuted,
                    limitPrice: order.limitPrice,
                    priority: order.priority,
                    status: order.status,
                    traderId: order.traderId
                })
            }
            else {
                service.traderObj.orders[0]=order;
            }
        }

        function onPlacementCreated(placedOrder) {
            service.traderObj.orders
                .filter(function (order) {
                    return order.id === placedOrder.orderId;
                })
                .map(function (order) {
                    order.quantityPlaced += placedOrder.quantityPlaced;
                    order.status = placedOrder.status;
                });
            
        }

        function onExecutionCreated(executedOrder) {
            service.traderObj.orders
                .forEach(function (order,index,arr) {
                    if(order.id === executedOrder.orderId){
                        arr[index].quantityExecuted += executedOrder.quantityExecuted;
                        arr[index].status = executedOrder.status;
                        service.traderObj.orders=arr;
                    }
                })
        }

        function onAllOrdersDeleted() {
            service.traderObj.orders.splice(0,service.traderObj.orders.length);
        }
    }
})();
