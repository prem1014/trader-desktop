(function () {
    angular.module('chart', [])
    .directive('barChart', barChart);

    barChart.$inject = ['$parse', 'DashboardService'];

    function barChart($parse, DashboardService) {
        return {
            restrict: 'E',
            controller: 'ChartController',
            scope: {
                chartData: '=data'
            },
            template: '<div id="chart"></div>',
            link: function (scope, element, attrs) {
                plot(scope.chartData);
            }
        }
        function plot(orders) {
            var totalorder = [], placed = [], executed = [];
            orders.map(function (order, index) {
                totalorder.push({ id: order.id, quantity: order.quantity });
                placed.push({ id: order.id, quantityPlaced: order.quantityPlaced });
                executed.push({ id: order.id, quantityExecuted: order.quantityExecuted });
            });

            var trace1XData = [], trace1YData = [],
            trace2XData = [], trace2YData = [],
            trace3XData = [], trace3YData = [];
            executed.map(function (exeOrder, index) {
                trace1XData[index] = exeOrder.quantityExecuted;
                trace1YData[index] = exeOrder.id;
            })
            placed.map(function (placedOrder, index) {
                trace2XData[index] = placedOrder.quantityPlaced;
                trace2YData[index] = placedOrder.id;
            })
            totalorder.map(function (order, index) {
                trace3XData[index] = order.quantity;
                trace3YData[index] = order.id;
            })
            var trace1 = {
                x: trace1XData,
                y: trace1YData,
                name: 'Executed',
                orientation: 'h',
                marker: {
                    color: '#ff8000',
                    width: 1
                },
                type: 'bar'
            };

            var trace2 = {
                x: trace2XData,
                y: trace2YData,
                name: 'Placed',
                orientation: 'h',
                type: 'bar',
                marker: {
                    color: '#fcca88',
                    width: 1
                }
            };

            var trace3 = {
                x: trace3XData,
                y: trace3YData,
                name: 'Total Order',
                orientation: 'h',
                type: 'bar',
                marker: {
                    color: '#fff4d4',
                    width: 1
                }
            };

            var data = [trace1, trace2, trace3];

            var layout = {
                title: 'Order execution status',
                barmode: 'stack'
            };

            Plotly.newPlot('chart', data, layout);
        }
    }
})();