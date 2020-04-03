// Handles everything relating to user profile inclusing spider chart

function fillUserTable(d,uid){
    document.getElementById("UID").innerHTML = uid;
    document.getElementById("MFQ").innerHTML = d.MFQ;
    document.getElementById("AJSI").innerHTML = d.AJSI.concat(' seconds');
    document.getElementById("AWT").innerHTML = d.AWT.concat(' seconds');;
    document.getElementById("AMU").innerHTML = d.AMU.concat(' kb');;
    document.getElementById("MUC").innerHTML = d.MUC;
    // document.getElementById("TJS").innerHTML = d.TJS;
    document.getElementById("ANU").innerHTML = d.ANU;
    // document.getElementById("CJ").innerHTML = d.CJ;
    // document.getElementById("FJ").innerHTML = d.FJ;
    document.getElementById("failed").innerHTML = ('<b>'.concat(d.FJ)).concat('</b>');
    document.getElementById("completed").innerHTML = ('<b>'.concat(d.CJ)).concat('</b>');
    document.getElementById("total").innerHTML = ('<b>'.concat(d.TJS)).concat('</b>');
}

function ClearUserTable(){
    document.getElementById("UID").innerHTML = '';
    document.getElementById("MFQ").innerHTML = '';
    document.getElementById("AJSI").innerHTML = '';
    document.getElementById("AWT").innerHTML = '';
    document.getElementById("AMU").innerHTML = '';
    document.getElementById("MUC").innerHTML = '';
    // document.getElementById("TJS").innerHTML = '';
    document.getElementById("ANU").innerHTML = '';
    // document.getElementById("CJ").innerHTML = '';
    // document.getElementById("FJ").innerHTML = '';
    document.getElementById("failed").innerHTML = ('<b>'.concat('N/A')).concat('</b>');
    document.getElementById("completed").innerHTML = ('<b>'.concat('N/A')).concat('</b>');
    document.getElementById("total").innerHTML = ('<b>'.concat('N/A')).concat('</b>');
}

function plotSpiderChart(data,data2,ID,uid){
    
    var w = screen.width*0.2,h = screen.width*0.2;
    var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

    //Legend titles
    var LegendOptions = ['average user',uid];

    //Data
    var arr = []
    var arr2 = []
     
    for (var i in data) {
        arr.push({
            axis: i,
            value: +data[i] //convert string to number  
        });
    }
    for (var i in data2) {
        arr2.push({
            axis: i,
            value: +data2[i] //convert string to number  
        });
    }
    var d = [ arr,arr2]
    console.log(d);
    
    //Options for the Radar chart, other than default
    var mycfg = {
        w: w,
        h: h,
        maxValue: 0.2,
        levels: 5,
        ExtraWidthX: 300
    }

    //Call function to draw the Radar chart
    //Will expect that data is in %'s
    RadarChart.draw("#" + ID, d, mycfg);

    ////////////////////////////////////////////
    /////////// Initiate legend ////////////////
    ////////////////////////////////////////////

    var svg = d3.select("#" + ID)
        .selectAll('svg')
        .append('svg')
        .attr("width", w+300)
        .attr("height", h)
        
    //Initiate Legend	
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,20)') ;
        
        //Create colour squares
        legend.selectAll('rect')
        .data(LegendOptions)
        .enter()
        .append("rect")
        .attr("x", w - 65)
        .attr("y", function(d, i){ return i * 20;})
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i){ return colorscale(i);});

        //Create text next to squares
        legend.selectAll('text')
        .data(LegendOptions)
        .enter()
        .append("text")
        .attr("x", w - 52)
        .attr("y", function(d, i){ return i * 20 + 9;})
        .attr("font-size", "11px")
        .attr("fill", "#737373")
        .text(function(d) { return d; });	

}
