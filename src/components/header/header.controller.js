'use strict';
(function () {
    angular.module('app.header', [])
        .controller('HeaderController', headerController)

    headerController.$inject = ['$scope', '$rootScope', '$cookieStore', 'DashboardService', 'DataService','ToolsService'];

    function headerController($scope, $rootScope, $cookieStore, DashboardService, DataService,ToolsService) {
        var vm = this;

        //toggle between chart and tabular view

        vm.showChart = showChart;
        vm.showTabular = showTabular;

        vm.deleteAllOrders = deleteAllOrders;
       // vm.refresh = getLatestData;

        getLoggedInUser();

        function getLoggedInUser() {
            if ($cookieStore.get('globals') != undefined) {
                vm.loggedUser = $cookieStore.get('globals').currentUser.traderName;
            }
        }

        function getLatestData() {
            DataService.getOrders()
                .then(function (orders) {
                    DashboardService.traderObj.orders = orders;
                })
                .catch(function (error) {
                    console.log('Server encountered error: ' + error);
                })
        };

        //delete all orders from server
        function deleteAllOrders() {
            DashboardService.deleteAllOrders()
                .then(function (data) {
                    console.log('All order deleted');
                    alert('All order deleted');
                })
                .catch(function () {
                    console.log('Server encountered error: ' + error);
                })
        }

        //show data in chart view
        function showChart() {
           $scope.$emit('showChart', true)
           //ToolsService.showChart();
        }

        //show data in tabular view
        function showTabular() {
            $scope.$emit('showTable', true)
           // ToolsService.showTabular();
        }
    }
})();
