function plot_graph() {
    ready_data_plot();
}

var data1 = [];
var data2 = [];
var data3 = [];

function ready_data_plot(){
    $.getJSON("realtime/2013/jsonoutput.json", function (info) {
        var tot_nodes = 0;
        $.each(info, function (key, value) {
            if (value["State"] == 'R') {
                tot_nodes = tot_nodes + parseInt(value["Nodes"]);
                data2.push({
                    jobid: key,
                    nodes: +value["Nodes"],
                    queue: value["Queue"],
                    rtime: value["Elapsed_Time"],
                    wtime: value["RequiredTime"]
                });
                if(value["Queue"] in data1){
                    data1[value["Queue"]] += 1;
                }
                else{
                    data1[value["Queue"]] = 1;    
                }
            }
            else if (value["State"] == 'Q'){
                
                if(value["Queue"] in data3){
                    data3[value["Queue"]] += 1;
                }
                else{
                    data3[value["Queue"]] = 1;    
                }
            }
        });
        var empty = 893 - tot_nodes;
        data2.push({
            jobid: '000000',
            nodes: empty,
            queue: "N/A",
            rtime: "00:00",
            wtime: "00:00"
        });
        preprocess(data1,"chart_3","Running Jobs");
        drawDonutChart(data2, "chart_1", "HPC 2013");
        preprocess(data3,"chart_4","Queued Jobs");
    });
}