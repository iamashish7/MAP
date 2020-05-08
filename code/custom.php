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
    <script type="text/javascript" src="js/popper.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="js/jquery.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/jsdelivr/jquery.min.js"></script>
    <script type="text/javascript" src="js/jsdelivr/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
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
        .hide{
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
        .dropbtn {
            background-color: 	#A9A9A9;
            color: white;
            /* padding: 16px;
            font-size: 16px; */
            border: none;
            cursor: pointer;
            width: 200px;
            }

            /* Dropdown button on hover & focus */
        .dropbtn:hover, .dropbtn:focus {
            background-color: #696969;
            color: white;
            }

            /* The container <div> - needed to position the dropdown content */
        .dropdown {
            position: relative;
            display: inline-block;
            }

            /* Dropdown Content (Hidden by Default) */
        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f1f1f1;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
            }

            /* Links inside the dropdown */
        .dropdown-content a {
            color: black;
            padding: 6px 8px;
            text-decoration: none;
            display: block;
        }

        /* Change color of dropdown links on hover */
        .dropdown-content a:hover {
            background-color: #ddd
        }

            /* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
        .show {
            display:block;
        }
        .no-click {pointer-events: none;}


        /* *,
        *:before,
        *:after {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        } */
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
                    <a class="nav-link" href="monitor_2010_multiple_selection.html">HPC2010</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="monitor_2013.html">HPC2013</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" href="#">Custom Analysis</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="wait_time_pred.php">Wait-time Prediction</a>
                </li>
            </ul>
        </div>
        <p style="color: white; font-size: 20px; font-family: Arial, Helvetica, sans-serif">Indian Institute of
            Technology, Kanpur</p>
    </nav>
    <div class="container ">
        <br>
        <div class="row justify-content-center">
            <button class='btn no-click'>Data:</button>&nbsp;
            <div class="dropdown">
                <button onclick="myFunction()" class="dropbtn btn" id='dropbtn'>Select Data</button>
                <div id="myDropdown" class="dropdown-content">
                    <label class="file">
                        <input  onChange="setFile()" style='padding:10px' form = 'fileuploadform' type="file" id="fileToUpload" aria-label="File browser example">
                        <span class="file-custom"></span>
                    </label>
                    <hr>
                    <a onclick="setDB('CTC_SP2')" href="#">CTC_SP2</a>
                    <!-- <a onclick="setDB('ANL_intrepid')" href="#">ANL_intrepid</a> -->
                    <a onclick="setDB('SDSC_SP2')" href="#">SDSC_SP2</a>
                    <a onclick="setDB('SDSC_BLUE')" href="#">SDSC_BLUE</a>
		    <a onclick="setDB('CEA_curie')" href="#">CEA curie</a>
                    <a onclick="setDB('DAS2')" href="#">DAS2</a>
                    <a onclick="setDB('HPC2N')" href="#">HPC2N</a>
                </div>
            </div> 
            &nbsp;&nbsp;
            <form class="form-inline " method="post" enctype="multipart/form-data" id="fileuploadform">
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
        <div id="error-box" class="alert alert-danger hide" style="text-align:center">
            <b>ERROR!!</b> Upload a log file or select from existing.
        </div>
        <div class="loader-wrapper" id="loaderr">
            <span class="loader"><span class="loader-inner"></span></span>
        </div>
        <br>
        <div class="row justify-content-center">
            <form class="form-inline hide" id="analysis-form">
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

    var dbName = '';
    var tableName = '';
    var filename = '';

    var db = '';

    function myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn') && !event.target.matches('#fileToUpload')) {
            
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
            if(document.getElementById("fileToUpload").value!='')
            {
                val = document.getElementById("fileToUpload").value.split('\\');
                this.filename = val[2];
                console.log("filename = ",this.filename,"db = ",this.db);
                document.getElementById("parser").disabled = false;
                document.getElementById("dropbtn").innerHTML = val[2];
            }
        }
    }
    function setDB(db){
        document.getElementById("fileToUpload").value = ''
        this.db = db;
        this.filename = '';
        console.log("filename = ",this.filename,"db = ",this.db);
        document.getElementById("parser").disabled = true;
        document.getElementById("dropbtn").innerHTML = db;
    }

    function setFile(){
        this.db = '';
        val = document.getElementById("fileToUpload").value.split('\\');
        this.filename = val[2];
        console.log("got new file");  
    }
    $(document).ready(function () {
        // init_calender();
        var dbName = "";
        var tableName = '';
        var n_Q = 0;
        var startY = "";
        var endY = "";
        var meta = {
            "CTC_SP2":[1996,1997,1],
            // "ANL_intrepid":[2009,2009,1],
            "SDSC_SP2":[1998,2000,1],
            "SDSC_BLUE":[2000,2003,1],
	    "CEA_curie":[2012,2014,1],
            "DAS2":[2004,2004,1],
            "HPC2N":[2006,2009,1],
        };
        $("form#fileuploadform").submit(function(e) {
            e.preventDefault();
            if(db.length>0 || filename.length>0)
            {
                console.log("here1");
                document.getElementById("analysis-form").classList.add('hide');
                document.getElementById("error-box").classList.add('hide');
                $("#chart1").empty();
                $("#from").val('');
                $("#to").val('');
                document.getElementsByClassName("loader-wrapper")[0].style.display = 'flex';
                if(db.length>0)
                {
                    console.log("stored db");
                    tableName = db;
                    dbName = "SavedLogs"
                    $("#parser").val(meta[db][2]);
                    console.log(meta[db][0],meta[db][1]);
                    init_calender(meta[db][0],meta[db][1]);
                    document.getElementsByClassName("loader-wrapper")[0].style.display = 'none';
                    document.getElementById("analysis-form").classList.remove('hide');
                }
                else
                if(filename.length>0)
                {
                    console.log("upload db");
                    var file = document.getElementById("fileToUpload");
                    console.log(file.files[0]);
                    var formData = new FormData(this);
                    formData.append('fileToUpload', file.files[0]);
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
                            tableName = res[0];
                            dbName = "tempLogs"
                            // this.dbName = dbName;
                            startY = Number(res[1]);
                            endY = Number(res[2]);
                            n_Q = Number(res[3]);
                            init_calender(startY,endY);
                            document.getElementsByClassName("loader-wrapper")[0].style.display = 'none';
                            console.log(dbName,startY,endY,n_Q);
                            document.getElementById("analysis-form").classList.remove('hide');
                        },
                        error: function (response) {
                            document.getElementsByClassName("loader-wrapper")[0].style.display = 'none';
                            console.log(response); // display error response from the PHP script
                        }
                    });
                }
            }
            else
            {
                console.log("here2");
                document.getElementById("error-box").classList.remove('hide');
            }
        });
    	$("#date-submit-btn").click(function(event){
            // if($("#parser").val()=='1' || 1){
                console.log("In swf");
                var chartId = $("#chart").val();
                var toDate = $("#to").val().split("/").reverse().join("-");
                var fromDate = $("#from").val().split("/").reverse().join("-");
                $("#chart1").empty();
                $.ajax({
                    url:"analyzer_get_data.php",
                    method:"POST",
                    data:{to:toDate,from:fromDate,chart:chartId,db:dbName,table:tableName},
                    success:function(returnData){
                        console.log("Data fetched")
                        console.log(returnData)
                        myDrawChart(returnData);
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            // }
            // else{
            //     var chartId = $("#chart").val();
            //     var toDate = $("#to").val().split("/").reverse().join("-");
            //     var fromDate = $("#from").val().split("/").reverse().join("-");
            //     $("#chart1").empty();
            //     $.ajax({
            //         url:"action.php",
            //         method:"POST",
            //         data:{to:toDate,from:fromDate,chart:chartId,db:"tempLogs",},
            //         success:function(returnData){
            //             console.log("Data fetched")
            //             myDrawChart(returnData);
            //         },
            //         error:function(err){
            //             console.log(err);
            //         }
            //     });    
            // }
        });
    }); 
</script>
</html>
