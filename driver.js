$(document).ready(function(){
    // Navigation functionality
    $('.navItem').click(function(){

        // Set nav active color
        $('.navItem').removeClass('active');
        $(this).addClass('active'); 

        // Remove current slide
        $('svg').remove();

        // Set all slide details to not display
        $('#slideDetails div').addClass('inactiveSlide'); 

        // Call slide function
        if ($(this).is('#navItemOne')) {
            $('#slideOne').removeClass('inactiveSlide');
            slideOne();
        }

        if ($(this).is('#navItemTwo')) {
            $('#slideTwo').removeClass('inactiveSlide');
            slideTwo();
        }

    });    
    
    // START - Slide One Function  -----------------------------------------------------------------------
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
                .text("United States CO2 Emissions Per Capita");

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

            // Text label for the y axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("CO2 Emissions (metric tons per capita)");     

            // Line for chart
            var path = svg.append("path")
                .datum(data.filter(function(d) {return d.Year <= 1975;}))
                .attr("fill", "none")
                .attr("stroke", "#4CAF50")
                .attr("stroke-width", 2)
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

            // Annotation for CAFE standards
            svg.append("path")
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
                .text("CAFE Standards");

            // Tool Tip
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("display", "none");    

            var focus = svg.append("g")
                .attr("class", "focus")
                .style("display", "none");
    
            focus.append("circle")
                .attr("r", 5);
    
            var tooltipDate = tooltip.append("div")
                .attr("class", "tooltip-date");
    
            var tooltipEmissions = tooltip.append("div");

            tooltipEmissions.append("span")
                .attr("class", "tooltip-title")
                .text("Emissions: ");
    
            var tooltipEmissionsValue = tooltipEmissions.append("span")
                .attr("class", "tooltip-emissions");    

            svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() { focus.style("display", null); tooltip.style("display", null);  })
                .on("mouseout", function() { focus.style("display", "none"); tooltip.style("display", "none"); })
                .on("mousemove", mousemove);   

            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]);
                bisect = d3.bisector(function(a, b){ return a.Year - b; }).right;
                var i = bisect(data, x0);
                var d0 = data[i - 1];
                var d1 = data[i];
                var d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
                
                if (d.Year <= 1975) {
                    focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.co2Emissions) + ")");
                    tooltip.attr("style", "left:" + (x(d.Year) + 64) + "px;top:" + (y(d.co2Emissions) + 90) + "px;");
                    tooltip.select(".tooltip-date").text(d.Year);
                    tooltip.select(".tooltip-emissions").text(d.co2Emissions);
                }

            }    

        });
    }
    // END - Slide One Function  -----------------------------------------------------------------------

    // START - Slide Two Function  -----------------------------------------------------------------------
    function slideTwo(){
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
                .text("United States CO2 Emissions Per Capita");

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

            // Text label for the y axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("CO2 Emissions (metric tons per capita)");     

            // Line for chart slide one
            var pathOne = svg.append("path")
                .datum(data.filter(function(d) {return d.Year <= 1975;}))
                .attr("fill", "none")
                .attr("stroke", "#4CAF50")
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                    .x(function(d) { return x(d.Year) })
                    .y(function(d) { return y(d.co2Emissions) })
                )
        
            pathOne

            var path = svg.append("path")
                .datum(data.filter(function(d) {return d.Year > 1975 && d.Year <= 1985;}))
                .attr("fill", "none")
                .attr("stroke", "#4CAF50")
                .attr("stroke-width", 2)
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

            // Annotation for CAFE standards
            svg.append("path")
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
                .text("CAFE Standards");

            // Annotation for Reagan freeze
            svg.append("path")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-dasharray", "5,5")
                .attr("stroke-width", 1.5)
                .attr("d", "M" + (x(1985)).toString() + " " + (height).toString() + "," + (x(1985)).toString() + " " + (0).toString() )

            svg.append("text")
                .attr("x", x(1985) + 4)             
                .attr("y", 15)
                .attr("text-anchor", "left")  
                .style("font-size", "12px")
                .text("Reagan Freeze");    

            // Tool Tip
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("display", "none");    

            var focus = svg.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("circle")
                .attr("r", 5);

            var tooltipDate = tooltip.append("div")
                .attr("class", "tooltip-date");

            var tooltipEmissions = tooltip.append("div");

            tooltipEmissions.append("span")
                .attr("class", "tooltip-title")
                .text("Emissions: ");

            var tooltipEmissionsValue = tooltipEmissions.append("span")
                .attr("class", "tooltip-emissions");    

            svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() { focus.style("display", null); tooltip.style("display", null);  })
                .on("mouseout", function() { focus.style("display", "none"); tooltip.style("display", "none"); })
                .on("mousemove", mousemove);   

            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]);
                bisect = d3.bisector(function(a, b){ return a.Year - b; }).right;
                var i = bisect(data, x0);
                var d0 = data[i - 1];
                var d1 = data[i];
                var d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
                
                if (d.Year <= 1985) {
                    focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.co2Emissions) + ")");
                    tooltip.attr("style", "left:" + (x(d.Year) + 64) + "px;top:" + (y(d.co2Emissions) + 90) + "px;");
                    tooltip.select(".tooltip-date").text(d.Year);
                    tooltip.select(".tooltip-emissions").text(d.co2Emissions);
                }

            }    

        });
    }
    // END - Slide Two Function  -----------------------------------------------------------------------    

 });      