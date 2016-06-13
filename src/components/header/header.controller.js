
(function () {
    'use strict';
    angular.module('app.header', [])
        .controller('HeaderController', headerController);

    headerController.$inject = ['$scope', '$http', '$cookieStore', 'DashboardService', 'DataService','logger'];

    function headerController($scope, $http, $cookieStore, DashboardService, DataService,logger) {
        /* jshint validthis: true */

        var vm = this;

        //toggle between chart and tabular view
        vm.tblSelected='active-btn';
        vm.showChart = showChart;
        vm.showTabular = showTabular;

        vm.getOrdersOnRefresh=getOrdersOnRefresh;

        // vm.refresh = getLatestData;

        getLoggedInUser();

        function getLoggedInUser() {
            if ($cookieStore.get('globals') !== undefined) {
                vm.loggedUser = $cookieStore.get('globals').currentUser.traderName;
            }
        }

        function getOrdersOnRefresh() {
            DataService.getOrders()
                .then(function (orders) {
                   $scope.$emit('refreshedOrders',orders);
                })
                .catch(function (error) {
                    logger.log('Server encountered error: ' + error);
                });
            $http({method: 'GET', url: '/src/components/data/data.json'}).success(function (data) {
                console.log(data);
            })
        }

        //show data in chart view
        function showChart() {
            $scope.$emit('showChart', true);
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
