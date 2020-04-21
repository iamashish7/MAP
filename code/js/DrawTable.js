var months, years, dates;
function myDrawChart(d) {
    months = Math.min(d.months, 18);
    years = d.years;
    dates = Math.min(d.dates, 18);
    console.log("Months: ", months, "Years : ", years, "Dates : ", dates);
    var data = d.data;
    var ID = Number.parseInt(d.ID);
    var arr = [];
    var minn = 10000000, maxx = 0, count2 = 0;
    var set_date = new Set();
    var set_wtime = new Set();

    for (var i in data) {
        if (ID === 2) {
            minn = Math.min(minn, parseInt(+data[i][0]), parseInt(+data[i][1]));
            maxx = Math.max(maxx, parseInt(+data[i][0]), parseInt(+data[i][1]));
            arr.push({
                date: new Date(i), //date
                value: [+data[i][0], +data[i][1]] //convert string to number  
            });
        } 
        else if (ID === 1) {
            count2++;
            minn = Math.min(minn, parseInt(+data[i]));
            maxx = Math.max(maxx, parseInt(+data[i]));
            arr.push({
                date: new Date(i), //date
                value: +data[i] //convert string to number         
            });
        } else if (ID === 3) {
            arr.push({
                status: i,
                value: +data[i] //convert string to number  
            });
        } else if (ID === 4) {
            arr.push({
                queue: i,
                value: +data[i] //convert string to number  
            });
        } else if (ID === 5) {
            arr.push({
                id: +i,
                hours: +data[i] //convert string to number  
            });
        } else if (ID === 6) {
            minn = Math.min(minn, parseInt(data[i]));
            maxx = Math.max(maxx, parseInt(data[i]));
            var obj = JSON.parse(i);
            set_date.add(obj.wtime);
            set_wtime.add(obj.date);
            arr.push({
                wtime: +obj.wtime,
                date: new Date(obj.date), //convert string to number
                jobs: +data[i]
            });
        } else if (ID === 7) {
            arr.push({
                id: +i,
                wtime: +data[i] //convert string to number  
            });
        }
    }
    //console.log(arr);
    //console.log(set_date);
    //console.log(set_wtime);
    if (ID === 1) {
        drawChart(arr, "chart1");
    } else if (ID === 2) {
        drawChart2(arr, "chart1", minn, maxx);
    } else if (ID === 3) {
        drawChart3(arr, "chart1");
    } else if (ID === 4) {
        drawChart4(arr, "chart1");
    } else if (ID === 5) {
        drawChart5(arr, "chart1");
    } else if (ID === 6) {
        drawChart6(arr, "chart1", minn, maxx, set_date.size, set_wtime.size);
    } else if (ID === 7) {
        drawChart7(arr, "chart1");
    } else if (ID === 8) {
        drawChart8(arr, "chart1");
    }
}
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
function drawChart(data, ID) {
    var svgWidth = screen.width * 0.76,
        svgHeight = screen.height * 0.7;
    var margin = {
        top: 30,
        right: 40,
        bottom: 75,
        left: 70
    };
    if (months <= 3) {
        margin.bottom = 130;
    }
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);
    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Number of Jobs executing per day");
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleTime().rangeRound([0, width]);
    var y = d3.scaleLinear().rangeRound([height, 0]);
    x.domain(d3.extent(data, function (d) {
        return d.date;
    })).nice();
    y.domain(d3.extent(data, function (d) {
        return d.value
    }));
    console.log(d3.extent(data, function (d) {
        return d.value
    }));
    console.log([minn*0.8, 1.1 * maxx]);
    
    var line = d3.line().x(function (d) {
        return x(d.date)
    }).y(function (d) {
        return y(d.value)
    });
    if (months <= 3) {
        g.append("g").attr("class", "text2").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(dates).tickFormat(d3.timeFormat("%d-%b-%y"))).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
    }
    else {
        g.append("g").attr("class", "text2").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(months).tickFormat(d3.timeFormat("%b'%y")));
    }
    g.append("g").attr("class", "text2").call(d3.axisLeft(y));
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    //text label for x axis
    g.append("text")
        .attr("transform", "translate(" + (svgWidth / 2) + " ," + (svgHeight - margin.top - 20) + ")")
        .attr("dy", "0.2em")
        .style("text-anchor", "middle")
        .text("Timestamp");

    //text label for y axis
    g.append("text")
        .attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2))
        .attr("dy", "0.7em")
        .style("text-anchor", "middle")
        .text("Jobs");

    //Divides date for tooltip placement
    var bisectDate = d3.bisector(function (d) { return d.date; }).left;
    
    //Tooltips
    var focus = g.append("g").attr("class", "focus").style("display", "none");

    //Adds circle to focus point on line
    focus.append("circle").attr("r", 4);

    //Adds text to focus point on line    
    focus.append("text").attr('id', 'date').attr("x", 8).attr("dy", ".35em");
    focus.append("text").attr('id', 'jobs').attr("x", 8).attr("dy", "1.35em");

    //Creates larger area for tooltip   
    var overlay = g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .style("opacity", 0.0)
        .on("mouseover", function () { focus.style("display", null); })
        .on("mouseout", function () { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    //Tooltip mouseovers            
    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
        focus.select("#date").text("Date : " + getFormedDate(d.date));
        focus.select("#jobs").text("Jobs : " + d.value);
    }
}

function drawChart2(data, ID, minn, maxx) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    //console.log(data);
    var svgWidth = screen.width * 0.76,
        svgHeight = screen.height * 0.7;
    var margin = {
        top: 30,
        right: 30,
        bottom: 60,
        left: 80
    };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);
    // svg.append("text")
    //     .attr("x", (svgWidth / 2))
    //     .attr("y", 20)
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "18px")
    //     .text("Job queued and Jobs completed per month");

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleTime().rangeRound([0, width]);
    var y = d3.scaleLog().base(10).range([height, 0]).nice();
    var line = d3.line()
        .x(function (d) {
            return x(d.date)
        })
        .y(function (d) {
            return y(d.value[0])
        });

    var line2 = d3.line()
        .x(function (d) {
            return x(d.date)
        })
        .y(function (d) {
            return y(d.value[1])
        });

    x.domain(d3.extent(data, function (d) {
        return d.date
    })).nice();
    y.domain([minn*0.8, 1.1 * maxx]);

    var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹",
        //formatPower = function(d) { return (d + "").split("").map(function(c) { return superscript[c]; }).join(""); },
        formatTick = function (d) {
            // console.log(d);
            // d = d.toString();
            // ans = (Number(d) / Math.pow(10, d.length - 1)).toString() + 'x';
            // console.log(ans + '10' + superscript[d.length - 1]);
            // return ans + '10' + superscript[d.length - 1];
            console.log(d);
            d = d.toString();
            ans = (Number(d) / Math.pow(10, d.length - 1)).toString() + 'x';
            console.log(ans + '10' + superscript[d.length - 1]);
            return ans + '10' + superscript[d.length - 1];
        };
    //const parseDate = d3.timeParse("%Y-%m-%d");
    //const tickValuesForAxis = data.map(d => d.date);
    g.append("g").attr("class", "text2").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(months).tickFormat(d3.timeFormat("%b'%y")));
    //g.append("g").attr("class", "text2").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(7).tickFormat(d3.timeFormat("%b'%y")));
    g.append("g").attr("class", "text2").call(d3.axisLeft(y).tickValues([100,250,500,750,1000,2500,5000]).tickFormat(function (d) { return formatTick(d); }));
    g.append("path").datum(data).attr("fill", "none").attr("stroke", "green").attr("stroke-linejoin", "round").attr("stroke-linecap", "round").attr("stroke-width", 1.5).attr("d", line);
    g.append("path").data([data]).attr("fill", "none").attr("stroke", "red").attr("stroke-linejoin", "round").attr("stroke-linecap", "round").attr("stroke-width", 1.5).attr("d", line2);

    //text label for x axis
    g.append("text").attr("transform", "translate(" + (svgWidth / 2) + " ," + (svgHeight - margin.top - 20) + ")").attr("dy", "0.5em").style("text-anchor", "middle").text("Timestamp");

    //text label for y axis
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "0.8em").style("text-anchor", "middle").text("Jobs");

    //legend
    var legend_keys = ["Jobs Submitted", "Jobs Completed"];
    var color = ["red", "green"];
    var lineLegend = g.selectAll(".lineLegend").data(legend_keys)
        .enter().append("g")
        .attr("class", "lineLegend")
        .attr("transform", function (d, i) {
            return "translate(" + width*0.95 + "," + (i * 30) + ")";
        });
    lineLegend.append("text").text(function (d) { return d; }).attr("transform", "translate(-60,9)"); //align texts with boxes
    lineLegend.append("rect").attr("fill", function (d, i) { return color[i]; }).attr("width", 10).attr("height", 10).attr("transform", "translate(-80,0)");


    //Divides date for tooltip placement
    var bisectDate = d3.bisector(function (d) { return d.date; }).left;
    //Tooltips
    var focus1 = g.append("g").attr("class", "focus").style("display", "none");
    var focus2 = g.append("g").attr("class", "focus").style("display", "none");

    //Adds circle to focus point on line
    focus1.append("circle").attr("r", 4).attr("fill", "green");
    focus2.append("circle").attr("r", 4).attr("fill", "red");

    focus.append("rect").attr("class", "tooltip").attr("width", 100).attr("height", 50).attr("x", 10).attr("y", -22).attr("rx", 4).attr("ry", 4);

    //Adds text to focus point on line    
    focus1.append("text").attr('id', 'date').attr("class", "tooltip-date").attr("x", -65).attr("dy", "-0.5em").attr("fill", "green");
    focus1.append("text").attr('id', 'jobs').attr("class", "tooltip-likes").attr("x", -65).attr("dy", "-1.5em").attr("fill", "green");
    focus2.append("text").attr('id', 'date2').attr("class", "tooltip-date").attr("x", -65).attr("dy", "1.35em").attr("fill", "red");
    focus2.append("text").attr('id', 'jobs2').attr("class", "tooltip-likes").attr("x", -65).attr("dy", "2.35em").attr("fill", "red");

    //Creates larger area for tooltip   
    var overlay = g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .style("opacity", 0.0)
        .on("mouseover", function () { focus1.style("display", null); focus2.style("display", null); })
        .on("mouseout", function () { focus1.style("display", "none"); focus2.style("display", "none"); })
        .on("mousemove", mousemove);

    //Tooltip mouseovers            
    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        //console.log(d);
        focus1.attr("transform", "translate(" + x(d.date) + "," + y(d.value[0]) + ")");
        focus1.select("#date").text("Date : " + monthNames[d.date.getMonth()]);
        focus1.select("#jobs").text("Jobs : " + d.value[0]);
        focus2.attr("transform", "translate(" + x(d.date) + "," + y(d.value[1]) + ")");
        focus2.select("#date2").text("Date : " + monthNames[d.date.getMonth()]);
        focus2.select("#jobs2").text("Jobs : " + d.value[1]);
    }

}

function drawChart3(data, ID) {
    var svgWidth = screen.width * 0.75, svgHeight = screen.height * 0.7;
    var margin = { top: 30, right: 20, bottom: 50, left: 70 };
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
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Job count per job status");

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain(data.map(function (d) {
        return d.status;
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
            return x(d.status);
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
    g.append("text").attr("transform", "translate(" + (svgWidth / 2) + " ," + (svgHeight - margin.top - 20) + ")").style("text-anchor", "middle").text("Status");

    //text label for y axis
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text("Percentage of Jobs");
}

function drawChart4(data, ID) {
    var svgWidth = screen.width * 0.75, svgHeight = screen.height * 0.7;
    var margin = { top: 30, right: 20, bottom: 50, left: 70 };
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
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Avg. waiting time per queue");

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain(data.map(function (d) {
        return d.queue;
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
        .attr("class", "text2")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    g.append("g").attr("class", "text2").call(d3.axisLeft(y));

    //text label for x axis
    g.append("text").attr("transform", "translate(" + (svgWidth / 2) + " ," + (svgHeight - margin.top - 20) + ")").style("text-anchor", "middle").text("Queue");

    //text label for y axis
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text("Avg. waiting time (hours)");
}

function drawChart5(data, ID) {
    console.log(data);
    var svgWidth = screen.width * 0.75, svgHeight = screen.height * 0.7;
    var margin = { top: 30, right: 50, bottom: 50, left: 70 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);

    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Execution time vs #Jobs");

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().range([0, width]);
    //x.domain(d3.extent(data, function (d) { return d.wtime; }))
    x.domain([0, d3.max(data, function (d) { return d.hours; })]);   // d3.hist has to be called before the Y axis obviously

    var y = d3.scaleLog().base(10).range([height, 0]);
    //y.domain([0, d3.max(data, function (d) { return d.jobs; })]);   // d3.hist has to be called before the Y axis obviously

    var histogram = d3.histogram()
        .value(function (d) { return d.hours; })   // I need to give the vector of value
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
    g.append("text").attr("transform", "translate(" + (svgWidth / 2) + " ," + (height + 40) + ")").style("text-anchor", "middle").text("Execution-Time (hours)");

    //text label for y axis
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text("#Jobs");

}

function drawChart6(data, ID, minn, maxx, n_date, n_wtime) {

    var svgWidth = screen.width * 0.75, svgHeight = screen.height * 0.7;
    var margin = { top: 30, right: 50, bottom: 50, left: 70 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom - 50;

    var cellSizeWidth = width / n_date + 10;
    var cellSizeHeight = height / n_wtime;

    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);
    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Variation of wait-times by day");

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
    g.append("g").attr("class", "text2").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(months).tickFormat(d3.timeFormat("%b,%y")));
    g.append("g").attr("class", "text2").call(d3.axisLeft(y1));
    //text label for x axis
    g.append("text").attr("transform", "translate(" + (svgWidth / 2) + " ," + (height + 40) + ")").style("text-anchor", "middle").text("Timestamp");

    //text label for y axis
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text("Wait Time (hours)");

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
        .domain([minn, maxx])
        .nice();

    //Define x-axis
    var xAxis = d3.axisBottom(xScale).ticks(10);

    //Set up X axis
    legendsvg.append("g")
        .attr("class", "axis")  //Assign "axis" class
        .attr("transform", "translate(" + (-legendWidth / 2) + "," + (10 + legendHeight) + ")")
        .call(xAxis);
}


function drawChart7(data, ID) {

    var svgWidth = screen.width * 0.75, svgHeight = screen.height * 0.7;
    var margin = { top: 30, right: 30, bottom: 50, left: 70 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select("#" + ID).attr("width", svgWidth).attr("height", svgHeight);

    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Wait-Time time vs #Jobs");

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().range([0, width]);
    //x.domain(d3.extent(data, function (d) { return d.wtime; }))
    x.domain([0, d3.max(data, function (d) { return d.wtime; })]);   // d3.hist has to be called before the Y axis obviously

    var y = d3.scaleLog().base(10).range([height, 0]);
    //y.domain([0, d3.max(data, function (d) { return d.jobs; })]);   // d3.hist has to be called before the Y axis obviously

    var histogram = d3.histogram()
        .value(function (d) { return d.wtime; })   // I need to give the vector of value
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
        .attr("width", function (d) { return x(d.x1) - x(d.x0) - 0.4; })
        .attr("height", function (d) { return height - y(d.length); })
        .style("fill", "steelblue")

    //text label for x axis
    g.append("text").attr("transform", "translate(" + (svgWidth / 2) + " ," + (height + 40) + ")").style("text-anchor", "middle").text("Wait-Time (hours)");

    //text label for y axis
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text("#Jobs");
}

function drawDonutChart2(data, id) {
    var thickness = screen.width / 55;
    console.log("Card width : ", id, document.getElementById('card').offsetWidth);
    console.log("Card Height : ", id, document.getElementById('card').offsetHeight);
    console.log("Card width : ", id, document.getElementById('card2').offsetWidth);
    console.log("Card Height : ", id, document.getElementById('card2').offsetHeight);
    //var width = screen.width * 0.25 - 50;
    var width = document.getElementById('card').offsetWidth - 40;
    var height = screen.height * 0.25 - 50;
    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var svg1 = d3.select("#" + id)
        .append('svg')
        .style('text-align', 'center')
        .attr('width', width)
        .attr('height', height);

    var svg = svg1.append('g')
        .attr('class', 'pie')
        .attr('width', radius * 2)
        .attr('height', radius * 2);

    var g = svg.append('g')
        .attr('transform', 'translate(' + (((width - 2 * radius) / 2) + radius) + ',' + (height / 2) + ')');

    let g2 = g.append("g")
        .attr("class", "inner-text");

    g2.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.2em')
        .style('font-size', '12px')
        .text("Mouse over to check");
    g2.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.1em')
        .style('font-size', '12px')
        .text("running status");
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
            svg.select(".inner-text").remove();

            let g = d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "black")
                .append("g")
                .attr("class", "text-group");

            g.append("text")
                .attr("class", "name-text")
                .text("JobId: ")
                .style("font-weight", "bold")
                .style("font-size", "15px")
                .attr('text-anchor', 'middle')
                .attr('dy', '-1.8em');
            g.append("text")
                .attr("class", "name-text")
                .text(`${d.data.jobid}`)
                .style("font-size", "15px")
                .attr('text-anchor', 'middle')
                .attr('dy', '-0.6em');
            g.append("text")
                .attr("class", "name-text")
                .text("Nodes: ")
                .style("font-size", "15px")
                .style("font-weight", "bold")
                .attr('text-anchor', 'middle')
                .attr('dy', '1em');
            g.append("text")
                .attr("class", "value-text")
                .text(`${d.data.nodes}`)
                .style("font-size", "15px")
                .attr('text-anchor', 'middle')
                .attr('dy', '2em');
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", function (d) { return d.data.jobid != "N/A" ? "#e5e5e5" : color(this._current) })
                .select(".text-group").remove();
            let g2 = g.append("g")
                .attr("class", "inner-text");

            g2.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '0.2em')
                .style('font-size', '12px')
                .text("Mouse over to check");
            g2.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '1.1em')
                .style('font-size', '12px')
                .text("running status");
        })
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d, i) { return d.data.jobid == 'N/A' ? "#e5e5e5" : color(i) })
        .on("mouseover", function (d) {
            d3.select(this)
                .style("cursor", "pointer")
                .style("fill", function (d, i) { return d.data.jobid == 'N/A' ? "#e5e5e5" : "black" });
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", function (d) { return d.data.jobid == 'N/A' ? "#e5e5e5" : color(this._current) });
        })
        .each(function (d, i) { this._current = i; });
}

function init_calender(startY,endY) {
    console.log("in init_cal");
    $('input[name="from"]').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD'
        },
        autoUpdateInput: false,
        singleDatePicker: true,
        showDropdowns: true,
        minDate: startY.toString().concat('-01-01'),
        maxDate: endY.toString().concat('-12-30')
        // minYear: startY,
        // maxYear: endY
    });
    $('input[name="from"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
    });
    $('input[name="from"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

    $('input[name="to"]').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD'
        },
        autoUpdateInput: false,
        singleDatePicker: true,
        showDropdowns: true,
        minDate: startY.toString().concat('-01-01'),
        maxDate: endY.toString().concat('-12-30')
        // minYear: startY,
        // maxYear: endY
    });
    $('input[name="to"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
    });
    $('input[name="to"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
}