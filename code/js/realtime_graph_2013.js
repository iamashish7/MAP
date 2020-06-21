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
        .attr('transform', 'translate(' + (radius) + ',' + (height / 1.75) + ')');
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("class","graph-title")  
        // .style("font-size", "20px") 
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
        .attr('dy', '.35em')
        .style('font-size', screen.width / 120)
        .text(text);
    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.7em')
        .style('font-size', screen.width / 150)
        .text("Mouse over to check");
    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '2.7em')
        .style('font-size', screen.width / 150)
        .text("running status");
}

function preprocess(data, ID, title) {
    var arr = [];
    for (var i in data) {
        arr.push({
            name: i,
            value: data[i] //convert string to number  
        });
    }
    var cfg = {
        width:screen.availWidth/2.3,
        height:screen.availHeight/2.3,
        margin: { top: 35, right: 20, bottom: 60, left: 70 },
        title:title,
        labelx:"Queue",
        labely:"#Jobs",
    };
    BarGraph(arr,ID,cfg);
}

function drawBar2(data, ID, title){
    var cfg = {
        width: (screen.availWidth*0.9)/2,
        height:(3*screen.availHeight)/11,
        margin: { top: 20, right: 1, bottom: 20, left: 100 },
        title:title,
    };
    HorizontalBarGraph(data,ID,cfg);
}

function drawPieChart(data, ID, title){
    var cfg = {
        width: (screen.availWidth*0.9)/3.2,
        height:(screen.availHeight)/4,
        margin: { top: 20, right: 1, bottom: 10, left: 0 },
        title:title,
    };
    PieChart2(data,ID,cfg);
}

