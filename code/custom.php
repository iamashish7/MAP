<!DOCTYPE html>
<html lang="en">

<head>
    <title>HPC-IITK</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/DrawTable.js"></script>
    <script type="text/javascript" src="js/popper.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
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
            //height: 80%;
            //width: 80%;
            margin-left: 10%;
            //border-style: solid;
        }
        .hide-form{
            display: None;
        }
        
        .loader-wrapper {
            width: 100%;
            position: absolute;
            top: 150px;
            left: 0;
            background-color: #ffffff;
            display:none;
            justify-content: center;
            align-items: center;
        }
        .loader {
            display: inline-block;
            width: 30px;
            height: 30px;
            position: relative;
            border: 4px solid #000000;
            /* top: 50%; */
            animation: loader 2s infinite ease;
        }

        .loader-inner {
            vertical-align: top;
            display: inline-block;
            width: 100%;
            background-color: #000;
            animation: loader-inner 2s infinite ease-in;
        }

        @keyframes loader {
            0% {
                transform: rotate(0deg);
            }
            
            25% {
                transform: rotate(180deg);
            }
            
            50% {
                transform: rotate(180deg);
            }
            
            75% {
                transform: rotate(360deg);
            }
            
            100% {
                transform: rotate(360deg);
            }
        }

        @keyframes loader-inner {
            0% {
                height: 0%;
            }
            
            25% {
                height: 0%;
            }
            
            50% {
                height: 100%;
            }
            
            75% {
                height: 100%;
            }
            
            100% {
                height: 0%;
            }
        }
    </style>
</head>

<body>
    <nav class="navbar navbar-expand-md bg-dark navbar-dark">
        <!-- Brand -->
        <a class="navbar-brand" href="index.html">IITK-HPC</a>

        <!-- Toggler/collapsibe Button -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar links -->
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Custom Analysis</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Wait-time Analysis</a>
                </li>
            </ul>
        </div>
        <p style="color: white; font-size: 20px; font-family: Arial, Helvetica, sans-serif">Indian Institute of
            Technology, Kanpur</p>
    </nav>
    <div class="container ">
        <br>
        <div class="row justify-content-center">
            <form class="form-inline " method="post" enctype="multipart/form-data" id="fileuploadform">
                <label for="file">file:</label>&nbsp;
                <input type="file" class="form-control" name="fileToUpload" id="fileToUpload">&nbsp;&nbsp;
                <label for="log_type">Type : </label>&nbsp;
                <select id="parser" name="parser">
                    <option value="1">SWF</option>
                    <option value="2">PBS</option>
                </select>&nbsp;&nbsp;
                <button class="btn btn-primary">Submit</button>
                <!-- <button type='button' id="file-submit-btn" class="btn btn-primary">Submit</button> -->
            </form>
            <br>
        </div>
        <br>
        <div class="loader-wrapper" id="loaderr">
            <span class="loader"><span class="loader-inner"></span></span>
        </div>
        <br>
        <div class="row justify-content-center">
            <form class="form-inline hide-form">
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
<script>
    $(document).ready(function () {
        init_calender();
        var dbName = "";
        var n_Q = 0;
        var startY = "";
        var endY = "";
        $("form#fileuploadform").submit(function(e) {
            document.getElementsByClassName("loader-wrapper")[0].style.display = 'flex';
            e.preventDefault();
            // console.log(jQuery('form')[0]);    
            var formData = new FormData(this);
            $.ajax({
                url: 'upload.php',
                type: 'POST',
                data: formData,
                dataType: 'text', // what to expect back from the PHP script
				cache: false,
				contentType: false,
				processData: false,
				success: function (response) {
                    console.log(response);
                    res = response.split('#');
                    dbName = res[0];
                    startY = Number(res[1]);
                    endY = Number(res[2]);
                    n_Q = Number(res[3]);
                    init_calender(startY,endY);
                    document.getElementsByClassName("loader-wrapper")[0].style.display = 'none';
                    // dbName = response;
                    console.log(dbName,startY,endY,n_Q);
                    document.getElementsByClassName("hide-form")[0].classList.remove('hide-form');
				},
				error: function (response) {
                    document.getElementsByClassName("loader-wrapper")[0].style.display = 'none';
					console.log(response); // display error response from the PHP script
				}
            });
        });
    	$("#date-submit-btn").click(function(event){
            if($("#parser").val()=='1'){
                var chartId = $("#chart").val();
                var toDate = $("#to").val().split("/").reverse().join("-");
                var fromDate = $("#from").val().split("/").reverse().join("-");
                $("#chart1").empty();
                $.ajax({
                    url:"actionswf.php",
                    method:"POST",
                    data:{to:toDate,from:fromDate,chart:chartId,db:dbName},
                    success:function(returnData){
                        console.log("Data fetched")
                        myDrawChart(returnData);
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            }
            else{
                var chartId = $("#chart").val();
                var toDate = $("#to").val().split("/").reverse().join("-");
                var fromDate = $("#from").val().split("/").reverse().join("-");
                $("#chart1").empty();
                $.ajax({
                    url:"action.php",
                    method:"POST",
                    data:{to:toDate,from:fromDate,chart:chartId,db:dbName},
                    success:function(returnData){
                        console.log("Data fetched")
                        myDrawChart(returnData);
                    },
                    error:function(err){
                        console.log(err);
                    }
                });    
            }
        });
    });

</script>
</html>