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
    <script type="text/javascript" src="js/DrawTable.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />

    <style>
        .main_chart{
            //border-style: solid;
            margin-left: 10%
        }
        .tooltip {	
            position: absolute;			
            text-align: center;			
            width: 60px;					
            height: 28px;					
            padding: 2px;				
            font: 12px sans-serif;		
            background: lightsteelblue;	
            border: 0px;		
            border-radius: 8px;			
            pointer-events: none;			
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
        
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-md bg-dark navbar-dark">
        <!-- Brand -->
        <a class="navbar-brand" href="index.html">HPC 2013</a>

        <!-- Toggler/collapsibe Button -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar links -->
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="monitor_2013.html">Monitoring</a>
                </li>
                <li class="nav-item dropdown active">
                    <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
                        Analysis
                    </a>
                    <div class="dropdown-menu ">
                        <a class="dropdown-item" href="current_2013.php">Current Analysis</a>
                        <a class="dropdown-item" href="#">Past Data Analysis</a>
                    </div>
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
                <option value="3">Job count per status</option>
                <option value="4">Avg. waiting time per queue</option>
                <option value="5">Execution Time vs #Jobs</option>
                <option value="6">Variation of waitimes by day</option>
                <option value="7">Execution Time vs #Jobs</option>

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
        init_calender();
    	$("#date-submit-btn").click(function(event){
            var chartId = $("#chart").val();
            var toDate = $("#to").val().split("/").reverse().join("-");
            var fromDate = $("#from").val().split("/").reverse().join("-");
            $("#chart1").empty();
            $.ajax({
                url:"action.php",
                method:"POST",
                data:{to:toDate,from:fromDate,chart:chartId},
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