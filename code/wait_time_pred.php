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
                    <a class="nav-link" href="custom.php">Custom Analysis</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" href="#">Wait-time Prediction</a>
                </li>
            </ul>
        </div>
        <p style="color: white; font-size: 20px; font-family: Arial, Helvetica, sans-serif">Indian Institute of
            Technology, Kanpur</p>
    </nav>
    <div class="container ">
        <br>
        <div class="row justify-content-center">
        <form class="form-inline " method="post" enctype="multipart/form-data" id="JOBcharform">
            <label for="Nodes">Nodes:</label>&nbsp;
            <input type="text" class="form-control" id="nodes" placeholder="Enter #nodes required" name="nodes">&nbsp;&nbsp;
            <label for="Walltime">Walltime : </label>&nbsp;
            <input type="text" class="form-control" id="walltime" placeholder="Walltime(in hours)" name="walltime">&nbsp;&nbsp;
            <label for="queue">Queue : </label>&nbsp;
            <select id="Q" name="Q">
                <option value="medium">medium</option>
                <option value="small">small</option>
                <option value="large">large</option>
                <option value="mediumsb">mediumsb</option>
                <option value="smallsb">smallsb</option>
            </select>&nbsp;&nbsp;
            <button class="btn btn-primary">Submit</button>
            <!-- <button type='button' id="file-submit-btn" class="btn btn-primary">Submit</button> -->
        </form>
        <br>
        </div>
        <p id="wtimeMSG"></p>
    </div>
    </body>
<script>
    $("form#JOBcharform").submit(function(e) {
        e.preventDefault();    
        var formData = new FormData(this);
        $.ajax({
            url: 'getWtime.php',
            type: 'POST',
            data: formData,
            dataType: 'text', // what to expect back from the PHP script
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                document.getElementById("wtimeMSG").innerHTML = response;
                console.log(response);
            },
            error: function (response) {
                console.log(response); // display error response from the PHP script
            }
        });
    });
</script>
</html>