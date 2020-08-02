// Vars for viz sizing
var margin = {top: 30, right: 30, bottom: 50, left: 50};
var width = 740 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;

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

  // Add chart title
  svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("US CO2 Emissions Per Capita");

  // Add X axis
  var x = d3.scaleLinear()
    .domain([1960, 2016])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  // text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 15) + ")")
      .style("text-anchor", "middle")
      .text("Year");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([14, 23])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("CO2 Emissions (metric tons per capita)");     

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

    var annotations = [
        {
          note: { 
            title: "New Fuel Efficiency Regs", 
            lineType: "none", 
            align: "middle",
            wrap: 150 //custom text wrapping
          },
          subject: {
            height: height,
            width: x(1978) - x(2005)
          },
          type: d3.annotationCalloutRect,
          y: margin.top,
          x: x(2005),
          disable: ["connector"], 
          dx: -(x(2005) - x(1978))/2

        }]


      var makeAnnotations = d3.annotation()
        .annotations(annotations)

      d3.select("svg")
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)        

});