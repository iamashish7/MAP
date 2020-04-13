var months, years, dates;
function myDrawChart(d) {
    console.log("In prepare data");
    months = Math.min(d.months, 18);
    years = d.years;
    dates = Math.min(d.dates, 18);
    console.log("Months: ", months, "Years : ", years, "Dates : ", dates);
    var data = d.data;
    var ID = Number.parseInt(d.ID);
    var arr = [];
    var minn = 100000000, maxx = 0, count2 = 0;
    var set_date = new Set();
    var set_wtime = new Set();

    for (var i in data) {
        if (ID === 2) {
            minn = Math.min(minn, parseInt(+data[i][0]), parseInt(+data[i][1]));
            maxx = Math.max(maxx, parseInt(+data[i][0]), parseInt(+data[i][1]));
            arr.push({
                name: new Date(i), //date
                value: [+data[i][0], +data[i][1]] //convert string to number  
            });
        } 
        else if (ID === 1) {
            count2++;
            minn = Math.min(minn, parseInt(+data[i]));
            maxx = Math.max(maxx, parseInt(+data[i]));
            arr.push({
                name: new Date(i), //date
                value: +data[i] //convert string to number         
            });
        } else if (ID === 3) {
            arr.push({
                name: i,
                value: +data[i] //convert string to number  
            });
        } else if (ID === 4) {
            arr.push({
                name: i,
                value: +data[i] //convert string to number  
            });
        } else if (ID === 5) {
            arr.push({
                id: +i,
                value: +data[i] //convert string to number  
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
                value: +data[i] //convert string to number  
            });
        }
    }
    if (ID === 1) {
        console.log("setting up CFG");
        var cfg = {
            width:screen.availWidth*0.75,
            height:screen.availHeight*0.68,
            margin: { top: 30, right: 20, bottom: 50, left: 70 },
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
            margin: { top: 30, right: 20, bottom: 50, left: 70 },
            title:"Completed and failed jobs per month",
            labelx:"Timestamp",
            labely:"Jobs",
            months: months,
            noLines: 2,
            legend_keys:["Jobs Completed", "Jobs Failed"],
            LineColors: ['green','red'],
            TooltipColors: ['green','red'],
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
            title:"Wait-Time time vs #Jobs",
            labelx:"Wait-Time (hours)",
            labely:"#Jobs",
        };
        histogramGraph(arr, "chart1",cfg);
    } else if (ID === 8) {
        
    }
}

function init_calender(startY,endY) {
    console.log("in init_cal");
    $('input[name="from"]').daterangepicker({
        autoUpdateInput: false,
        singleDatePicker: true,
        showDropdowns: true,
        minYear: startY,
        maxYear: endY
    });
    $('input[name="from"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
    });
    $('input[name="from"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

    $('input[name="to"]').daterangepicker({
        autoUpdateInput: false,
        singleDatePicker: true,
        showDropdowns: true,
        minYear: startY,
        maxYear: endY
        // maxYear: parseInt(moment().format('YYYY'), 10)
    });
    $('input[name="to"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
    });
    $('input[name="to"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
}