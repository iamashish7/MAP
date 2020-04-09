function drawDonutChart(data, id, text) {
    var thickness = screen.width / 65;
    
    var width = screen.width / 4 - 20;
    var widthPie = screen.width / 8 - 10;
    var height = screen.height / 4;
    var radius = Math.min(widthPie, height) / 2.2;
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var svg = d3.select("#" + id)
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);

    var g = svg.append('g')
        .attr('transform', 'translate(' + (radius) + ',' + (height / 2) + ')');
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .text("Jobs Running Status");
    var arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) { return d.nodes; })
        .sort(null);

    var path = g.selectAll('path')
        .data(pie(data))
        .enter()
        .append("g")
        .on("mouseover", function (d) {
            let g = d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "black")
                .append("g")
                .attr('transform', 'translate(' + (1.8 * radius) + ',' + (-30) + ')')
                .attr("class", "text-group");

            g.append("text")
                .attr("class", "name-text")
                .text("JobId : ")
                .style("font-weight", "bold")
                .attr('text-anchor', 'left')
                .attr('dy', '-1.2em')
                .style('font-size', screen.width / 120)
                .attr('dx', '-3.5em');

            g.append("text")
                .attr("class", "name-text")
                .text(d.data.jobid)
                .attr('text-anchor', 'left')
                .attr('dx', '0.5em')
                .style('font-size', screen.width / 120)
                .attr('dy', '-1.2em');

            g.append("text")
                .attr("class", "name-text")
                .text("Nodes : ")
                .style("font-weight", "bold")
                .attr('text-anchor', 'left')
                .attr('dy', '.6em')
                .style('font-size', screen.width / 120)
                .attr('dx', '-3.5em');

            g.append("text")
                .attr("class", "value-text")
                .text(d.data.nodes)
                .attr('text-anchor', 'left')
                .attr('dx', '1em')
                .style('font-size', screen.width / 120)
                .attr('dy', '.6em');

            g.append("text")
                .attr("class", "name-text")
                .text("Queue : ")
                .style("font-weight", "bold")
                .attr('text-anchor', 'left')
                .attr('dy', '2.4em')
                .style('font-size', screen.width / 120)
                .attr('dx', '-3.5em');

            g.append("text")
                .attr("class", "name-text")
                .text(d.data.queue)
                .attr('text-anchor', 'left')
                .attr('dx', '1.2em')
                .style('font-size', screen.width / 120)
                .attr('dy', '2.4em');

            g.append("text")
                .attr("class", "name-text")
                .text("Running Time : ")
                .style("font-weight", "bold")
                .attr('text-anchor', 'left')
                .attr('dy', '4.2em')
                .style('font-size', screen.width / 120)
                .attr('dx', '-3.5em');

            g.append("text")
                .attr("class", "name-text")
                .text(d.data.rtime)
                .attr('text-anchor', 'left')
                .attr('dx', '5.2em')
                .style('font-size', screen.width / 120)
                .attr('dy', '4.2em');

            g.append("text")
                .attr("class", "name-text")
                .text("Wall Time : ")
                .style("font-weight", "bold")
                .attr('text-anchor', 'left')
                .attr('dy', '6em')
                .style('font-size', screen.width / 120)
                .attr('dx', '-3.5em');

            g.append("text")
                .attr("class", "name-text")
                .text(d.data.wtime)
                .attr('text-anchor', 'left')
                .style('font-size', screen.width / 120)
                .attr('dx', '3em')
                .attr('dy', '6em');

        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", function (d) { return d.data.jobid != "000000" ? "#e5e5e5" : color(this._current) })
                .select(".text-group").remove();
        })
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d, i) { return d.data.jobid == '000000' ? "#e5e5e5" : color(i) })
        .on("mouseover", function (d) {
            d3.select(this)
                .style("cursor", "pointer")
                .style("fill", function (d, i) { return d.data.jobid == '000000' ? "#e5e5e5" : "black" });
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", function (d) { return d.data.jobid == '000000' ? "#e5e5e5" : color(this._current) });
        })
        .each(function (d, i) { this._current = i; });

    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.0em')
        .style('font-size', screen.width / 120)
        .text(text);
    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.1em')
        .style('font-size', screen.width / 150)
        .text("Mouse over to check");
    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '2em')
        .style('font-size', screen.width / 150)
        .text("running status");
}
function preprocess(data, ID, title) {
    var arr = [];
    for (var i in data) {
        arr.push({
            queue: i,
            value: data[i] //convert string to number  
        });
    }
    drawBar(arr,ID,title);
}
function drawBar(data, ID, title) {
    var svgWidth = screen.width/2.3, svgHeight = screen.height/2.3;
    var margin = { top: 20, right: 20, bottom: 50, left: 70 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var x = d3.scaleBand().range([0, width]).padding(0.5);
    var y = d3.scaleLinear().range([height, 0]);

    var svg = d3.select("#" + ID).append('svg').attr("width", svgWidth).attr("height", svgHeight);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("text")
        .attr("x", (svgWidth / 2))             
        .attr("y", (margin.top / 3))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .text(title);
    
    // Scale the range of the data in the domains
    x.domain(data.map(function (d) {
        return d.queue;
    }));
    y.domain([0, 1.1*d3.max(data, function (d) {
        return d.value;
    })]);

    // append the rectangles for the bar chart
    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.queue);
        })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .attr("fill", "steelblue");

    // add the x Axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    g.append("g")
        .call(d3.axisLeft(y));

    //text label for x axis
    g.append("text").attr("transform", "translate(" + (svgWidth / 2) + " ," + (svgHeight - margin.top - 20) + ")").attr("dy", "0.7em").style("text-anchor", "middle").text("Queue");

    //text label for y axis
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text("#Jobs");

}

function drawBar2(data, ID, title) {
    
    var svgWidth = (3*screen.width)/8.1, svgHeight = (3*screen.height)/11;
    var margin = { top: 20, right: 1, bottom: 20, left: 100 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // set the ranges
    var y = d3.scaleBand().range([height, 0]).padding(0.5);
    var x = d3.scaleLinear().range([0, width]);
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
            
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#" + ID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
    
    // set title
    svg.append("text")
        .attr("x", (svgWidth / 2))             
        .attr("y", (margin.top / 4))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .text(title);

    // Scale the range of the data in the domains
    x.domain([0, 1.1*d3.max(data, function(d){ return d.nodes; })])
    y.domain(data.map(function(d) { return d.user; }));

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        //.attr("x", function(d) { return x(d.sales); })
        .attr("width", function(d) {return x(d.nodes); } )
        .attr("y", function(d) { return y(d.user); })
        .attr("height", y.bandwidth())
        .attr("fill", function (d){ return colorScale(d.user); });

    svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('alignment-baseline', 'middle')
        .attr('x', function(d) { return x(d.nodes) + 5;})
        .attr('y', function(d) { return y(d.user) + y.bandwidth()/1.5; })
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .text(function(d) { return d.nodes;});
    // add the x Axis
    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}
