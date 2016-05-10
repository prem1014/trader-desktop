'use strict';
(function () {
    angular.module('app.dashboard')

        .controller('DashboardController', dashboardController);

    dashboardController.$inject = ['$scope', '$cookieStore', 'DashboardService', 'socket','ConstantService','logger'];

    /* @ngInject */
    function dashboardController($scope,$cookieStore, DashboardService, socket, ConstantService, logger) {

        var vm = this;
        //model initialization
        vm.orders = [];
        vm.isShowtable = true;
        vm.getOrders = getOrders;
        vm.createOrders = createOrders;
        activate();

        $scope.$on('showChart', function (event, isShowChart) {
            console.log(isShowChart);
            vm.isShowChart = isShowChart;
            vm.isShowtable = false;
        });

        $scope.$on('showTable', function (event, isShowTable) {
            console.log(isShowTable);
            vm.isShowChart = false;
            vm.isShowtable = isShowTable;
        });

        $scope.$on('refreshedOrders',function (event,orders) {
            vm.orders=orders;
        })
        function orderCreatedEvent() {
            socket.on(ConstantService.eventType.orderCreated, onOrderCreated)
        }

        function placementCreated() {
            socket.on(ConstantService.eventType.orderPlaced, onPlacementCreated)
        }

        function executionCreated() {
            socket.on(ConstantService.eventType.orderExecuted, onExecutionCreated)
        }

        function allOrdersDeleted() {
            socket.on(ConstantService.eventType.orderDeleted, onAllOrdersDeleted)
        }

        //get ordered data from server
        function getOrders() {
            DashboardService.getOrders()
                .then(function (order) {
                    vm.orders = order;
                    console.log('Now orders are available from server');
                })
                .catch(function (error) {
                    console.log('Server encountered error: ' + error);
                })
        }

        //creates new order
        function createOrders() {

            DashboardService.createOrders($scope.noOfOrders, $cookieStore.get('globals').currentUser.traderId)
                .then(function (data) {
                    //listenOrderCreated();
                })
                .catch(function (error) {
                    cosole.log('Server encountered error: ' + error);
                });
        }

        function onOrderCreated(order) {
            if (vm.orders !== undefined) {
                vm.orders.push
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
                vm.orders[0] = order;
            }
            $scope.$broadcast('ordersModified', vm.orders);
        }

        function onPlacementCreated(placedOrder) {
            vm.orders
                .filter(function (order) {
                    return order.id === placedOrder.orderId;
                })
                .map(function (order) {
                    order.quantityPlaced += placedOrder.quantityPlaced;
                    order.status = placedOrder.status;
                });
            $scope.$broadcast('ordersModified', vm.orders);
        }

        function onExecutionCreated(executedOrder) {
            vm.orders
                .forEach(function (order, index, arr) {
                    if (order.id === executedOrder.orderId) {
                        arr[index].quantityExecuted += executedOrder.quantityExecuted;
                        arr[index].status = executedOrder.status;
                        $scope.$apply(function () {
                            vm.orders = arr;
                        })
                    }
                })
            /*  vm.orders
             .filter(function(order){
             return order.id===executedOrder.orderId;
             })
             .map(function (order) {
             order.quantityExecuted+=executedOrder.quantityExecuted;
             order.status=executedOrder.status;
             });*/

            $scope.$broadcast('ordersModified', vm.orders);
        }

        function onAllOrdersDeleted() {
            vm.orders.splice(0, vm.orders.length);
        }

        function activate() {

            logger.log('Activated Dashboard View');
            //get ordered data from server
            getOrders();
            orderCreatedEvent();
            placementCreated();
            executionCreated();
            allOrdersDeleted();
        }
    }
})();
