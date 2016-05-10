'use strict';
(function () {
    angular.module('app.header', [])
        .controller('HeaderController', headerController)

    headerController.$inject = ['$scope', '$rootScope', '$cookieStore', 'DashboardService', 'DataService'];

    function headerController($scope, $rootScope, $cookieStore, DashboardService, DataService) {
        var vm = this;

        //toggle between chart and tabular view
        vm.tblSelected='active-btn';
        vm.showChart = showChart;
        vm.showTabular = showTabular;

        vm.getOrdersOnRefresh=getOrdersOnRefresh;
        vm.deleteAllOrders = deleteAllOrders;
       // vm.refresh = getLatestData;

        getLoggedInUser();

        function getLoggedInUser() {
            if ($cookieStore.get('globals') != undefined) {
                vm.loggedUser = $cookieStore.get('globals').currentUser.traderName;
            }
        }

        function getOrdersOnRefresh() {
            DataService.getOrders()
                .then(function (orders) {
                   $scope.$emit('refreshedOrders',orders);
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
            vm.tblSelected='';
            vm.chartSelected='active-btn';
        }

        //show data in tabular view
        function showTabular() {
            $scope.$emit('showTable', true);
            vm.chartSelected='';
            vm.tblSelected='active-btn';
        }
    }
})();
