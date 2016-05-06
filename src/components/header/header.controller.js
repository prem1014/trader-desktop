'use strict';
(function () {
    angular.module('app.header', [])
        .controller('HeaderController', headerController)

    headerController.$inject = ['$scope', '$rootScope', '$cookieStore', 'DashboardService', 'DataService'];

    function headerController($scope, $rootScope, $cookieStore, DashboardService, DataService) {
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
            $rootScope.toggleGridChart = false;
            $rootScope.TblSelected = '';
            $rootScope.ChartSelected = 'toggleTblChartBtnColor';

            $scope.$emit('showChart', true)
        }

        //show data in tabular view
        function showTabular() {
            $rootScope.toggleGridChart = true;
            $rootScope.TblSelected = 'toggleTblChartBtnColor';
            $rootScope.ChartSelected = '';

            $scope.$emit('showTable', true)
        }
    }
})();
