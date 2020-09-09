var data1 = [];
var data2 = [];
var data3 = [];

function ready_data_plot(){
    $.getJSON("realtime/2010/jsonoutput.json", function (info) {
        var tot_nodes = 0;
        var data4 = {};
        var data5 = {};
        var data2_2 = {};
        var user_2010 = new Set();
        var no_queued = 0;
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
                data5[value['Queue']] = (value['Queue'] in data5)?data5[value['Queue']] + parseInt(value["Nodes"]):parseInt(value["Nodes"]);
                if(value["Queue"] in data1){
                    data1[value["Queue"]] += 1;
                }
                else{
                    data1[value["Queue"]] = 1;    
                }
            }
            else if (value["State"] == 'Q'){
                
                no_queued++;
                if(value["Queue"] in data3){
                    data3[value["Queue"]] += 1;
                }
                else{
                    data3[value["Queue"]] = 1;    
                }
            }
            user_2010.add(value["Username"]);
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
        var empty = 464 - tot_nodes;
        data2.push({
            jobid: '000000',
            nodes: empty,
            queue: "N/A",
            rtime: "00:00",
            wtime: "00:00"
        });
        data5_final = [];
        for(var index in data5) {
            data5_final.push({
                name: index,
                value: data5[index]
            });
        }
        data2_2['running'] = data2.length;
        data2_2['queued'] = no_queued;
        data2_2['active'] = tot_nodes;
        data2_2['users'] = user_2010.size;
        data2_2['usage'] = ((tot_nodes / 464) * 100).toFixed(2) + '%';

        preprocess(data1,"chart_3","Running Jobs");
        DonutChart(data2, "chart_1", "HPC 2010",data2_2);
        preprocess(data3,"chart_4","Queued Jobs");
        drawBar2(data4,"chart_2","Top 5 users with max total nodes");
        console.log(data5_final);
        drawPieChart(data5_final,"chart_6","Queue Load (Busy nodes)");
    });
}