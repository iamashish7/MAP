function getFormedDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;

    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    date = dd + '/' + mm + '/' + yyyy;
    return date;
}

function BarGraph(data,ID,cfg)
{
    var svgWidth = cfg.width , svgHeight = cfg.height;
    var margin = cfg.margin;
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand().range([0, width]).padding(0.5);
    var y = d3.scaleLinear().range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);
    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", margin.top-10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text(cfg.title);

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain(data.map(function (d) {
        return d.name;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.value;
    })]);

    // append the rectangles for the bar chart
    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.name);
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
    g.append("g").attr("class", "text2").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

    // add the y Axis
    g.append("g").attr("class", "text2").call(d3.axisLeft(y));

    //text label for x axis
    g.append("text").attr("transform", "translate(" + (svgWidth / 2) + " ," + (svgHeight - margin.top - 20) + ")").style("text-anchor", "middle").text(cfg.labelx);

    //text label for y axis
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text(cfg.labely);
}