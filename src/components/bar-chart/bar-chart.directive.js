(function () {
    'use strict';
    angular.module('app.dashboard.chart', [])
        .directive('barChart', barChart);

    function barChart() {
        var directive = {};
        directive.restrict = 'E';
        directive.template = '<div id="chart"></div>';
        directive.scope = {
            chartData: '=data'
        };
        directive.link = linkFunction;

        return directive;

        function linkFunction(scope, element, attrs) {
            scope.$on('ordersModified',function (event,orders) {
                plotChart(orders);
            })
            plotChart(scope.chartData);
        }

        function plotChart(orders) {
            var totalOrder = [], placed = [], executed = [];
            orders.map(function (order, index) {
                totalOrder.push({id: order.id, quantity: order.quantity});
                placed.push({id: order.id, quantityPlaced: order.quantityPlaced});
                executed.push({id: order.id, quantityExecuted: order.quantityExecuted});
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
            totalOrder.map(function (order, index) {
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
})()
