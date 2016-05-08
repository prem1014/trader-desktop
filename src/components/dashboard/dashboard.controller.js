'use strict';
(function () {
    angular.module('app.dashboard')

        .controller('DashboardController', dashboardController);

    dashboardController.$inject =
     ['$scope', '$rootScope', '$cookieStore',
      'DashboardService', 'socket','ToolsService','logger'];

    /* @ngInject */
    function dashboardController($scope, $rootScope, $cookieStore, DashboardService, socket,ToolsService, logger) {

        var vm = this;
        //model initialization
        vm.orders = [];
        vm.isShowtable = true;
        vm.orders=DashboardService.traderObj.orders;
       // vm.isShowChart=ToolsService.toolsObj.showChart;
       // vm.isShowtable=ToolsService.toolsObj.showTable;

       init();
       
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
        
        socket.on('orderCreatedEvent',function(order){
                if(vm.orders!==undefined){
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
                 vm.orders=order;
            }
        });

        socket.on('placementCreatedEvent',function(placedOrder){
                vm.orders
                .filter(function (order) {
                    return order.id === placedOrder.orderId;
                })
                .map(function (order) {
                    order.quantityPlaced += placedOrder.quantityPlaced;
                    order.status = placedOrder.status;
                });
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

        socket.on('allOrdersDeletedEvent',function(){
            vm.orders.splice(0,service.traderObj.orders.length);
        })
        //get ordered data from server
        function getOrders() {
             DashboardService.getOrders()
             .then(function(){
                  vm.orders=DashboardService.traderObj.orders;
             })
             .catch(function(){
                 logger.log('Server encountered error');
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

        function init() {
            logger.log('Activated Dashboard View');
             //get ordered data from server
             getOrders();
        }
    }
})();
