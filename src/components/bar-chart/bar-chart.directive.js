(function () {
    'use strict';
    angular.module('app.chart', [])
        .directive('barChart', barChart);

    //barChart.$inject = ['$window', '_', 'logger'];

    function barChart() {
        var directive = {};
        directive.restrict = 'E';
        directive.template = '<div id="chart"></div>';
        directive.scope = {
            orders: '=chartData'
        };
        directive.link = linkFunction;

        return directive;

        function linkFunction(scope) {
            if (scope.orders.length > 0) {
                plotGraph(scope);
            }
            //drawChart(scope);
        }

        /*function plotChart(orders) {
            var totalOrder = [], placed = [], executed = [];
            orders.map(function (order) {
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
            });
            placed.map(function (placedOrder, index) {
                trace2XData[index] = placedOrder.quantityPlaced;
                trace2YData[index] = placedOrder.id;
            });
            totalOrder.map(function (order, index) {
                trace3XData[index] = order.quantity;
                trace3YData[index] = order.id;
            });
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
        }*/

        function plotGraph(scope) {
            scope.toPlaceGraph = toPlaceGraph;

// general properties for graph plot
            var margin = {top: 10, right: 10, bottom: 30, left: 10},
                width = 1024 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

            var legendWidth = width * 0.3;
            var quantityWidth = (width - legendWidth) * 0.1;
            var idWidth = (width - legendWidth) * 0.1;

            var rangeHeight = height * 0.1;
            var hPosition = rangeHeight / 2 + 20;
            var graphPlotHeight = height - rangeHeight;
            var graphPlotWidth = width - (legendWidth + quantityWidth + idWidth);

            var barHeight = 25;
            var totalUnderlineHeight = 3;

            var color = ['#FFEFBF', '#FEBB68', '#FF8000'];
           // var colorWithProp = {quantities: '#FFEFBF', quantitiesPlaced: '#FEBB68', quantitiesExecuted: '#FF8000'};
            var orderStatuses = ['quantity', 'quantityPlaced', 'quantityExecuted'];
            var barPadding = 10;
            var underlines = null;

            var stackedQuantities = [[], [], []];

            var orders = [];

            var svg = d3.select('#chart')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            var chartXAxis = svg.append('g')
                .attr('class', 'chart-graph-axis');

            var xScale = d3.scale.linear()
                .domain([0, 100])
                .range([idWidth, graphPlotWidth + idWidth]);

            scope.toPlaceGraph();

            function toPlaceGraph() {
                if (scope.orders) {
                    toPlaceAxisLabel();
                    toInitiateUnderLine();
                    toPlaceColumnGrid();
                    _.map(scope.orders, toUpdateValues);
                    //toUpdateValues(scope.orders);
                    toPlaceLegend();
                }
            }

            scope.$on('ordersCreated', function (scopeState, order) {
                if (order) {
                    toUpdateValues(order);
                }
            });

            scope.$on('ordersModified', function (scopeState, order) {
                if (order) {
                    toUpdateGraph(order);
                }
            });

            function toPlaceAxisLabel() {
                // add label 'order id' in the graph
                svg.append('text')
                    .attr('id', 'title')
                    .attr('style', 'fill: black;')
                    .text('Order Id');

                svg.append('text')
                    .text('Total')
                    .attr({
                        'id': 'total',
                        'x': idWidth + graphPlotWidth + 20,
                        'y': rangeHeight / 2
                    });
            }

            function toPlaceColumnGrid() {
                // add legend
                svg.append('g')
                    .attr('class', 'grid')
                    .attr('transform', 'translate(' + (0) + ',' + 0 + ')');
            }

            function toPlaceLegend() {
                var legendValues = ['Total Order', 'Placed', 'Executed'];
                var legendColors = ['#FFEFBF', '#FEBB68', '#FF8000'];

                // add legend
                var legend = svg.append('g')
                    .attr('class', 'legend')
                    .attr('height', 100)
                    .attr('width', 100)
                    .attr('transform', 'translate(' + (width - (legendWidth + 100) / 2) + ',' + (rangeHeight) + ')');


                legend.selectAll('rect')
                    .data(legendValues)
                    .enter()
                    .append('rect')
                    .attr('x', 20)
                    .attr('y', function (d, i) {
                        return i * 30;
                    })
                    .attr('width', 20)
                    .attr('height', 20)
                    .style('fill', function (d, i) {
                        return legendColors[i];
                    });

                legend.selectAll('text')
                    .data(legendValues)
                    .enter()
                    .append('text')
                    .attr('x', 50)
                    .attr('y', function (d, i) {
                        return i * 30 + 15;
                    })
                    .text(function (d) {
                        return d;
                    });
            }

            function toUpdateValues(order) {

                orders.push(order);

                for (var i = 0; i < orderStatuses.length; i++) {
                    stackedQuantities[i].push({
                        'x': order.id,
                        'y': order[orderStatuses[i]] / order[orderStatuses[i]] * 100,
                        'status': orderStatuses[i]
                    });
                }

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(stackedQuantities[0], function (d) {
                        return d.x;
                    })])
                    .range([rangeHeight, hPosition + (stackedQuantities[0].length * (barHeight + barPadding))], 0.05);

                toUpdateColumnGrid(xScale, yScale, orders.length);

                // Add a group for each row of data
                var group = svg.selectAll('g.bar')
                    .data(stackedQuantities);

                group.enter()
                    .append('g')
                    .attr('class', 'bar')
                    .attr({'x': idWidth, 'y': hPosition})
                    .style('fill', function (d, i) {
                        return color[i];
                    });

                // Add a rect for each data value

                var rect = group.selectAll('rect')
                    .data(function (d) {
                        return d;
                    });

                rect.enter()
                    .append('rect')
                    .attr('id', function (d) {
                        return d.status + d.x;
                    })
                    .attr('x', function () {
                        return xScale(0);
                    })
                    .attr('y', function (d, i) {
                        return i * (barHeight + barPadding) + hPosition;
                    })
                    .style('padding-top', 10)
                    .attr('width', function (d) {
                        return xScale(d.y) - idWidth;
                    })
                    .attr('height', barHeight);

                svg.select('#title')
                    .attr('transform', 'translate(20,' +
                        (hPosition + (orders.length * (barHeight + barPadding)) / 2) + '), rotate(-90, 0, 0)');

                toUpdateUnderlines(orders);
                toUpdateAxisTickers(orders);
                toUpdateXAxis(xScale);
            }

            function toUpdateXAxis(xScale) {
                // add up axis in the top
                var xAxis = d3.svg.axis();
                xAxis.scale(xScale);
                xAxis.orient('top').ticks(10)
                    .innerTickSize([3])
                    .outerTickSize([3])
                    .tickFormat(function (d) {
                        if (d % 50 === 0) {
                            return d + '%';
                        }
                        else {
                            return '';
                        }
                    });
                chartXAxis.attr('transform', 'translate(' + 0 + ',' + (rangeHeight / 2) + ')')
                    .call(xAxis);
            }

            function toUpdateGraph(order) {
                stackedQuantities.map(function (indQuantities) {
                    indQuantities.filter(function (quantity) {
                        return quantity.x === order.id;
                    }).map(function (quantity) {
                        quantity.y = order[quantity.status] / order.quantity * 100;
                        svg.select('#' + quantity.status + quantity.x).attr('width', function (quantity) {
                            return xScale(quantity.y) - idWidth;
                        });
                    });
                });
            }

            function toInitiateUnderLine() {
                underlines = svg.append('g')
                    .attr('class', 'underlines')
                    .attr('height', graphPlotHeight)
                    .attr('width', quantityWidth)
                    .attr('transform', 'translate(' + (graphPlotWidth + idWidth) + ',' + (hPosition) + ')');
            }

            function toUpdateUnderlines(orders) {
                underlines.selectAll('rect')
                    .data(orders)
                    .enter()
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', function (d, i) {
                        return i * (barHeight + barPadding) + barHeight - totalUnderlineHeight;
                    })
                    .attr('width', quantityWidth)
                    .attr('height', totalUnderlineHeight)
                    .style('fill', '#FFEFBF');
            }

            function toUpdateAxisTickers(orders) {

                svg.selectAll('text.quantity')
                    .data(orders)
                    .enter()
                    .append('text')
                    .attr('class', 'quantity')
                    .text(function (d) {
                        return d.quantity;
                    })
                    .attr({
                        'class': 'quantity',
                        'x': idWidth + graphPlotWidth + 20,
                        'y': function (d, i) {
                            return hPosition + (i + 0.3) * (barHeight + barPadding);
                        }
                    });
                // set position etc.

                svg.selectAll('text.id')
                    .data(orders)
                    .enter()
                    .append('text')
                    .attr('class', 'id')
                    .text(function (d) {
                        return d.id;
                    })
                    .attr({
                        'class': 'id',
                        'x': idWidth / 2,
                        'y': function (d, i) {
                            return hPosition + (i + 0.3) * (barHeight + barPadding);
                        }
                    });
            }

            function toUpdateColumnGrid(xScale, yScale, maxLen) {
                var lineData = [];

                var lineFunction = d3.svg.line()
                    .x(function (d) {
                        return d.x;
                    })
                    .y(function (d) {
                        return d.y;
                    })
                    .interpolate('linear');

                svg.select('.grid').selectAll('path.line').remove();

                for (var i = 0; i <= 10; i++) {
                    lineData = [{'x': xScale(i * 10), 'y': rangeHeight / 2}, {
                        'x': xScale(i * 10),
                        'y': hPosition + (maxLen - 1) * (barHeight + barPadding) + barHeight
                    }];

                    svg.select('.grid').append('path')
                        .attr('d', lineFunction(lineData))
                        .attr('class', 'line')
                        .attr({'stroke': '#C1C1C1', 'stroke-width': 1, 'stroke-dasharray': '1,1', 'fill': 'none'});
                }

            }
        }

     /*   function drawChart(scope) {

            var width = 800, height = 400,

                barYCordinate = 10;

            var stackOrders = [];
            scope.orders.map(function (order) {
                barYCordinate = barYCordinate + 30;

                stackOrders.push({quantity: order.quantity, barYCordinate: barYCordinate});
            });
            var svg = d3.select('#chart').append('svg');

            svg.attr('width', width).attr('height', height);

            drawOrdersCreated();

            scope.$on('ordersModified', function (event, order) {
                var placedOrder = [];
                order.map(function () {
                    barYCordinate = barYCordinate + 30;
                    placedOrder.push({qtyPlaced: order.quantityPlaced, barYCordinate: barYCordinate});
                });
                onOrderPlaced(placedOrder);
            });

            function drawOrdersCreated() {
                var g = svg.append('g');
                g.attr('class', 'order-created');

                var rect = g.selectAll('rect').data(stackOrders).enter().append('rect');
                rect.attr('x', 10)
                    .attr('y', function (d) {
                        return d.barYCordinate;
                    })
                    .attr('width', function (d) {
                        return d.quantity;
                    })
                    .attr('height', 25);
            }

            function onOrderPlaced(placedOrder) {
                var g = svg.append('g');
                g.attr('class', 'order-placed');

                var rect = g.selectAll('rect').data(placedOrder).enter().append('rect');
                rect.attr('x', 10)
                    .attr('y', function (d) {
                        return d.barYCordinate;
                    })
                    .attr('width', function (d) {
                        return d.qtyPlaced;
                    })
                    .attr('height', 25);
            }
        }*/
    }
})();
