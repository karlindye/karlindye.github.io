
function slideOne(){
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

        var div = d3.select("body").append("div")
        .attr("class", "tooltip-donut")
        .attr("position", "absolute")
        .attr("text-align", "center")
        .attr("padding", ".5rem")
        .attr("background", "#FFFFFF")
        .attr("color", "#313639")
        .attr("border", "1px solid #313639")
        .attr("border-radius", "8px")
        .attr("pointer-events", "none")
        .attr("font-size", "1.3rem")
        .style("opacity", 0);

        var path = svg.append("path")
        .datum(data.filter(function(d) {return d.Year <= 1975;}))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.Year) })
            .y(function(d) { return y(d.co2Emissions) })
        )
    

        // Animate line
        var pathLength = path.node().getTotalLength();

        path.attr("stroke-dasharray", pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .duration(4000) 
        .ease(d3.easeSin) 
        .attr("stroke-dashoffset", 0);

        var annCafeLine = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-width", 1.5)
        .attr("d", "M" + (x(1975)).toString() + " " + (height).toString() + "," + (x(1975)).toString() + " " + (0).toString() )

        svg.append("text")
        .attr("x", x(1975) + 4)             
        .attr("y", 15)
        .attr("text-anchor", "left")  
        .style("font-size", "12px")
        .style("fill","#546E7A") 
        .text("CAFE Standards");

    });
}

