(function(){
  angular.module('chart', [])
  .directive('barChart',barChart);

  barChart.$inject=['$parse'];

  function barChart(){
      return {
         restrict: 'E',
         replace: true,
         scope:{
          chartData:'=data'
         },
         template: '<div id="chart"></div>',
         link: function (scope, element, attrs) {
              var data = [
                  [1,Math.floor(Math.random() * 1000 + 1)],
                  [2,Math.floor(Math.random() * 1000 + 1)], 
                  [3, Math.floor(Math.random() * 1000 + 1)], 
                  [4, Math.floor(Math.random() * 1000 + 1)], 
                  [5, Math.floor(Math.random() * 1000 + 1)],
                  [6,Math.floor(Math.random() * 1000 + 1)]];
           // plotChart(data); 
           scope.$on('chartData',function(event,data){
            console.log(data);
           
           })
            plot();
         }
      }
    function plotChart(data){
       var chart = document.getElementById("chart"),
           axisMargin = 20,
           margin = 20,
           valueMargin = 4,
           width = chart.offsetWidth,
           height = chart.offsetHeight,
           barHeight = (height-axisMargin-margin*2)* 0.4/data.length,
           barPadding = (height-axisMargin-margin*2)*0.6/data.length,
           data, bar, svg, scale, xAxis, labelWidth = 0;

           max = d3.max(data.map(function(i){ 
              return i[1];
           }));

         svg = d3.select(chart)
             .append("svg")
             .attr("width", width)
             .attr("height", 400);

         bar = svg.selectAll("g")
               .data(data)
               .enter()
               .append("g");

         bar.attr("class", "bar")
            .attr("cx",0)
            .attr("transform", function(d, i) { 
               return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

         bar.append("text")
            .attr("class", "label")
            .attr("y", barHeight / 2)
            .attr("dy", ".35em") //vertical align middle
            .text(function(d){
               return d[0];
            }).each(function() {
              labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
            });

         scale = d3.scale.linear()
                .domain([0, max])
                .range([0, width - margin*2 - labelWidth]);

         xAxis = d3.svg.axis()
                .scale(scale)
                .tickSize(-height + 2*margin + axisMargin)
                .orient("bottom");

         bar.append("rect")
            .attr("transform", "translate("+labelWidth+", 0)")
            .attr("height", barHeight)
            .attr("width", function(d){
               return scale(d[1]);
            });

         bar.append("text")
            .attr("class", "value")
            .attr("y", barHeight / 2)
            .attr("dx", -valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .text(function(d){
               return d[1];
             })
            .attr("x", function(d){
                var width = this.getBBox().width;
                 return Math.max(width + valueMargin, scale(d[1]));
             });

         svg.insert("g",":first-child")
            .attr("class", "axis")
            .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
            .call(xAxis);
    }
    function plot(chartData){
   /* data=[],
    chartData.forEach(function(item){
      data.push({id:item.id,count:item.totalOrder})
    });*/      
      var margins = {
    top: 12,
    left: 80,
    right: 24,
    bottom: 24
},
legendPanel = {
    width: 180
},
width = 800 - margins.left - margins.right - legendPanel.width,
    height = 150 - margins.top - margins.bottom,
    dataset = [{
        data: [{
            id: 1,
            count: 123
        }, {
            id: 2,
            count: 234
        }, {
            id: 3,
            count: 345
        }
        ],
        name: 'Series #1'
    }, {
        data: [{
            id: 1,
            count: 235
        }, {
            id: 2,
            count: 267
        }, {
            id: 3,
            count: 573
        }],
        name: 'Series #2'
    },
{
        data: [{
            id: 1,
            count: 400
        }, {
            id: 2,
            count: 200
        }, {
            id: 3,
            count: 150
        }],
        name: 'Series #2'
    },
    
    ],
    series = dataset.map(function (d) {
        return d.name;
    }),
    dataset = dataset.map(function (d) {
        return d.data.map(function (o, i) {
            // Structure it so that your numeric
            // axis (the stacked amount) is y
            return {
                y: o.count,
                x: o.id
            };
        });
    }),
    stack = d3.layout.stack();

stack(dataset);

var dataset = dataset.map(function (group) {
    return group.map(function (d) {
        // Invert the x and y values, and y0 becomes x0
        return {
            x: d.y,
            y: d.x,
            x0: d.y0
        };
    });
}),
    svg = d3.select(chart)
        .append('svg')
        .attr('width', width + margins.left + margins.right + legendPanel.width)
        .attr('height', height + margins.top + margins.bottom)
        .append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')'),
    xMax = d3.max(dataset, function (group) {
        return d3.max(group, function (d) {
            return d.x + d.x0;
        });
    }),
    xScale = d3.scale.linear()
        .domain([0, xMax])
        .range([0, width]),
    ids = dataset[0].map(function (d) {
        return d.y;
    }),
    _ = console.log(ids),
    yScale = d3.scale.ordinal()
        .domain(ids)
        .rangeRoundBands([0, height], .1),
    xAxis = d3.svg.axis()
        .scale(xScale)
        .tickValues([0,50,100])
        .orient('bottom'),
    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left'),
    colours = d3.scale.category10(),
    groups = svg.selectAll('g')
        .data(dataset)
        .enter()
        .append('g')
        .style('fill', function (d, i) {
        return colours(i);
    }),
    rects = groups.selectAll('rect')
        .data(function (d) {
        return d;
    })
        .enter()
        .append('rect')
        .attr('x', function (d) {
        return xScale(d.x0);
    })
        .attr('y', function (d, i) {
        return yScale(d.y);
    })
        .attr('height', function (d) {
        return yScale.rangeBand();
    })
        .attr('width', function (d) {
        return xScale(d.x);
    })
        .on('mouseover', function (d) {
        var xPos = parseFloat(d3.select(this).attr('x')) / 2 + width / 2;
        var yPos = parseFloat(d3.select(this).attr('y')) + yScale.rangeBand() / 2;

        d3.select('#tooltip')
            .style('left', xPos + 'px')
            .style('top', yPos + 'px')
            .select('#value')
            .text(d.x);

        d3.select('#tooltip').classed('hidden', false);
    })
        .on('mouseout', function () {
        d3.select('#tooltip').classed('hidden', true);
    })

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

svg.append('g')
    .attr('class', 'axis')
    .call(yAxis);

svg.append('rect')
    .attr('fill', 'yellow')
    .attr('width', 160)
    .attr('height', 30 * dataset.length)
    .attr('x', width + margins.left)
    .attr('y', 0);

series.forEach(function (s, i) {
    svg.append('text')
        .attr('fill', 'black')
        .attr('x', width + margins.left + 8)
        .attr('y', i * 24 + 24)
        .text(s);
    svg.append('rect')
        .attr('fill', colours(i))
        .attr('width', 60)
        .attr('height', 20)
        .attr('x', width + margins.left + 90)
        .attr('y', i * 24 + 6);
});
    }  
  } 
})();