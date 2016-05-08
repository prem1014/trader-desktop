
(function () {

    'use strict';

    angular.module('app.dashboard')
        .directive('tmplDashboard', directiveFunction)
       // .controller('DashboardController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/dashboard/dashboard.html',
            scope: {
            },
            controller: 'DashboardController',
            controllerAs: 'vm'
        };

        return directive;
    }


    // ----- ControllerFunction -----
   /* ControllerFunction.$inject = ['$scope','DashboardService','socket','logger'];

    /* @ngInject 
    function ControllerFunction($scope,DashboardService,socket,logger) {

        var vm=this;
        //model initialization
        $scope.orderedData=[];
        $scope.TblSelected='toggleTblChartBtnColor'; 
        $scope.toggleGridChart=true;

        //TODO: This is for temporary. We need read the username for login screen
        $scope.loggedUser='Prem Prakash';

        //get ordered data from server
        getOrderedData();

        //toggle between chart and tabular view
        $scope.showChart=showChart;
        $scope.showTabular=showTabular;  

        
        $scope.getOrderedData=getOrderedData;
        $scope.createOrders=createOrders; 
        $scope.deleteAllOrders=deleteAllOrders;
        $scope.refresh=getLatestData;

        DashboardService.getInstruments();

        //listen for 'orderCreatedEvent' event using socket io
        socket.on('orderCreatedEvent', function (data) {
            $scope.orderedData.push
                ({
                    id:data.id,creationTime:data.creationTime,side:data.side,symbol:data.symbol,
                    quantity:data.quantity,quantityPlaced:data.quantityPlaced,quantityExecuted:data.quantityExecuted,
                    limitPrice:data.limitPrice,priority:data.priority,status:data.status,traderId:data.traderId
                })
        }); 

        //listen for 'placementCreatedEvent' event
        socket.on('placementCreatedEvent', function (data) {

            $scope.orderedData.forEach(function(item,index,arr){
                if(item.id===data.orderId){
                    arr[index].quantityPlaced += data.quantityPlaced;
                    arr[index].status=data.status;
                   
                    $scope.$apply(function(){
                         $scope.orderedData = arr;
                    })
                }
             })
        }); 

        //listen for 'executionCreatedEvent' event
        socket.on('executionCreatedEvent', function (data) {
             console.log('executionCreatedEvent:',data);
             $scope.orderedData.forEach(function(item,index,arr){
                if(item.id===data.orderId){
                    arr[index].quantityExecuted += data.quantityExecuted;
                    arr[index].status=data.status;
                   
                    $scope.$apply(function(){
                         $scope.orderedData = arr;
                    })
                }
             })             
        }); 

        //listen for 'allOrdersDeletedEvent' event
        socket.on('allOrdersDeletedEvent', function (data) {
             console.log(data);
        }); 

        //show data in chart view
        function showChart(){
            $scope.toggleGridChart=false;
            $scope.TblSelected='';
            $scope.ChartSelected='toggleTblChartBtnColor';
        }

        //show data in tabular view
        function showTabular(){
            $scope.toggleGridChart=true;
            $scope.TblSelected='toggleTblChartBtnColor';
            $scope.ChartSelected='';            
        }

        //get ordered data from server
        function getOrderedData(){
            var response=DashboardService.getOrderedData();
            response.success(function(data){
                $scope.chartData=[];
                $scope.orderedData=data; 
                //$scope.tradedData.forEach(function(item){
                  //  $scope.chartData.push({id:item.id,totalOrder:Math.floor(Math.random() * 1000 + 1)});
                //})
                //$scope.$broadcast('chartData',$scope.chartData);            
            });
            response.error(function(error){

            })
        }

        //creates new order
        function createOrders(){
            //var noOfOrders=prompt('Enter');
            DashboardService.createOrders($scope.noOfOrders)
                .success(function(data){
                    $scope.toggleAlert=true;
                })
                .error(function(error){
                   
                });
        }

        //delete all orders from server
        function deleteAllOrders(){
            var response=DashboardService.deleteAllOrders();
            response.success(function(data){
                $scope.orderedData.splice(0,$scope.orderedData.length);
            });
            response.error(function(){

            })
        }

        //get data on refresh
        function getLatestData(){
             getOrderedData();
        };

        function activate() {
            logger.log('Activated Dashboard View');
        }
    }*/

})();
