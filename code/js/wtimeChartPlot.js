function loadJSON(callback,path) {   

    console.log("Here1");
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    console.log("Here2",path);
    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
    console.log("Here3");
    xobj.onreadystatechange = function () {
        console.log("Here4",xobj.readyState,xobj.status,xobj.responseText);
          if (xobj.readyState == 4 && xobj.status == 200) {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            console.log("Here5");
            callback(xobj.responseText);
            console.log("Here6");
          }
          console.log("Here7");
    };
    console.log("Here8");
    xobj.send(null);
    console.log("Here9");  
 }

function addLegend(ID)
{
    var svgWidth = ((screen.availWidth*0.9)/9), svgHeight = Math.min(screen.availWidth,screen.availHeight)*0.25;
    var margin = { top: 10, right: 20, bottom: 0, left:0 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    var svg = d3.select("#" + ID).append('svg').attr("width", svgWidth).attr("height", svgHeight);
    var g = svg.append("g").style("transform", "translate(0,25%)");
    var LineColors = ['#00abff','#188c09'];
    // Plotting legends if any
    var lineLegend = g.selectAll(".lineLegend").data(["actual", "predicted"])
        .enter().append("g")
        .attr("class", "lineLegend")
        .attr("class", "lineLegend axis-ticks")
        .attr("transform", function (d, i) {
            return "translate(" + width*0.95 + "," + (i * 30) + ")";
        });
    lineLegend.append("text").text(function (d) { return d; }).attr("transform", "translate(-60,9)"); //align texts with boxes
    lineLegend.append("rect").attr("fill", function (d, i) { return LineColors[i]; }).attr("width", 10).attr("height", 10).attr("transform", "translate(-80,0)");

}
function plotLineChart()
{
    addLegend('legend');
    // Linear Regression
    loadJSON(function(response) {
        // Parse JSON string into object
        console.log("Here10");
        var actual_JSON = JSON.parse(response);
        console.log("Here11");
        var arr = [];
        for(i = 0; i < 50; i++) {
            arr.push({
                name: i,
                value: [actual_JSON.actual[i]/3600, actual_JSON.predicted[i]/3600]
            });
        }
        console.log(arr);
        var chart = document.getElementById('data_table');
        console.log(chart.offsetWidth,chart.offsetHeight);
        console.log(screen.availWidth,screen.availHeight);
        var temp = Math.min(screen.availWidth,screen.availHeight);
        console.log(temp);
        var cfg = {
            width:2*((screen.availWidth*0.95)/9),
            height:temp*0.25,
            margin: { top: 5, right: 10, bottom: 20, left: 40 },
            title:"",
            labelx:"",
            labely:"wait-time(hours)",
            months: 100,
            noLines: 2,
            legend_keys:["actual", "predicted"],
            LineColors: ['#00abff','#188c09'],
            TooltipColors: ['#00abff','#188c09'],
            // minn: minn,
            // maxx: maxx,
        };
        PredictionLineChart(arr,"lr",cfg);
        console.log(chart.offsetWidth,chart.offsetHeight);
        
    },'http://172.27.28.153/new/code/predict_models/new/Linear/last100.json');
    
    // Logistic Regression
    loadJSON(function(response) {
        // Parse JSON string into object
        console.log("Here10",response);
        var actual_JSON = JSON.parse(response);
        console.log("Here11");
        var arr = [];
        for(i = 0; i < 50; i++) {
            arr.push({
                name: i,
                value: [actual_JSON.actual[i]/3600, actual_JSON.predicted[i]/3600]
            });
        }
        console.log(arr);
        var chart = document.getElementById('data_table');
        console.log(chart.offsetWidth,chart.offsetHeight);
        console.log(screen.availWidth,screen.availHeight);
        var temp = Math.min(screen.availWidth,screen.availHeight);
        console.log(temp);
        var cfg = {
            width:2*((screen.availWidth*0.95)/9),
            height:temp*0.25,
            margin: { top: 5, right: 10, bottom: 20, left: 40 },
            title:"",
            labelx:"",
            labely:"wait-time(hours)",
            months: 100,
            noLines: 2,
            legend_keys:["actual", "predicted"],
            LineColors: ['#00abff','#188c09'],
            TooltipColors: ['#00abff','#188c09'],
            // minn: minn,
            // maxx: maxx,
        };
        PredictionLineChart(arr,"logr",cfg);
        console.log(chart.offsetWidth,chart.offsetHeight);
        
    },'http://172.27.28.153/new/code/predict_models/new/Logistic/last100.json');
    
    // Decision Tree
    loadJSON(function(response) {
        // Parse JSON string into object
        console.log("Here10");
        var actual_JSON = JSON.parse(response);
        console.log("Here11");
        var arr = [];
        for(i = 0; i < 50; i++) {
            arr.push({
                name: i,
                value: [actual_JSON.actual[i]/3600, actual_JSON.predicted[i]/3600]
            });
        }
        console.log(arr);
        var chart = document.getElementById('data_table');
        console.log(chart.offsetWidth,chart.offsetHeight);
        console.log(screen.availWidth,screen.availHeight);
        var temp = Math.min(screen.availWidth,screen.availHeight);
        console.log(temp);
        var cfg = {
            width:2*((screen.availWidth*0.95)/9),
            height:temp*0.25,
            margin: { top: 5, right: 10, bottom: 20, left: 40 },
            title:"",
            labelx:"",
            labely:"wait-time(hours)",
            months: 100,
            noLines: 2,
            legend_keys:["actual", "predicted"],
            LineColors: ['#00abff','#188c09'],
            TooltipColors: ['#00abff','#188c09'],
            // minn: minn,
            // maxx: maxx,
        };
        PredictionLineChart(arr,"dt",cfg);
        console.log(chart.offsetWidth,chart.offsetHeight);
        
    },'http://172.27.28.153/new/code/predict_models/new/Decision_tree/last100.json');
    
    // XGB
    loadJSON(function(response) {
        // Parse JSON string into object
        console.log("Here10");
        var actual_JSON = JSON.parse(response);
        console.log("Here11");
        var arr = [];
        for(i = 0; i < 50; i++) {
            arr.push({
                name: i,
                value: [actual_JSON.actual[i]/3600, actual_JSON.predicted[i]/3600]
            });
        }
        console.log(arr);
        var chart = document.getElementById('data_table');
        console.log(chart.offsetWidth,chart.offsetHeight);
        console.log(screen.availWidth,screen.availHeight);
        var temp = Math.min(screen.availWidth,screen.availHeight);
        console.log(temp);
        var cfg = {
            width:2*((screen.availWidth*0.95)/9),
            height:temp*0.25,
            margin: { top: 5, right: 10, bottom: 20, left: 40 },
            title:"",
            labelx:"",
            labely:"wait-time(hours)",
            months: 100,
            noLines: 2,
            legend_keys:["actual", "predicted"],
            LineColors: ['#00abff','#188c09'],
            TooltipColors: ['#00abff','#188c09'],
            // minn: minn,
            // maxx: maxx,
        };
        PredictionLineChart(arr,"xgb",cfg);
        console.log(chart.offsetWidth,chart.offsetHeight);
        
    },'http://172.27.28.153/new/code/predict_models/new/XGB/last100.json');
    
}
