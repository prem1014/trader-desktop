'use strict';
(function () {
    angular.module('app.dashboard')

        .controller('DashboardController', dashboardController);

    dashboardController.$inject = ['$scope', '$rootScope', '$cookieStore', 'DashboardService', 'socket','logger'];

    /* @ngInject */
    function dashboardController($scope, $rootScope, $cookieStore, DashboardService, socket, logger) {

        var vm = this;
        //model initialization
        vm.orders = [];
        vm.isShowtable = true;
        vm.orders=DashboardService.traderObj.orders;

        //get ordered data from server
        getOrders();

        vm.getOrders = getOrders;
        vm.createOrders = createOrders;

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

        socket.on('executionCreatedEvent', function (executedOrder) {

           /*  vm.orders
                .filter(function(order){
                    return order.id===executedOrder.orderId;
                })
                .map(function (order) {
                    order.quantityExecuted+=executedOrder.quantityExecuted;
                    order.status=executedOrder.status;
                });*/

            vm.orders.forEach(function (item, index, arr) {
                if (item.id === executedOrder.orderId) {
                    arr[index].quantityExecuted += executedOrder.quantityExecuted;
                    arr[index].status = executedOrder.status;

                    $scope.$apply(function () {
                        vm.orders = arr;
                    })
                }
            })
        });

        //get ordered data from server
        function getOrders() {
            DashboardService.getOrders()
                .then(function () {
                    vm.orders = DashboardService.traderObj.orders;
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

        function activate() {
            logger.log('Activated Dashboard View');
        }
    }
})();
