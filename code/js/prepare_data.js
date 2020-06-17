var months, years, dates;

// Perform a numeric sort on an array
function sortNumber(a,b) { return a - b; }

// Quartile definition
function boxQuartiles(d) 
{
    return [
        d3.quantile(d, .75),
        d3.quantile(d, .5),
        d3.quantile(d, .25),
    ];
}

function get_arr_jobs_executing_per_day(data)
{
    var arr = [];
    for (var i in data)
    {
        arr.push({
            name: new Date(i), //date
            value: +data[i] //convert string to number         
        });
    }
    return arr;
}

function get_arr_jobs_per_month(data)
{
    var arr = [];
    for (var i in data)
    {
        arr.push({
            name: new Date(i), //date
            value: [+data[i][0] + +data[i][1], +data[i][0]] //convert string to number  
        });
    }
    return arr;
}

function get_arr_count_per_status(data)
{
    var arr = [];
    for (var i in data)
    {
        arr.push({
            name: i,
            value: +data[i] //convert string to number  
        });
    }
    return arr;
}

function get_arr_avg_wtime_per_Q(data)
{
    var arr = [];
    for (var i in data)
    {
        arr.push({
            name: i,
            value: +data[i] //convert string to number  
        });
    }
    return arr;
}

function get_arr_extime_vs_jobs(data)
{
    var arr = [];
    for (var i in data)
    {
        arr.push({
            id: +i,
            value: +data[i] //convert string to number  
        });
    }
    return arr;
}

function get_arr_vartn_wtime_by_day(data)
{
    var arr = [];
    var minn = 100000000, maxx = 0;
    var set_date = new Set();
    var set_wtime = new Set();
    for (var i in data)
    {
        minn = Math.min(minn, parseInt(data[i]));
        maxx = Math.max(maxx, parseInt(data[i]));
        var obj = JSON.parse(i);
        set_date.add(obj.wtime);
        set_wtime.add(obj.date);
        arr.push({
            wtime: +obj.wtime,
            date: new Date(obj.date),
            jobs: +data[i]
        });
    }
    return [minn,maxx,arr,set_date,set_wtime];
}

function get_arr_wtime_vs_jobs(data)
{
    var arr = [];
    for (var i in data)
    {
        arr.push({
            id: +i,
            value: +data[i] //convert string to number  
        });
    }
    return arr;
}

function get_arr_vartn_wtime_by_req(data)
{
    var arr = [];
    var arr2= [];
    for (var i in data)
    {
        var obj = JSON.parse(i);
        arr.push({
            rtime: obj.rtime,
            proc: obj.proc,
            val: +data[i][0]
        });
        arr2.push({
            rtime: obj.rtime,
            proc: obj.proc,
            val: +data[i][1]
        });
    }
    return [arr,arr2];
}

function get_arr_job_status_per_queue(data)
{
    var arr = [];
    for (var i in data)
    {
        val = data[i].map(x=>+x);
        // console.log(val);
        arr.push({
            id: i,
            completed: ((val[0]/(val[0] + val[1] + val[2]))*100).toFixed(2),
            cancelled: ((val[1]/(val[0] + val[1] + val[2]))*100).toFixed(2),
            failed: ((val[2]/(val[0] + val[1] + val[2]))*100).toFixed(2)  
        });
    }
    return arr;
}

function get_arr_CPU_load_per_day(data)
{
    var arr = [];
    for (var i in data)
    {
        arr.push({
            name: new Date(i), //date
            value: +data[i] //convert string to number         
        });
    }
    return arr;
}

function get_arr_wtime_per_month(data){
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var groupCounts = {};
    var globalCounts = [];
    for (var i in data)
    {
        var d = new Date(i);
        var k = monthNames[d.getMonth()].concat("'").concat(d.getFullYear().toString().substr(-2));
        groupCounts[k] = data[i].map(x=>+x).sort(sortNumber);
        // groupCounts.push({
        //     name: new Date(i), //date
        //     value: data[i].map(x=>+x).sort(sortNumber) //convert string to number  
        // });
        globalCounts = globalCounts.concat(data[i].map(x=>+x).sort(sortNumber));
    }
    
    return [globalCounts,groupCounts];
}

function myDrawChart(d) {
    // console.log("In prepare data");
    months = Math.min(d.months, 18);
    years = d.years;
    dates = Math.min(d.dates, 18);
    // console.log("Months: ", months, "Years : ", years, "Dates : ", dates);
    var data = d.data;
    var ID = Number.parseInt(d.ID);
    var arr = [];
    var arr2 = [];
    var minn = 100000000, maxx = 0, count2 = 0;
    var set_date = new Set();
    var set_wtime = new Set();

    if (ID === 1) {
        arr = get_arr_jobs_executing_per_day(data);
    } else if (ID === 2) {
        arr = get_arr_jobs_per_month(data);
    } else if (ID === 3) {
        arr = get_arr_count_per_status(data);
    } else if (ID === 4) {
        arr = get_arr_avg_wtime_per_Q(data);
    } else if (ID === 5) {
        arr = get_arr_extime_vs_jobs(data);
    } else if (ID === 6) {
        var values = get_arr_vartn_wtime_by_day(data);
        minn = values[0];
        maxx = values[1];
        arr = values[2];
        set_date = values[3];
        set_wtime = values[4];
    } else if (ID === 7) {
        arr = get_arr_wtime_vs_jobs(data);
    } else if (ID === 8) {
        var values = get_arr_vartn_wtime_by_req(data);
        arr = values[0];
        arr2 = values[1];
    } else if (ID === 9) {
        arr = get_arr_jobs_executing_per_day(data['data1']);
        arr2 = get_arr_jobs_per_month(data['data2']);
    } else if (ID === 10) {
        arr = get_arr_job_status_per_queue(data);
    } else if (ID === 11) {
        arr = get_arr_count_per_status(data['data1']);
        arr2 = get_arr_job_status_per_queue(data['data2']);
    } else if (ID === 12) {
        arr = get_arr_CPU_load_per_day(data);
    }else if (ID === 13) {
        arr = get_arr_wtime_per_month(data);
    }
    if (ID === 1) {
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: 25, bottom: 50, left: 70 },
            title:"Number of Jobs executing per day",
            labelx:"Timestamp",
            labely:"Jobs",
            months: months,
            noLines: 1,
            LineColors: ['steelblue'],
            TooltipColors: ['black'],
            minn: minn,
            max: maxx,
        };
        LineChart(arr,"chart1",cfg);
    } else if (ID === 2) {
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: 25, bottom: 50, left: 70 },
            title:"Completed and failed jobs per month",
            labelx:"Timestamp",
            labely:"Jobs",
            months: months,
            noLines: 2,
            legend_keys:["Jobs Submitted", "Jobs Completed"],
            LineColors: ['#00abff','#188c09'],
            TooltipColors: ['#00abff','#188c09'],
            minn: minn,
            maxx: maxx,
        };
        LineChart(arr,"chart1",cfg);
    } else if (ID === 3) {
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: 20, bottom: 50, left: 70 },
            title:"Job count per job status",
            labelx:"Status",
            labely:"Percentage of Jobs",
        };
        BarGraph(arr, "chart1",cfg);
    } else if (ID === 4) {
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: 20, bottom: 50, left: 70 },
            title:"Avg. waiting time per queue",
            labelx:"Queue",
            labely:"Avg. waiting time (hours)",
        };
        BarGraph(arr, "chart1",cfg);
    } else if (ID === 5) {
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: 20, bottom: 50, left: 70 },
            title:"Execution time vs #Jobs",
            labelx:"Execution-Time (hours)",
            labely:"#Jobs",
        };
        histogramGraph(arr, "chart1",cfg);
    } else if (ID === 6) {
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: 20, bottom: 50, left: 70 },
            title:"Variation of wait-times by day",
            labelx:"Timestamp",
            labely:"Wait Time (hours)",
            minn: minn,
            maxx: maxx,
            n_date : set_date.size,
            n_wtime: set_wtime.size,
            months: months,
        };
        heatmap(arr, "chart1",cfg);
    } else if (ID === 7) {
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: 20, bottom: 50, left: 70 },
            title:"Wait-Time vs #Jobs",
            labelx:"Wait-Time (hours)",
            labely:"#Jobs",
        };
        histogramGraph(arr, "chart1",cfg);
    } else if (ID === 8) {
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.70,
            margin: { top: 30, right: 20, bottom: screen.availHeight*0.42, left: 70 },
            title:"Variation of wait-times by requirement",
            labelx:"Required wall-time(Hours)",
            labely:"Required cpus",
            subtitle:"Average wait-time",
        };
        heatmap2(arr, "chart1",cfg);
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.70,
            margin: { top: screen.availHeight*0.4, right: 20, bottom: 50, left: 70 },
            title:"",
            labelx:"Required wall-time(Hours)",
            labely:"Required cpus",
            subtitle:"Total number of jobs",
        };
        heatmap2(arr2, "chart1",cfg);
    }
    else if (ID === 9) {
        console.log("Margin bottom in prepare data",screen.availHeight*0.42);
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.70,
            margin: { top: 30, right: 25, bottom: screen.availHeight*0.42, left: 70 },
            title:"Number of Jobs executing per day",
            labelx:"Timestamp",
            labely:"Jobs",
            months: months,
            noLines: 1,
            LineColors: ['steelblue'],
            TooltipColors: ['black'],
            minn: minn,
            max: maxx,
        };
        LineChart(arr,"chart1",cfg);
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.70,
            margin: { top: screen.availHeight*0.39, right: 25, bottom: 50, left: 70 },
            title:"Submitted and Completed jobs per month",
            labelx:"Timestamp",
            labely:"#Jobs",
            months: months,
            noLines: 2,
            legend_keys:["Jobs Submitted", "Jobs Completed"],
            LineColors: ['#00abff','#188c09'],
            TooltipColors: ['#00abff','#188c09'],
            minn: minn,
            maxx: maxx,
        };
        LineChart(arr2,"chart1",cfg);
    } else if (ID === 10) {
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.68,
            margin: { top: 50, right: 100, bottom: 70, left: 80 },
            title:"Completed, Cancelled and Failed jobs per queue",
            labelx:"Queue",
            labely:"Percentage of Jobs",
        };
        StackBarChart(arr, "chart1",cfg);
        // tempTesting();
    } else if (ID === 11) {
        var cfg = {
            width:screen.availWidth*0.95,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: screen.availWidth*0.5, bottom: 80, left: 80 },
            title:"Job count per job status",
            labelx:"Status",
            labely:"Percentage of Jobs",
        };
        BarGraph(arr, "chart1",cfg);
        var cfg = {
            width:screen.availWidth*0.95,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: 100, bottom: 80, left: screen.availWidth*0.5 },
            title:"Completed, Cancelled and Failed jobs per queue",
            labelx:"Queue",
            labely:"Percentage of Jobs",
        };
        StackBarChart(arr2, "chart1",cfg);
        // tempTesting();

        
    } else if (ID === 12) {
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: 25, bottom: 50, left: 70 },
            title:"No. of CPUs busy per day",
            labelx:"Timestamp",
            labely:"#CPUs",
            months: months,
            noLines: 1,
            LineColors: ['steelblue'],
            TooltipColors: ['black'],
            minn: minn,
            max: maxx,
        };
        LineChart(arr,"chart1",cfg);
    } else if (ID === 13) {
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: 20, bottom: 50, left: 70 },
            title:"Quartiles of wait-time per month",
            labelx:"Timestamp",
            labely:"wait-time",
            months: months,
        };
        BoxPlot(arr,"chart1",cfg);
    }
}

function init_calender(startY,endY) {
    console.log("in new init_cal",startY,endY);
    $('input[name="from"]').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD'
          },
        autoUpdateInput: false,
        singleDatePicker: true,
        showDropdowns: true,
        minDate: startY,
        maxDate: endY
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
        minDate: startY,
        maxDate: endY
    });
    $('input[name="to"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
    });
    $('input[name="to"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
}
