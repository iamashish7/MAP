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

function CompareHeatmapGroups(x, y) {
    x = x.split('-');
    y = y.split('-');
    if (parseInt(x[0]) < parseInt(y[0]))
        return -1;
    else if (parseInt(x[0]) > parseInt(y[0]))
        return 1;
    else if (parseInt(x[0]) == parseInt(y[0]))
        if (parseInt(x[1]) < parseInt(y[1]))
            return -1;
        else if (parseInt(x[1]) > parseInt(y[1]))
            return 1;
        else if (parseInt(x[1]) == parseInt(y[1]))
            return 0;
}

function BarGraph(data, ID, cfg) {
    var svgWidth = cfg.width, svgHeight = cfg.height;
    var margin = cfg.margin;
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand().range([0, width]).padding(0.5);
    var y = d3.scaleLinear().range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var svg = d3.select("#" + ID).append('svg').attr("width", svgWidth).attr("height", svgHeight);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("text")
        .attr("x", (width / 2))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("class", "graph-title")
        // .style("font-size", "18px")
        .text(cfg.title);


    // Scale the range of the data in the domains
    x.domain(data.map(function (d) {
        return d.name;
    }));
    y.domain([0, 1.1 * d3.max(data, function (d) {
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
    g.append("g").attr("class", "axis-ticks").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

    // add the y Axis
    g.append("g").attr("class", "axis-ticks").call(d3.axisLeft(y));

    //text label for x axis
    g.append("text").attr("class", "axis-labels").attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 10) + ")").style("text-anchor", "middle").text(cfg.labelx);

    //text label for y axis
    g.append("text").attr("class", "axis-labels").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text(cfg.labely);
}

function LineChart(data, ID, cfg) {
    console.log(dates, months, years);
    var svgWidth = cfg.width, svgHeight = cfg.height;
    var margin = cfg.margin;
    if (cfg.months <= 3) {
        margin.bottom = margin.bottom + 40;
    }
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    console.log(cfg.title, width, svgHeight, margin.top, margin.bottom, height);
    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);
    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", margin.top - 10)
        .attr("class", "graph-title")
        .attr("text-anchor", "middle")
        // .style("font-size", "18px")
        .text(cfg.title);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleTime().rangeRound([0, width]);
    var y;
    if (cfg.noLines === 2) {
        y = d3.scaleLog().base(10).range([height, 0]).nice();
    }
    else {
        y = d3.scaleLinear().rangeRound([height, 0]);
    }
    x.domain(d3.extent(data, function (d) {
        return d.name;
    })).nice();
    var value_arr = []
    if (cfg.noLines == 1) {
        value_arr = d3.extent(data, function (d) { return d.value });
    }
    else {
        for (i = 0; i < cfg.noLines; i++) {
            temp = d3.extent(data, function (d) { return d.value[i] });
            value_arr = value_arr.concat(temp);
        }
    }
    y.domain(d3.extent(value_arr, function (d) {
        return d
    }));
    var lines = []
    if (cfg.noLines == 1) {
        var line = d3.line().x(function (d) {
            return x(d.name)
        }).y(function (d) {
            return y(d.value)
        });
        lines.push(line);
    }
    else {
        for (i = 0; i < cfg.noLines; i++) {
            var line = d3.line().x(function (d) {
                return x(d.name)
            }).y(function (d) {
                return y(d.value[i])
            });
            lines.push(line);
        }
    }
    // x axis relative to date range
    if (cfg.months <= 3) {
        g.append("g").attr("class", "axis-ticks").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(dates).tickFormat(d3.timeFormat("%d-%b-%y"))).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
    }
    else {
        g.append("g").attr("class", "axis-ticks").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(cfg.months).tickFormat(d3.timeFormat("%b'%y")));
    }
    // Y axis
    g.append("g").attr("class", "axis-ticks").call(d3.axisLeft(y));

    // plotting line(s)
    for (i = 0; i < cfg.noLines; i++) {
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", cfg.LineColors[i])
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", lines[i]);
    }
    var placeylable = 0;
    if (cfg.months <= 3) {
        placeylable = height + 80;
    } else {
        placeylable = height + 40;
    }
    //text label for x axis
    g.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (placeylable) + ")")
        .attr("dy", "0.2em")
        .attr("class", "axis-labels")
        .style("text-anchor", "middle")
        .text(cfg.labelx);

    //text label for y axis
    g.append("text")
        .attr("transform", "rotate(-90)").attr("y", 10 - margin.left).attr("x", 0 - (height / 2))
        .attr("dy", "0.7em")
        .attr("class", "axis-labels")
        .style("text-anchor", "middle")
        .text(cfg.labely);

    // Plotting legends if any
    if (cfg.noLines > 1) {
        var lineLegend = g.selectAll(".lineLegend").data(cfg.legend_keys)
            .enter().append("g")
            .attr("class", "lineLegend")
            .attr("class", "lineLegend axis-ticks")
            .attr("transform", function (d, i) {
                return "translate(" + width * 0.95 + "," + (i * 30) + ")";
            });
        lineLegend.append("text").text(function (d) { return d; }).attr("transform", "translate(-60,9)"); //align texts with boxes
        lineLegend.append("rect").attr("fill", function (d, i) { return cfg.LineColors[i]; }).attr("width", 10).attr("height", 10).attr("transform", "translate(-80,0)");
    }

    //Divides date for tooltip placement
    var bisectDate = d3.bisector(function (d) { return d.name; }).left;

    // var focus_arr = []
    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("rect")
        .attr("class", "tooltip")
        .attr("width", 100)
        .attr("height", 50 + (18 * (cfg.noLines - 1)))
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    focus.append("text")
        .attr("class", "tooltip-date")
        .attr("x", 18)
        .attr("y", -2)
        .attr("fill", "black");

    for (i = 0; i < cfg.noLines; i++) {

        focus.append("circle")
            .attr('id', 'tooltip_circle' + i)
            .attr("r", 5)
            .attr("fill", cfg.TooltipColors[i]);

        focus.append("text")
            .attr("x", 18)
            .attr("y", 18 * (i + 1))
            .attr("fill", cfg.TooltipColors[i])
            .text("Value:");

        focus.append("text")
            .attr('id', 'tooltip' + i)
            .attr("class", "tooltip-likes")
            .attr("x", 60)
            .attr("y", 18 * (i + 1))
            .attr("fill", cfg.TooltipColors[i]);
        // focus_arr.push(focus);
    }
    g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function () {
            // for (i = 0; i < cfg.noLines; i++)
            focus.style("display", null);
        })
        .on("mouseout", function () {
            // for (i = 0; i < cfg.noLines; i++)
            focus.style("display", "none");
        })
        .on("mousemove", mousemove);

    function mousemove() {
        console.log("mousemove");
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.name > d1.name - x0 ? d1 : d0;
        if (cfg.noLines == 1) {
            focus.attr("transform", "translate(" + x(d.name) + "," + y(d.value) + ")");
            focus.select(".tooltip-date").text(getFormedDate(d.name));
            focus.select("#tooltip0").text(d.value);
        }
        else {
            var y_corr = 0;
            for (i = 0; i < cfg.noLines; i++) {
                focus.select("#tooltip" + i).text(d.value[i]);
                y_corr += y(d.value[i]);
            }
            for (i = 0; i < cfg.noLines; i++) {
                focus.select('#tooltip_circle' + i).attr("transform", "translate(" + 0 + "," + (y(d.value[i]) - (y_corr / 2)) + ")");
            }
            focus.attr("transform", "translate(" + x(d.name) + "," + y_corr / 2 + ")");
            focus.select(".tooltip-date").text(d3.timeFormat("%b'%y")(d.name));
        }
    }
}

function histogramGraph(data, ID, cfg) {
    var svgWidth = cfg.width, svgHeight = cfg.height;
    var margin = cfg.margin;
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);

    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", 20)
        .attr("class", "graph-title")
        .attr("text-anchor", "middle")
        // .style("font-size", "18px")
        .text(cfg.title);

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().range([0, width]);
    //x.domain(d3.extent(data, function (d) { return d.wtime; }))
    x.domain([0, d3.max(data, function (d) { return d.value; })]);   // d3.hist has to be called before the Y axis obviously

    var y = d3.scaleLog().base(10).range([height, 0]);
    //y.domain([0, d3.max(data, function (d) { return d.jobs; })]);   // d3.hist has to be called before the Y axis obviously

    var histogram = d3.histogram()
        .value(function (d) { return d.value; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(100)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);
    // Y axis: scale and draw:

    y.domain([0.1, 1.1 * d3.max(bins, function (d) { return d.length; })])
    g.append("g").attr("class", "text2").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
    g.append("g").attr("class", "text2").call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    g.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) { console.log(d); return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("height", function (d) { return height - y(d.length); })
        .style("fill", "steelblue")

    //text label for x axis
    g.append("text").attr("transform", "translate(" + (svgWidth / 2) + " ," + (height + 40) + ")").style("text-anchor", "middle").text(cfg.labelx);

    //text label for y axis
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text(cfg.labely);
}

function heatmap(data, ID, cfg) {

    var svgWidth = cfg.width, svgHeight = cfg.height;
    var margin = cfg.margin;
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom - 50;

    var cellSizeWidth = width / cfg.n_date + 10;
    var cellSizeHeight = height / cfg.n_wtime;

    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);
    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", 20)
        .attr("class", "graph-title")
        .attr("text-anchor", "middle")
        // .style("font-size", "18px")
        .text(cfg.title);

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var defs = svg.append("defs");

    //Rainbow Gradient
    var coloursRainbow = ["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c", "#f9d057", "#f29e2e", "#e76818", "#d7191c"];
    var colourRangeRainbow = d3.range(0, 1, 1.0 / (coloursRainbow.length - 1));
    colourRangeRainbow.push(1);

    //Create color gradient
    var colorScaleRainbow = d3.scaleLinear()
        .domain(colourRangeRainbow)
        .range(coloursRainbow)
        .interpolate(d3.interpolateHcl);

    var colorInterpolateRainbow = d3.scaleLinear().range([0, 1]);
    colorInterpolateRainbow.domain(d3.extent(data, function (d) {
        return d.jobs
    }));

    defs.append("linearGradient")
        .attr("id", "gradient-rainbow-colors")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop")
        .data(coloursRainbow)
        .enter().append("stop")
        .attr("offset", function (d, i) { return i / (coloursRainbow.length - 1); })
        .attr("stop-color", function (d) { return d; });

    var x = d3.scaleTime().rangeRound([0, width]);
    var y = d3.scaleBand().range([height, 0]);
    var y1 = d3.scaleLinear().rangeRound([height, 0]);
    //interpolating data on rainbow scale
    x.domain(d3.extent(data, function (d) {
        return d.date;
    })).nice();
    y.domain(data.map(function (d) {
        return d.wtime;
    }));
    y1.domain(d3.extent(data, function (d) {
        return d.wtime
    }));

    //Plotting data
    var cells = g.selectAll('rect')
        .data(data)
        .enter().append('rect')
        .attr('class', 'cell')
        .attr('width', cellSizeWidth)
        .attr('height', cellSizeHeight)
        .attr('y', function (d) { return y1(d.wtime) - cellSizeHeight; })
        .attr('x', function (d) { return x(d.date); })
        .attr('fill', function (d) { return colorScaleRainbow(colorInterpolateRainbow(d.jobs)); })
        .attr("rx", 1)
        .attr("ry", 1);

    //Plotting axis
    g.append("g").attr("class", "text2").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(cfg.months).tickFormat(d3.timeFormat("%b'%y")));
    g.append("g").attr("class", "text2").call(d3.axisLeft(y1));
    //text label for x axis
    g.append("text").attr("transform", "translate(" + (svgWidth / 2) + " ," + (height + 40) + ")").style("text-anchor", "middle").text(cfg.labelx);

    //text label for y axis
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text(cfg.labely);

    //Plotting legends (https://gist.github.com/nbremer/5cd07f2cb4ad202a9facfbd5d2bc842e)
    var legendWidth = width * 0.6,
        legendHeight = 10;

    //Color Legend container
    var legendsvg = g.append("g")
        .attr("class", "legendWrapper")
        .attr("transform", "translate(" + (width / 2 - 10) + "," + (height + 50) + ")");

    //Draw the Rectangle
    legendsvg.append("rect")
        .attr("class", "legendRect")
        .attr("x", -legendWidth / 2)
        .attr("y", 10)
        //.attr("rx", legendHeight/2)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#gradient-rainbow-colors)");

    //Set scale for x-axis
    var xScale = d3.scaleLinear()
        .range([0, legendWidth])
        .domain([cfg.minn, cfg.maxx])
        .nice();

    //Define x-axis
    var xAxis = d3.axisBottom(xScale).ticks(10);

    //Set up X axis
    legendsvg.append("g")
        .attr("class", "axis")  //Assign "axis" class
        .attr("transform", "translate(" + (-legendWidth / 2) + "," + (10 + legendHeight) + ")")
        .call(xAxis);

}

function HorizontalBarGraph(data, ID, cfg) {

    var svgWidth = cfg.width, svgHeight = cfg.height;
    var margin = cfg.margin;
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
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set title
    svg.append("text")
        .attr("x", (width / 2.1))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("class", "graph-title")
        // .style("font-size", "1vw")
        .text(cfg.title);

    // Scale the range of the data in the domains
    x.domain([0, 1.1 * d3.max(data, function (d) { return d.nodes; })])
    y.domain(data.map(function (d) { return d.user; }));

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        //.attr("x", function(d) { return x(d.sales); })
        .attr("width", function (d) { return x(d.nodes); })
        .attr("y", function (d) { return y(d.user); })
        .attr("height", y.bandwidth())
        .attr("fill", function (d) { return colorScale(d.user); });

    svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label axis-labels')
        .attr('alignment-baseline', 'middle')
        .attr('x', function (d) { return x(d.nodes) + 5; })
        .attr('y', function (d) { return y(d.user) + y.bandwidth() / 1.5; })
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .text(function (d) { return d.nodes; });

    // add the y Axis
    svg.append("g")
        .attr("class", "axis-ticks")
        .call(d3.axisLeft(y));
}

function heatmap2(data, ID, cfg) {
    var svgWidth = cfg.width, svgHeight = cfg.height;
    var margin = cfg.margin;
    var width = svgWidth - margin.left - margin.right;
    var height = (svgHeight - margin.top - margin.bottom - 50);

    var rtime_groups = d3.map(data, function (d) { return d.rtime.join('-'); }).keys();
    var proc_groups = d3.map(data, function (d) { return d.proc.join('-'); }).keys();
    rtime_groups.sort(CompareHeatmapGroups);
    proc_groups.sort(CompareHeatmapGroups);

    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);
    var defs = svg.append("defs");

    //Rainbow Gradient
    var coloursRainbow = ["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c", "#f9d057", "#f29e2e", "#e76818", "#d7191c"];
    var colourRangeRainbow = d3.range(0, 1, 1.0 / (coloursRainbow.length - 1));
    colourRangeRainbow.push(1);

    //Create color gradient
    var colorScaleRainbow = d3.scaleLinear()
        .domain(colourRangeRainbow)
        .range(coloursRainbow)
        .interpolate(d3.interpolateHcl);

    var colorInterpolateRainbow = d3.scaleLinear().range([0, 1]);
    colorInterpolateRainbow.domain(d3.extent(data, function (d) {
        return d.val
    }));

    defs.append("linearGradient")
        .attr("id", "gradient-rainbow-colors")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop")
        .data(coloursRainbow)
        .enter().append("stop")
        .attr("offset", function (d, i) { return i / (coloursRainbow.length - 1); })
        .attr("stop-color", function (d) { return d; });

    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        // .style("font-size", "18px")
        .attr("class", "graph-title")
        .text(cfg.title);
    // Add subtitle to graph
    svg.append("text")
        .attr("x", margin.left)
        .attr("y", margin.top - 10)
        .attr("text-anchor", "left")
        .style("font-size", "16px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text(cfg.subtitle);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(rtime_groups)
        .padding(0.05);

    // Build Y scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(proc_groups)
        .padding(0.05);

    // create a tooltip
    var tooltip = d3.select("#chart_container")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip2")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    function str_pad_left(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }
    function str_pad_hours(string) {
        if (string > 10)
            return string;
        else if (string < 10 && string > 0)
            return '0' + string;
        else
            return '00';
    }
    function getTime(time) {
        var hours = Math.floor(time / 3600);
        time = time - hours * 3600;
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;

        return str_pad_hours(hours) + ':' + str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
    }
    var mousemove = function (d) {
        var x = d3.event.pageX - document.getElementById('chart_container').getBoundingClientRect().x + 10;
        var y = d3.event.pageY - document.getElementById('chart_container').getBoundingClientRect().y + 10;
        var message = '';
        if (margin.top > margin.bottom)
            message = "<b>Number of Jobs: </b>" + d.val + "<br>" + "<b>Hours Requested: </b>" + d.rtime.join('-') + "<br>" + "<b>CPUs Requested: </b>" + d.proc.join('-');
        else
            message = "<b>Avg wtime: </b>" + getTime(d.val) + "<br>" + "<b>Hours Requested: </b>" + d.rtime.join('-') + "<br>" + "<b>CPUs Requested: </b>" + d.proc.join('-');
        tooltip
            .html(message)
            .style("left", (x) + "px")
            .style("top", (y + 70) + "px")
    }
    var mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

    // add the squares
    g.selectAll()
        .data(data, function (d) { return d.rtime + ':' + d.proc; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.rtime.join('-')) })
        .attr("y", function (d) { return y(d.proc.join('-')) })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) { return colorScaleRainbow(colorInterpolateRainbow(d.val)); })
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    rtime_groups[rtime_groups.length - 1] = '>' + rtime_groups[rtime_groups.length - 1].split('-')[0];
    proc_groups[proc_groups.length - 1] = '>' + proc_groups[proc_groups.length - 1].split('-')[0];
    //Doing axis again
    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(rtime_groups)
        .padding(0.05);
    g.append("g")
        .style("font-size", 10)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(1))
    // .select(".domain").remove()

    // Build Y scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(proc_groups)
        .padding(0.05);
    g.append("g")
        .style("font-size", 10)
        .call(d3.axisLeft(y).tickSize(1))
    // .select(".domain").remove()

    //text label for x axis
    g.append("text").attr("transform", "translate(" + (svgWidth / 2) + " ," + (height + 40) + ")").style("text-anchor", "middle").text(cfg.labelx);

    //text label for y axis
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text(cfg.labely);


    //Plotting legends (https://gist.github.com/nbremer/5cd07f2cb4ad202a9facfbd5d2bc842e)
    var legendWidth = width * 0.6,
        legendHeight = 10;

    //Color Legend container
    var legendsvg = g.append("g")
        .attr("class", "legendWrapper")
        .attr("transform", "translate(" + (width / 2 - 10) + "," + (height + 50) + ")");

    //Draw the Rectangle
    legendsvg.append("rect")
        .attr("class", "legendRect")
        .attr("x", -legendWidth / 2)
        .attr("y", 10)
        //.attr("rx", legendHeight/2)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#gradient-rainbow-colors)");

    //Set scale for x-axis
    var xScale = d3.scaleLinear()
        .range([0, legendWidth])
        .domain(d3.extent(data, function (d) {
            if (margin.top > margin.bottom)
                return d.val;
            else
                return Math.ceil(d.val / 3600);
        })).nice();

    //Define x-axis
    var xAxis = d3.axisBottom(xScale).ticks(10);

    //Set up X axis
    legendsvg.append("g")
        .attr("class", "axis")  //Assign "axis" class
        .attr("transform", "translate(" + (-legendWidth / 2) + "," + (10 + legendHeight) + ")")
        .call(xAxis);

}

function heatmap3(data, ID, cfg) {
    var svgWidth = cfg.width, svgHeight = cfg.height;
    var margin = cfg.margin;
    var width = svgWidth - margin.left - margin.right;
    var height = (svgHeight - margin.top - margin.bottom - 50);

    var rtime_groups = d3.map(data, function (d) { return d.rtime.join('-'); }).keys();
    var proc_groups = d3.map(data, function (d) { return d.proc.join('-'); }).keys();
    rtime_groups.sort(CompareHeatmapGroups);
    proc_groups.sort(CompareHeatmapGroups);

    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);
    var defs = svg.append("defs");

    //Rainbow Gradient
    var coloursRainbow = ["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c", "#f9d057", "#f29e2e", "#e76818", "#d7191c"];
    var colourRangeRainbow = d3.range(0, 1, 1.0 / (coloursRainbow.length - 1));
    colourRangeRainbow.push(1);

    //Create color gradient
    var colorScaleRainbow = d3.scaleLinear()
        .domain(colourRangeRainbow)
        .range(coloursRainbow)
        .interpolate(d3.interpolateHcl);

    var colorInterpolateRainbow = d3.scaleLinear().range([0, 1]);
    colorInterpolateRainbow.domain(d3.extent(data, function (d) {
        return d.val
    }));

    defs.append("linearGradient")
        .attr("id", "gradient-rainbow-colors")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%")
        .selectAll("stop")
        .data(coloursRainbow)
        .enter().append("stop")
        .attr("offset", function (d, i) { return i / (coloursRainbow.length - 1); })
        .attr("stop-color", function (d) { return d; });

    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        // .style("font-size", "18px")
        .attr("class", "graph-title")
        .text(cfg.title);
    // Add subtitle to graph
    svg.append("text")
        .attr("x", margin.left)
        .attr("y", margin.top - 10)
        .attr("text-anchor", "left")
        // .style("font-size", "16px")
        .attr('class','axis-ticks')
        .style("fill", "grey")
        .style("max-width", 400)
        .text(cfg.subtitle);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(rtime_groups)
        .padding(0.05);

    // Build Y scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(proc_groups)
        .padding(0.05);

    // create a tooltip
    var tooltip = d3.select("#chart_container")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip2")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    function str_pad_left(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }
    function str_pad_hours(string) {
        if (string > 10)
            return string;
        else if (string < 10 && string > 0)
            return '0' + string;
        else
            return '00';
    }
    function getTime(time) {
        var hours = Math.floor(time / 3600);
        time = time - hours * 3600;
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;

        return str_pad_hours(hours) + ':' + str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
    }
    var mousemove = function (d) {
        var x = d3.event.pageX - document.getElementById('chart_container').getBoundingClientRect().x + 10;
        var y = d3.event.pageY - document.getElementById('chart_container').getBoundingClientRect().y + 10;
        var message = '';
        if (margin.top > margin.bottom)
            message = "<b>Number of Jobs: </b>" + d.val + "<br>" + "<b>Hours Requested: </b>" + d.rtime.join('-') + "<br>" + "<b>CPUs Requested: </b>" + d.proc.join('-');
        else
            message = "<b>Avg wtime: </b>" + getTime(d.val) + "<br>" + "<b>Hours Requested: </b>" + d.rtime.join('-') + "<br>" + "<b>CPUs Requested: </b>" + d.proc.join('-');
        tooltip
            .html(message)
            .style("left", (x) + "px")
            .style("top", (y + 70) + "px")
    }
    var mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

    // add the squares
    g.selectAll()
        .data(data, function (d) { return d.rtime + ':' + d.proc; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.rtime.join('-')) })
        .attr("y", function (d) { return y(d.proc.join('-')) })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) { return colorScaleRainbow(colorInterpolateRainbow(d.val)); })
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    rtime_groups[rtime_groups.length - 1] = '>' + rtime_groups[rtime_groups.length - 1].split('-')[0];
    proc_groups[proc_groups.length - 1] = '>' + proc_groups[proc_groups.length - 1].split('-')[0];
    //Doing axis again
    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(rtime_groups)
        .padding(0.05);
    g.append("g")
        // .style("font-size", 10)
        .attr('class','axis-ticks')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(1));
        // .selectAll("text").style("text-anchor", "end").attr("dx", "0em").attr("dy", "1em").attr("transform", "rotate(-25)");
    // .select(".domain").remove()

    // Build Y scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(proc_groups)
        .padding(0.05);
    g.append("g")
        // .style("font-size", 10)
        .attr('class','axis-ticks')
        .call(d3.axisLeft(y).tickSize(1));
    // .select(".domain").remove()

    //text label for x axis
    g.append("text").attr('class','axis-labels').attr("transform", "translate(" + (svgWidth / 2) + " ," + (height + 40) + ")").style("text-anchor", "middle").text(cfg.labelx);

    //text label for y axis
    g.append("text").attr('class','axis-labels').attr("transform", "rotate(-90)").attr("y", 0 - margin.left - 5).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text(cfg.labely);

    // Function to convert numbers to K,M,B
    function convertNum (labelValue) {

        if(Math.abs(Number(labelValue)) >= 1.0e+9) {
            return (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(1).concat("B");  
        } else if(Math.abs(Number(labelValue)) >= 1.0e+6) {
            return (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1).concat("M");
        } else if(Math.abs(Number(labelValue)) >= 1.0e+3) {
            return (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(1).concat("K");
        } else {
            return labelValue;
        }
    }    
    //Plotting legends (https://gist.github.com/nbremer/5cd07f2cb4ad202a9facfbd5d2bc842e)
    var legendWidth = 10,
        legendHeight = height;

    //Color Legend container
    var legendsvg = g.append("g")
        .attr("class", "legendWrapper")
        .attr("transform", "translate(" + (width) + "," + (0) + ")");

    //Draw the Rectangle
    legendsvg.append("rect")
        .attr("class", "legendRect")
        .attr("x", 20)
        .attr("y", 0)
        //.attr("rx", legendHeight/2)
        .attr("height", legendHeight)
        .attr("width", legendWidth)
        .style("fill", "url(#gradient-rainbow-colors)");

    //Set scale for x-axis
    var yScale = d3.scaleLinear()
        .range([0, legendHeight])
        .domain(d3.extent(data, function (d) {
            if (margin.top > margin.bottom){
                // console.log(convertNum(d.val));
                return d.val;
            }
            else
                return Math.ceil(d.val / 3600);
        })).nice();

        //Define x-axis
    var yAxis = d3.axisRight(yScale)
                .ticks(4);

    //Set up X axis
    legendsvg.append("g")
        .attr("class", "axis axis-ticks")  //Assign "axis" class
        .attr("transform", "translate(" + (25) + "," + (0) + ")")
        .call(yAxis);

}

function StackBarChart(data, ID, cfg) {
    var svgWidth = cfg.width, svgHeight = cfg.height;
    var margin = cfg.margin;
    var width = svgWidth - margin.left - margin.right;
    var height = (svgHeight - margin.top - margin.bottom);

    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("text")
        .attr("x", (width / 2))
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("class", "graph-title")
        // .style("font-size", "18px")
        .text(cfg.title);

    var keys = ['Completed', 'Failed', 'Cancelled'];
    // Set x, y and colors
    var x = d3.scaleBand().range([0, width]).padding(0.5);
    x.domain(data.map(function (d) {
        return d.id;
    }));

    var y = d3.scaleLinear().clamp(true).rangeRound([height, 0]);
    y.domain([0, 100]);

    // set the colors
    var z = d3.scaleOrdinal().range(["#98FB98", "#FF6347", "#ffba21"]);

    var stackedData = d3.stack().keys(['completed', 'failed', 'cancelled'])(data);
    // console.log(stackedData);

    // Prep the tooltip bits, initial display is hidden
    var tooltip = svg.append("g")
        .attr("class", "tooltip2");
    // .style("display", "none");

    tooltip.append("rect")
        .attr("width", 60)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);

    tooltip.append("text")
        .attr("x", 30)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("font-weight", "bold");

    g.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function (d) { return z(d.key); })
        .selectAll("rect")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("x", function (d) { return x(d.data.id); })
        .attr("y", function (d) { return y(d[1]); })
        .attr("height", function (d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
        .on("mouseover", function () { tooltip.style("display", null); })
        .on("mouseout", function () { tooltip.style("display", "none"); })
        .on("mousemove", function (d) {
            var xPosition = d3.mouse(this)[0];
            var yPosition = d3.mouse(this)[1] + 40;
            tooltip.attr("transform", "translate(" + (margin.left + xPosition) + "," + yPosition + ")");
            tooltip.select("text").text(d[1] - d[0]);
        });

    // add the x Axis
    g.append("g").attr("class", "axis-ticks").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x)).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

    // add the y Axis
    g.append("g").attr("class", "axis-ticks").call(d3.axisLeft(y));

    //text label for x axis
    g.append("text").attr("class", "axis-labels").attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 10) + ")").style("text-anchor", "middle").text(cfg.labelx);

    //text label for y axis
    g.append("text").attr("class", "axis-labels").attr("transform", "rotate(-90)").attr("y", -80).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text(cfg.labely);

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("class", "axis-ticks")
        .attr("font-size", 13)
        .attr("text-anchor", "start")
        .selectAll("g")
        .data(keys.slice())
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 20)
        .attr("width", 25)
        .attr("height", 25)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width + 8)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) { return d; });

}

function PieChart(data, ID, cfg) {
    // var thickness = screen./width / 65;

    var svgWidth = cfg.width, svgHeight = cfg.height;
    var margin = cfg.margin;
    var width = svgWidth - margin.left - margin.right;
    var height = (svgHeight - margin.top - margin.bottom);
    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var svg = d3.select("#" + ID)
        .append('svg')
        .attr('class', 'pie')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    var g = svg.append('g').attr('transform', 'translate(' + svgWidth / 2 + "," + svgHeight / 1.8 + ')');

    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("class", "graph-title")
        // .style("font-size", "110%") 
        .text(cfg.title);
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) { return d.value; })
        .sort(null);

    g.selectAll('mySlices')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) { return (color(d.data.name)) })
        .attr("stroke", "white")
        .style("stroke-width", "0.5px")
        .style("opacity", 0.7)

    // Now add the annotation. Use the centroid method to get the best coordinates
    g.selectAll('mySlices')
        .data(pie(data))
        .enter()
        .append('text')
        .text(function (d) { return d.data.name })
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .style("font-size", 10)


    // var path = g.selectAll('path')
    //     .data(pie(data))
    //     .enter()
    //     .append("g")
    //     .on("mouseover", function (d) {

    //     })
    //     .on("mouseout", function (d) {

    //     })
    //     .append('path')
    //     .attr('d', arc)
    //     .text("Testing text ")
    //     .attr('fill', function (d, i) { return d.data.name == 'NIL' ? "#e5e5e5" : color(i) })
    //     .on("mouseover", function (d) {

    //     })
    //     .on("mouseout", function (d) {

    //     })
    // g.selectAll('path')
    //     .data(data)
    //     .enter()
    //     .append('text')
    //     .text(function(d){ return "grp " + d.data.name})
    //     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
    //     .style("text-anchor", "middle")
    //     .style("font-size", 17)
}

function PieChart2(data, ID, cfg) {
    var svgWidth = cfg.width, svgHeight = cfg.height;
    var margin = cfg.margin;
    var width = svgWidth - margin.left - margin.right;
    var height = (svgHeight - margin.top - margin.bottom);
    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var svg = d3.select("#" + ID).append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var g = svg.append('g').attr('transform', 'translate(' + svgWidth / 2 + "," + svgHeight / 1.8 + ')');

    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("class", "graph-title")
        // .style("font-size", "110%") 
        .text(cfg.title);

    g.append("g")
        .attr("class", "slices");
    g.append("g")
        .attr("class", "labels");
    g.append("g")
        .attr("class", "lines");

    var pie = d3.pie().value(function (d) { return d.value; }).sort(null);
    var arc = d3.arc().innerRadius(0).outerRadius(radius * 0.7);

    var outerArc = d3.arc().outerRadius(radius * 0.8).innerRadius(radius * 0.8);

    g.attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 1.8 + ")");

    g.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) { return (color(d.data.name)) });
    g.append('g').classed('labels', true);
    g.append('g').classed('lines', true);


    var polyline = g.select('.lines')
        .selectAll('polyline')
        .data(pie(data))
        .enter().append('polyline')
        .attr('points', function (d) {
            // see label transform function for explanations of these three lines.
            var pos = outerArc.centroid(d);
            pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            pos[1] = pos[1];
            return [arc.centroid(d), outerArc.centroid(d), pos]
        });

    var label = g.select('.labels').selectAll('text')
        .data(pie(data))
        .enter().append('text')
        .attr("class", "axis-ticks")
        .attr('dy', '.35em')
        .html(function (d) {
            return d.data.name + "( " + d.data.value + " )";
        })
        .attr('transform', function (d) {
            var pos = outerArc.centroid(d);
            pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function (d) {
            return (midAngle(d)) < Math.PI ? 'start' : 'end';
        });


    // OVerlapping Text boxes
    // var prev;
    // var textOffset = 14;
    // // var radius = 0;
    // label.each(function(d, i) {
    //     if(i > 0) {
    //     var thisbb = this.getBoundingClientRect(),
    //         prevbb = prev.getBoundingClientRect();
    //     // move if they overlap
    //     if(!(thisbb.right < prevbb.left || thisbb.left > prevbb.right || thisbb.bottom < prevbb.top || thisbb.top > prevbb.bottom)) {
    //         var ctx = thisbb.left + (thisbb.right - thisbb.left)/2,
    //             cty = thisbb.top + (thisbb.bottom - thisbb.top)/2,
    //             cpx = prevbb.left + (prevbb.right - prevbb.left)/2,
    //             cpy = prevbb.top + (prevbb.bottom - prevbb.top)/2,
    //             off = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2))/2;
    //             console.log(Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2))*(radius + textOffset + off));
    //             console.log(Math.sin((d.startAngle + d.endAngle - Math.PI) / 2)*(radius + textOffset + off));
    //         d3.select(this).attr("transform",
    //             "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) *
    //                                     (radius + textOffset + off) + "," +
    //                             Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) *
    //                                     (radius + textOffset + off) + ")");
    //     }
    //     }
    //     prev = this;
    // });

    //  svg.append('text')
    //     .attr('class', 'toolCircle')
    //     .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
    //     .html('sdfsd') // add text to the circle.
    //     .style('font-size', '.9em')
    //     .style('text-anchor', 'middle');

    function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

    // const nodes = this.texts.nodes();
    // console.log(label._parents);
    // for (let i = 0; i < nodes.length; i++) {
    //     for (let j = i + 1; j < nodes.length; j++) {
    //     const previous = nodes[i];
    //     const elem = nodes[j];
    //     const thisbb = elem.getBoundingClientRect(),
    //         prevbb = previous.getBoundingClientRect();
    //     if (!(thisbb.right < prevbb.left ||
    //         thisbb.left > prevbb.right ||
    //         thisbb.bottom < prevbb.top ||
    //         thisbb.top > prevbb.bottom)) {
    //         const matrix = previous.transform.baseVal.consolidate().matrix;
    //         d3.select(elem).attr('transform', `translate(${matrix.e}, ${matrix.f + prevbb.bottom - prevbb.top})`);

    //     }
    //     const elemMatrix = elem.transform.baseVal.consolidate().matrix;
    //     pieData[j].pos = [elemMatrix.e, elemMatrix.f];
    // }
}

function PieChart3(data, ID, cfg) {
    
    var svg = d3.select("svg"),
        width = +500,
        height = +200,
        radius = Math.min(width, height) / 2,
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var labels = d3.select("#labels");

    var color = d3.scaleOrdinal(["#98abc5",
        "#8a89a6",
        "#7b6888",
        "#6b486b",
        "#a05d56",
        "#d0743c",
        "#ff8c00",
        "#e34d01",
        "#ccff05",
        "#3e7eca",
        "#aa0092",
        "#b32e4f"]);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) { return d.market_cap; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);


    var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var csvData = "currency,market_cap\n";
    csvData += "Ethereum,28479743440\n";
    csvData += "Ripple,8082383399\n";
    csvData += "Bitcoin Cash,8767760760\n";
    csvData += "Litecoin,3642098421\n";
    csvData += "NEM,2514744000\n";
    csvData += "Dash,2363329943\n";
    csvData += "IOTA,1706859515\n";
    csvData += "Ethereum Classic,1539824432\n";
    csvData += "NEO,1138990000\n";
    csvData += "Monero,1761024916\n";
    csvData += "Stratis,569824176\n";
    csvData += "Bitcoin,70807286162\n";
    var data = d3.csvParse(csvData);
    data.forEach(function (d) {
        d.market_cap = +d.market_cap;
        return d;
    });

    var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");



    arc.append("path")
        .attr("d", path)
        .attr("fill", function (d) { return color(d.data.currency); });

    // Now we'll draw our label lines, etc.
    //--------------------------------------------

    arc.append("text")

        .attr("transform", function (d, i) {
            var pos = outerArc.centroid(d);
            pos[0] = radius * (midAngle(d) < Math.PI ? 1.1 : -1.1);


            var percent = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100
            if (percent < 3) {
                //console.log(percent)
                pos[1] += i * 15
            }
            return "translate(" + pos + ")";
        })
        .text(function (d) { return d.data.currency; })
        .attr("fill", function (d, i) { return color(i); })
        .attr("text-anchor", 'left')
        .attr("dx", function (d) {
            var ac = midAngle(d) < Math.PI ? 0 : -50
            return ac
        })
        .attr("dy", 5)


    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    var polyline = g.selectAll("polyline")
        .data(pie(data), function (d) {
            return d.data.currency;
        })
        .enter()
        .append("polyline")
        .attr("points", function (d, i) {
            var pos = outerArc.centroid(d);
            pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            var o = outerArc.centroid(d)
            var percent = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100
            if (percent < 3) {
                //console.log(percent)
                o[1]
                pos[1] += i * 15
            }
            //return [label.centroid(d),[o[0],0[1]] , pos];
            return [label.centroid(d), [o[0], pos[1]], pos];
        })
        .style("fill", "none")
        //.attr('stroke','grey')
        .attr("stroke", function (d, i) { return color(i); })
        .style("stroke-width", "1px");
}

function PredictionLineChart(data, ID, cfg) {
    console.log(ID);
    var svgWidth = cfg.width, svgHeight = cfg.height;
    var margin = cfg.margin;
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    // console.log(cfg.title,width,svgHeight,margin.top,margin.bottom,height);
    var svg = d3.select("#" + ID).append("svg").attr("width", svgWidth).attr("height", svgHeight);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleLinear().rangeRound([0, width]);
    var y = d3.scaleLinear().rangeRound([height, 0]);

    var value_arr = []
    if (cfg.noLines == 1) {
        value_arr = d3.extent(data, function (d) { return d.value });
    }
    else {
        for (i = 0; i < cfg.noLines; i++) {
            temp = d3.extent(data, function (d) { return d.value[i] });
            value_arr = value_arr.concat(temp);
        }
    }

    var xExtent = d3.extent(data, function (d) { return d.name; }),
        xRange = xExtent[1] - xExtent[0],
        yExtent = d3.extent(value_arr, function (d) { return d; }),
        yRange = yExtent[1] - yExtent[0];

    x.domain([xExtent[0] - (xRange * .05), xExtent[1] + (xRange * .05)]);
    y.domain([yExtent[0] - (yRange * .05), yExtent[1] + (yRange * .05)]);

    var lines = []
    if (cfg.noLines == 1) {
        var line = d3.line().x(function (d) {
            return x(d.name)
        }).y(function (d) {
            return y(d.value)
        });
        lines.push(line);
    }
    else {
        for (i = 0; i < cfg.noLines; i++) {
            var line = d3.line().x(function (d) {
                return x(d.name)
            }).y(function (d) {
                return y(d.value[i])
            });
            lines.push(line);
        }
    }
    g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
    g.append("g").call(d3.axisLeft(y));

    // plotting line(s)
    for (i = 0; i < cfg.noLines; i++) {
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", cfg.LineColors[i])
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", lines[i]);
    }
    //text label for x axis
    g.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + 10) + ")")
        .attr("dy", "0.2em")
        // .attr("class", "axis-labels")
        .style("text-anchor", "middle")
        .text(cfg.labelx);

    //text label for y axis
    g.append("text")
        .attr("transform", "rotate(-90)").attr("y", -margin.left).attr("x", 0 - (height / 2))
        .attr("dy", "0.7em")
        // .attr("class", "axis-labels")
        .style("text-anchor", "middle")
        .text(cfg.labely);

    // // Plotting legends if any
    // if(cfg.noLines > 1)
    // {
    //     var lineLegend = g.selectAll(".lineLegend").data(cfg.legend_keys)
    //         .enter().append("g")
    //         .attr("class", "lineLegend")
    //         .attr("class", "lineLegend axis-ticks")
    //         .attr("transform", function (d, i) {
    //             return "translate(" + width*0.95 + "," + (i * 30) + ")";
    //         });
    //     lineLegend.append("text").text(function (d) { return d; }).attr("transform", "translate(-60,9)"); //align texts with boxes
    //     lineLegend.append("rect").attr("fill", function (d, i) { return cfg.LineColors[i]; }).attr("width", 10).attr("height", 10).attr("transform", "translate(-80,0)");
    // }

    // //Divides date for tooltip placement
    // var bisectDate = d3.bisector(function (d) { return d.name; }).left;

    // var focus_arr = []
    // for (i = 0; i < cfg.noLines; i++) {

    //     var focus = g.append("g")
    //         .attr("class", "focus")
    //         .style("display", "none");

    //     focus.append("circle")
    //         .attr("r", 5)
    //         .attr("fill", cfg.TooltipColors[i]);

    //     focus.append("rect")
    //         .attr("class", "tooltip")
    //         .attr("width", 100)
    //         .attr("height", 50)
    //         .attr("x", 10)
    //         .attr("y", -22)
    //         .attr("rx", 4)
    //         .attr("ry", 4);

    //     focus.append("text")
    //         .attr("class", "tooltip-date")
    //         .attr("x", 18)
    //         .attr("y", -2)
    //         .attr("fill", cfg.TooltipColors[i]);

    //     focus.append("text")
    //         .attr("x", 18)
    //         .attr("y", 18)
    //         .attr("fill", cfg.TooltipColors[i])
    //         .text("Value:");

    //     focus.append("text")
    //         .attr("class", "tooltip-likes")
    //         .attr("x", 60)
    //         .attr("y", 18)
    //         .attr("fill", cfg.TooltipColors[i]);
    //     focus_arr.push(focus);
    // }
    // g.append("rect")
    //     .attr("class", "overlay")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .on("mouseover", function() { 
    //             for (i = 0; i < cfg.noLines; i++)
    //                 focus_arr[i].style("display", null); 
    //         })
    //     .on("mouseout", function() { 
    //             for (i = 0; i < cfg.noLines; i++)
    //                 focus_arr[i].style("display", "none");  
    //         })
    //     .on("mousemove", mousemove);

    // function mousemove() {
    //     console.log("mousemove");
    //     var x0 = x.invert(d3.mouse(this)[0]),
    //         i = bisectDate(data, x0, 1),
    //         d0 = data[i - 1],
    //         d1 = data[i],
    //         d = x0 - d0.name > d1.name - x0 ? d1 : d0;
    //     if (cfg.noLines == 1) {
    //         focus_arr[0].attr("transform", "translate(" + x(d.name) + "," + y(d.value) + ")");
    //         focus_arr[0].select(".tooltip-date").text(getFormedDate(d.name));
    //         focus_arr[0].select(".tooltip-likes").text(d.value);
    //     }
    //     else {
    //         for (i = 0; i < cfg.noLines; i++) {
    //             focus_arr[i].attr("transform", "translate(" + x(d.name) + "," + y(d.value[i]) + ")");
    //             focus_arr[i].select(".tooltip-date").text(d3.timeFormat("%b'%y")(d.name));
    //             focus_arr[i].select(".tooltip-likes").text(d.value[i]);
    //         } 
    //     }
    // }
}

function DonutChart(data, id, text, data2) {
    console.log(data2['users']);
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
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("class", "graph-title")
        // .style("font-size", "110%") 
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
            document.getElementById('stats').classList.add('hide');
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
            document.getElementById('stats').classList.remove('hide');

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

    let g2 = g.append("g")
        .attr('id', 'stats')
        .attr('transform', 'translate(' + (1.8 * radius) + ',' + (-30) + ')')
        .attr("class", "text-group");

    g2.append("text")
        .attr("class", "name-text")
        .text("#Running Jobs : ")
        .style("font-weight", "bold")
        .attr('text-anchor', 'left')
        .attr('dy', '-1.2em')
        .style('font-size', screen.width / 120)
        .attr('dx', '-3.5em');

    g2.append("text")
        .attr("class", "name-text")
        .text(data2['running'])
        .attr('text-anchor', 'left')
        .attr('dx', '5em')
        .style('font-size', screen.width / 120)
        .attr('dy', '-1.2em');

    g2.append("text")
        .attr("class", "name-text")
        .text("#Queued Jobs : ")
        .style("font-weight", "bold")
        .attr('text-anchor', 'left')
        .attr('dy', '.6em')
        .style('font-size', screen.width / 120)
        .attr('dx', '-3.5em');

    g2.append("text")
        .attr("class", "value-text")
        .text(data2['queued'])
        .attr('text-anchor', 'left')
        .attr('dx', '5em')
        .style('font-size', screen.width / 120)
        .attr('dy', '.6em');

    g2.append("text")
        .attr("class", "name-text")
        .text("Active Nodes : ")
        .style("font-weight", "bold")
        .attr('text-anchor', 'left')
        .attr('dy', '2.4em')
        .style('font-size', screen.width / 120)
        .attr('dx', '-3.5em');

    g2.append("text")
        .attr("class", "name-text")
        .text(data2['active'])
        .attr('text-anchor', 'left')
        .attr('dx', '5em')
        .style('font-size', screen.width / 120)
        .attr('dy', '2.4em');

    g2.append("text")
        .attr("class", "name-text")
        .text("Active Users : ")
        .style("font-weight", "bold")
        .attr('text-anchor', 'left')
        .attr('dy', '4.2em')
        .style('font-size', screen.width / 120)
        .attr('dx', '-3.5em');

    g2.append("text")
        .attr("class", "name-text")
        .text(data2['users'])
        .attr('text-anchor', 'left')
        .attr('dx', '5em')
        .style('font-size', screen.width / 120)
        .attr('dy', '4.2em');

    g2.append("text")
        .attr("class", "name-text")
        .text("Machine Usage : ")
        .style("font-weight", "bold")
        .attr('text-anchor', 'left')
        .attr('dy', '6em')
        .style('font-size', screen.width / 120)
        .attr('dx', '-3.5em');

    g2.append("text")
        .attr("class", "name-text")
        .text(data2['usage'])
        .attr('text-anchor', 'left')
        .style('font-size', screen.width / 120)
        .attr('dx', '5em')
        .attr('dy', '6em');
    // document.getElementById('stats').classList.add('hide');
}

// function BoxPlot(data,ID,cfg){
//     console.log(data);
//     globalCounts = data[0];
//     groupCounts = data[1];
//     var svgWidth = cfg.width, svgHeight = cfg.height;
//     var margin = cfg.margin;
//     var width = svgWidth - margin.left - margin.right;
//     var height = (svgHeight - margin.top - margin.bottom);
//     var barWidth = 40;
//     var boxPlotColor = "#898989";
//     var medianLineColor = "#ffffff";
//     var axisColor = "#898989";

//     var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);
//     var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     // Move axis to center align the bars with the xAxis ticks
//     var yAxisBox = svg.append("g").attr("transform", "translate(40,0)");
//     var xAxisBox = svg.append("g").attr("transform", "translate(40,0)");

//     g.append("text")
//         .attr("x", (width / 2))
//         .attr("y", 0)
//         .attr("text-anchor", "middle")
//         .attr("class","graph-title")
//         // .style("font-size", "18px")
//         .text(cfg.title);

//     // Prepare the data for the box plots
//     var plotData = [];
//     var colorIndex = 0.1;
//     var colorIndexStepSize = 0.08;
//     for (var [key, groupCount] of Object.entries(groupCounts)) {
//         var record = {};
//         var localMin = d3.min(groupCount);
//         var localMax = d3.max(groupCount);

//         record["key"] = key;
//         record["counts"] = groupCount;
//         record["quartile"] = boxQuartiles(groupCount);
//         record["whiskers"] = [localMax, localMin];
//         record["color"] = d3.interpolateInferno(colorIndex);

//         plotData.push(record);
//         colorIndex += colorIndexStepSize;
//     }
//     // // Create Tooltips
//     // var tip = d3.tip().attr('class', 'd3-tip').direction('e').offset([0,5])
//     //     .html(function(d) {
//     //         var content = "<span style='margin-left: 2.5px;'><b>" + d.key + "</b></span><br>";
//     //         content +=`
//     //             <table style="margin-top: 2.5px;">
//     //                     <tr><td>Max: </td><td style="text-align: right">` + d3.format(".2f")(d.whiskers[0]) + `</td></tr>
//     //                     <tr><td>Q3: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[0]) + `</td></tr>
//     //                     <tr><td>Median: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[1]) + `</td></tr>
//     //                     <tr><td>Q1: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[2]) + `</td></tr>
//     //                     <tr><td>Min: </td><td style="text-align: right">` + d3.format(".2f")(d.whiskers[1]) + `</td></tr>
//     //             </table>
//     //             `;
//     //         return content;
//     //     });
//     // svg.call(tip);

//     console.log(Object.keys(groupCounts));
//     // Compute an ordinal xScale for the keys in plotData
//     var xScale = d3.scalePoint()
//     .domain(Object.keys(groupCounts))
//     .rangeRound([0, width])
//     .padding([0.5]);


//     // Compute a global y scale based on the global counts
//     var min = d3.min(globalCounts);
//     var max = d3.max(globalCounts);
//     var yScale = d3.scaleLinear()
//         .range([height, 0])
//         .domain([min, max])
//         .nice();


//     // Draw the box plot vertical lines
//     var verticalLines = g.selectAll(".verticalLines")
//     .data(plotData)
//     .enter()
//     .append("line")
//     .attr("x1", d => { return xScale(d.key) + barWidth/2; })
//     .attr("y1", d =>  { return yScale(d.whiskers[0]); })
//     .attr("x2", d =>  { return xScale(d.key) + barWidth/2; })
//     .attr("y2", d => { return yScale(d.whiskers[1]); })
//     .attr("stroke", boxPlotColor)
//     .attr("stroke-width", 1)
//     .attr("stroke-dasharray", "5,5")
//     .attr("fill", "none");

//     // Draw the boxes of the box plot, filled in white and on top of vertical lines
//     var rects = g.selectAll("rect")
//     .data(plotData)
//     .enter()
//     .append("rect")
//     .attr("width", barWidth)
//     .attr("height", d => { return yScale(d.quartile[2]) - yScale(d.quartile[0]); })
//     .attr("x", d => { return xScale(d.key); })
//     .attr("y", d => { return yScale(d.quartile[0]); })
//     .attr("fill", d => { return d.color; })
//     .attr("stroke", boxPlotColor)
//     .attr("stroke-width", 1)
//     // .on('mouseover', tip.show)
//     // .on('mouseout', tip.hide);

//     // Config for whiskers and median
//     var horizontalLineConfigs = [
//     {   // Top whisker
//         x1: d => { return xScale(d.key) },
//         y1: d => { return yScale(d.whiskers[0]) },
//         x2: d => { return xScale(d.key) + barWidth },
//         y2: d => { return yScale(d.whiskers[0]) },
//         color: boxPlotColor
//     },
//     {   // Median
//         x1: d => { return xScale(d.key) },
//         y1: d => { return yScale(d.quartile[1]) },
//         x2: d => { return xScale(d.key) + barWidth },
//         y2: d => { return yScale(d.quartile[1]) },
//         color: medianLineColor
//     },
//     {   // Bottom whisker
//         x1: d => { return xScale(d.key) },
//         y1: d => { return yScale(d.whiskers[1]) },
//         x2: d => { return xScale(d.key) + barWidth },
//         y2: d => { return yScale(d.whiskers[1]) },
//         color: boxPlotColor
//     }
//     ];

//     // Draw the whiskers and median line
//     for(var i=0; i < horizontalLineConfigs.length; i++) {
//         var lineConfig = horizontalLineConfigs[i];
//         var horizontalLine = g.selectAll(".whiskers")
//             .data(plotData)
//             .enter()
//             .append("line")
//             .attr("x1", lineConfig.x1)
//             .attr("y1", lineConfig.y1)
//             .attr("x2", lineConfig.x2)
//             .attr("y2", lineConfig.y2)
//             .attr("stroke", lineConfig.color)
//             .attr("stroke-width", 1)
//             .attr("fill", "none");
//     }

//     // add the Y gridlines
//     svg.append("g")
//         .attr("transform", "translate(40,0)")			
//         .attr("class", "grid")
//         .call(d3.axisLeft(yScale)
//             .tickSize(-width)
//             .tickFormat("")
//         )

//     // Setup a scale on the left
//     var yAxis = d3.axisLeft(yScale).ticks(6)
//     yAxisBox.append("g")
//         .attr("class", "y axis")
//         .call(yAxis);

//     // Setup a series axis on the bottom
//     var xAxis = d3.axisBottom(xScale);
//     xAxisBox.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);

// }