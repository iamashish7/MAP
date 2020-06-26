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
    <!-- <script type="text/javascript" src="js/d3-tip.js"></script> -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="/resources/demos/style.css">
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script> -->
    <style>
        
        .main_chart{
            //height: 80%;
            //width: 80%;
            /* margin-left: 10%; */
            //border-style: solid;
            text-align:center;
        }
        /* .tooltip {	
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
        } */
        .tooltip2{
            position: absolute;			
            text-align: left;
            font-size:12px;			  
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
            stroke: #000;
            opacity:1
        }

        .tooltip-date, .tooltip-likes {
            font-weight: bold;
            font-size: 15px;
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
        .hide{
            display: none;
        }
        .center_text{
            margin: 0 auto;
            text-align: center;
            /* transform: translate(-50%, -50%); */
        }
        .loader {
            margin: 0 auto;
            transform: translate(-50%, -50%);
            border: 6px solid #f3f3f3;
            border-radius: 50%;
            border-top: 6px  solid black;
            border-bottom: 6px  solid black;
            width: 50px;
            height: 50px;
            -webkit-animation: spin 2s linear infinite;
            animation: spin 2s linear infinite;
        }
        @-webkit-keyframes spin {
            0% { -webkit-transform: rotate(0deg); }
            100% { -webkit-transform: rotate(360deg); }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        /* .graph-title{
            font-size:18px;
        } */

        @media screen and (max-width: 540px) {
            .graph-title {
                font-size: 2vw;
                text-align: center;
            }
            .axis-labels{
                font-size: 1.9vw;
            }
            .axis-ticks{
                font-size: 1.8vw;
            }
        }

        @media screen and (min-width: 540px) and (max-width: 780px) {
            .graph-title {
                font-size: 2vw;
                text-align: center;
            }
            .axis-labels{
                font-size: 1.9vw;
            }
            .axis-ticks{
                font-size: 1.8vw;
            }
        }
        
        @media screen and and (min-width: 781px) and (max-width: 1020px) {
            .graph-title {
                font-size: 1vw;
                text-align: center;
            }
            .axis-labels{
                font-size: 0.9vw;
            }
            .axis-ticks{
                font-size: 0.9vw;
            }
        }

        @media screen and (min-width: 1020px) and (max-width: 1260px) {
            .graph-title {
                font-size: 1vw;
                text-align: center;
            }
            .axis-labels{
                font-size: 0.9vw;
            }
            .axis-ticks{
                font-size: 0.9vw;
            }
        }

        @media screen and  (min-width: 1020px) and (max-width: 1260px) {
            .graph-title {
                font-size: 16px;
                text-align: center;
            }
            .axis-labels{
                font-size: 14px;
            }
            .axis-ticks{
                font-size: 12px;
            }
        }

        @media screen and  (min-width: 1261px) and (max-width: 1500px) {
            .graph-title {
                font-size: 16px;
                text-align: center;
            }
            .axis-labels{
                font-size: 14px;
            }
            .axis-ticks{
                font-size: 13px;
            }
        }

        @media screen and  (min-width: 1500px)  and (max-width: 1740px){
            .graph-title {
                font-size: 18px;
                text-align: center;
            }
            .axis-labels{
                font-size: 16px;
            }
            .axis-ticks{
                font-size: 14px;
            }
        }

        @media screen and  (min-width: 1741px) {
            .graph-title {
                font-size: 18px;
                text-align: center;
            }
            .axis-labels{
                font-size: 17px;
            }
            .axis-ticks{
                font-size: 14px;
            }
            /* .axis-labels{
                font-size: 32px;
            }
            .axis-ticks{
                font-size: 24px;
            } */
        }
        
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
                    <a class="nav-link" href="monitor_2010_multiple_selection.html">Monitoring</a>
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
            </ul>
        </div>
        <a class="navbar-brand" style="color: white; font-family: Arial, Helvetica, sans-serif">Indian Institute of Technology, Kanpur</a>
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
                <optgroup label="Solo Charts">
                <option value="1">Jobs Executing per day <i class="fa fa-info-circle" aria-hidden="true"></i> </option>
                <option value="2">Jobs per month</option>
                <option value="3">Job count per job status</option>
                <option value="4">Avg. waiting time per queue</option>
                <option value="5">Execution Time vs #Jobs</option>
                <option value="6">Variation of wait-times by day</option>
                <option value="7">Wait Time vs #Jobs</option>
                <option value="10">Job status per queue</option>
                <option value="12">Busy CPUs per day</option>
                <!-- <option value="13">Quartiles of wait-time per month</option> -->
                <optgroup label="Multiple Correlating Graphs">
                <option value="8">Variation of wait-times and #CPUS by CPU-hours</option>
                <option value="9">Running, Completed and Failed Jobs</option>
                <option value="11">Global and per queue job count per status</option>
            </select>&nbsp;&nbsp;
            <button type='button' id="date-submit-btn" class="btn btn-primary">Submit</button>
        </form>
        <!-- <ul id="menu">
            <li class="ui-state-disabled"><div>Toys (n/a)</div></li>
            <li><div>Books</div><a href="#"><i class="fa fa-info-circle" aria-hidden="true" ></i></a></li>
            <li><div>Clothing</div></li>
            <li><div>Electronics</div>
                <ul>
                <li class="ui-state-disabled"><div>Home Entertainment</div></li>
                <li><div>Car Hifi</div></li>
                <li><div>Utilities</div></li>
                </ul>
            </li>
            <li><div>Movies</div></li>
            <li><div>Music</div>
                <ul>
                <li><div>Rock</div>
                    <ul>
                    <li><div>Alternative</div></li>
                    <li><div>Classic</div></li>
                    </ul>
                </li>
                <li><div>Jazz</div>
                    <ul>
                    <li><div>Freejazz</div></li>
                    <li><div>Big Band</div></li>
                    <li><div>Modern</div></li>
                    </ul>
                </li>
                <li><div>Pop</div></li>
                </ul>
            </li>
            <li class="ui-state-disabled"><div>Specials (n/a)</div></li>
        </ul> -->
        <br>
        </div>
    </div>
    <br>
    <div id="chart_container" class="justify-content-center" style="text-align:center;">
        <svg id="chart1" class="main_chart"></svg>
        <div id='loader_circle' class="loader hide"></div>
        <p id='loader_text' class="center_text hide"> Loading... </p>
    </div>
</body>
<script src="js/d3.v4.min.js"></script>
<script src="js/d3.tip.v0.6.3.js"></script>

<script type="text/javascript">
//   $( function() {
//     $( "#menu" ).menu();
//   } );
    $(document).ready(function () {
        init_calender('2010-12-01','2020-01-09');
    	$("#date-submit-btn").click(function(event){
            document.getElementById("loader_circle").classList.remove('hide');
            document.getElementById("loader_text").classList.remove('hide');
            document.getElementById("chart1").classList.add('hide');
            var chartId = $("#chart").val();
            var toDate = $("#to").val().split("/").reverse().join("-");
            var fromDate = $("#from").val().split("/").reverse().join("-");
            $("#chart1").empty();
            // console.log(toDate,fromDate,chartId);
            $.ajax({
                url:"analyzer_get_data.php",
                method:"POST",
                data:{to:toDate,from:fromDate,chart:chartId,db:"SavedLogs",table:"HPC2010"},
                success:function(returnData){
                    // console.log(returnData);
                    document.getElementById("loader_circle").classList.add('hide');
                    document.getElementById("loader_text").classList.add('hide');
                    document.getElementById("chart1").classList.remove('hide');
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
