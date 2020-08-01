// Vars for viz sizing
var margin = {top: 10, right: 30, bottom: 30, left: 30};
var width = 740 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

// Add svg
var svg = d3.select("#emissionViz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Create emissions viz
d3.csv("https://karlindye.github.io/emissions.csv").then(function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([1960, 2016])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([14, 23])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add points
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.Year); } )
      .attr("cy", function (d) { return y(d.co2Emissions); } )
      .attr("r", 3)
      .style("fill", "#69b3a2")
   
   // Add lines
   svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.Year) })
        .y(function(d) { return y(d.co2Emissions) })
        )
});