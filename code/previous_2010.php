<html lang="en">
<head>
    <title>HPC-Analysis</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="js/jquery.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/jsdelivr/jquery.min.js"></script>
    <script type="text/javascript" src="js/jsdelivr/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <!-- <script type="text/javascript" src="js/DrawTable.js"></script> -->
    <script type="text/javascript" src="js/prepare_data.js"></script>
    <script type="text/javascript" src="js/Graphs.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />

    <style>
        .main_chart{
            //height: 80%;
            //width: 80%;
            margin-left: 10%;
            //border-style: solid;
        }
        .tooltip {	
            position: absolute;			
            text-align: center;			
            width: 60px;					
            height: 28px;					
            padding: 2px;				
            //font: 12px sans-serif;		
            background: lightsteelblue;	
            border: 0px;		
            border-radius: 8px;			
            pointer-events: none;			
        }
        
        .overlay {
            fill: none;
            pointer-events: all;
        }

        .focus text {
            font-size: 14px;
        }

        .tooltip {
            fill: white;
            stroke: #000000;
        }

        .tooltip-date, .tooltip-likes {
            font-weight: bold;
        }

	    .bar {
            text-align : center;
	    }
	    .axis path,
	  	.axis tick,
	    .axis line {
	  		fill: none;
	  		stroke: none;
	  	}
        /* text {
            font-family: sans-serif;
            font-size: 15px;
        }*/

        .text2 {
            font-family: sans-serif;
            font-size: 12px;
        }
        /*
        .legend {
            font-family: sans-serif;
            font-size: 15px;
        }
         */
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-md bg-dark navbar-dark">
        <!-- Brand -->
        <a class="navbar-brand" href="index.html">HPC 2010</a>

        <!-- Toggler/collapsibe Button -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar links -->
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="monitor_2010.html">Monitoring</a>
                </li>
                <li class="nav-item dropdown active">
                    <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
                        Analysis
                    </a>
                    <div class="dropdown-menu ">
                        <a class="dropdown-item" href="current_2010.php">Current Analysis</a>
                        <a class="dropdown-item" href="#">Past Data Analysis</a>
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="custom.php">Custom Analysis</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="wait_time_pred.php">Wait-time Prediction</a>
                </li>
            </ul>
        </div>
        <p style="color: white; font-size: 20px; font-family: Verdana, Geneva, Tahoma, sans-serif">Indian Institute of Technology, Kanpur</p>
    </nav>
    <br>
    
    <div class="container ">
          <br>
        <div class="row justify-content-center">
        <form class="form-inline ">
            <label for="from">From:</label>&nbsp;
            <input type="text" class="form-control" id="from" placeholder="Enter start date" name="from">&nbsp;&nbsp;
            <label for="to">To:</label>&nbsp;
            <input type="text" class="form-control" id="to" placeholder="Enter end date" name="to">&nbsp;&nbsp;
            <label for="chart_type">Type : </label>&nbsp;
            <select id="chart" name="chart">
                <option value="1">Jobs Executing per day</option>
                <option value="2">Jobs per month</option>
                <option value="3">Job count per job status</option>
                <option value="4">Avg. waiting time per queue</option>
                <option value="5">Execution Time vs #Jobs</option>
                <option value="6">Variation of wait-times by day</option>
                <option value="7">Wait Time vs #Jobs</option>
            </select>&nbsp;&nbsp;
            <button type='button' id="date-submit-btn" class="btn btn-primary">Submit</button>
        </form>
        <br>
        </div>
    </div>
    <br>
    <div class="justify-content-center">
        <svg id="chart1" class="main_chart"></svg>
    </div>
</body>
<script src="js/d3.v4.min.js"></script>
<script src="js/d3.tip.v0.6.3.js"></script>

<script type="text/javascript">
    $(document).ready(function () {
        init_calender(2010,2020);
    	$("#date-submit-btn").click(function(event){
            var chartId = $("#chart").val();
            var toDate = $("#to").val().split("/").reverse().join("-");
            var fromDate = $("#from").val().split("/").reverse().join("-");
            $("#chart1").empty();
            console.log(toDate,fromDate,chartId);
            $.ajax({
                url:"analyzer_get_data.php",
                method:"POST",
                data:{to:toDate,from:fromDate,chart:chartId,db:"SavedLogs",table:"HPC2010"},
                success:function(returnData){
                    myDrawChart(returnData);
                },
                error:function(err){
                    console.log(err);
                }
            });
        });
    });
</script>
</html>