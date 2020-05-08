var data1 = [];
var data2 = [];
var data3 = [];

function ready_data_plot(){
    $.getJSON("realtime/2013/jsonoutput.json", function (info) {
        var tot_nodes = 0;
        var data4 = {};
        var data5 = {};
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
                data4[value['Username']] = (value['Username'] in data4)?data4[value['Username']] + parseInt(value["Nodes"]):parseInt(value["Nodes"]);
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
        var items = Object.keys(data4).map(function(key) {
            return [key, data4[key]];
        });
        
        // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        
        items = items.slice(0, 5);
        items.sort(function(first, second) {
            return -1*(second[1] - first[1]);
        });
        
        data4 = [];
        items.forEach(function(value){
            data4.push({
                user: value[0],
                nodes: value[1]
            });
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
        drawBar2(data4,"chart_2","Top 5 users with max total nodes")
    });
}