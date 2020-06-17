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
    <script type="text/javascript" src="js/prepare_data.js"></script>
    <script type="text/javascript" src="js/Graphs.js"></script>
    <script type="text/javascript" src="js/wtimeChartPlot.js"></script>
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
        .hide{
            display: None;
        }
        table {
            //width:100%;
            //height:100%;
            //border-style: solid;
            table-layout: fixed;
            border-collapse: collapse;
            padding:0;
            text-align: center;
        }
        .td-3d{
            box-shadow:5px 5px 5px #d3d3d3;
        }
        .table-borderless td,
        .table-borderless th {
            border: 0;
        }
        th, td{
            border-radius:8px;
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
                    <a class="nav-link" href="custom.php">Custom Analysis</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" href="#">Wait-time Prediction</a>
                </li>
            </ul>
        </div>
        <a class="navbar-brand" style="color: white; font-family: Arial, Helvetica, sans-serif">Indian Institute of Technology, Kanpur</a>
    </nav>
    <div class="container-fluid ">
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
        <br>
        <h4 id='hpc2010' class='hide' style='text-align:center'>HPC2010</h4>
        <div class="table-responsive-sm">
            <table id='data_table' class="table table-borderless hide">
                <tr>
                    <th scope="col" colspan="1">
                    <th scope="col" colspan="2" class='td-3d'> Linear Regression </td>
                    <th scope="col" colspan="2" class='td-3d'> Logistic Regression </td>
                    <th scope="col" colspan="2" class='td-3d'> Decision Tree </td>
                    <th scope="col" colspan="2" class='td-3d'> XGBoost </td>
                </tr>
                <tr>
                    <th colspan="1" class='td-3d' id='legend' >Previous trends</th>
                    <td id='lr' colspan="2" class='td-3d'></th>
                    <td id='logr' colspan="2" class='td-3d'></th>
                    <td id='dt' colspan="2" class='td-3d'></th>
                    <td id='xgb' colspan="2" class='td-3d'></th>
                </tr>
                <tr>
                    <th colspan="1" class='td-3d'>Predictions</th>
                    <td id='lr_pred' colspan="2" class='td-3d'>0 seconds</th>
                    <td id='logr_pred' colspan="2" class='td-3d'>0 seconds</th>
                    <td id='dt_pred' colspan="2" class='td-3d'>0 seconds</th>
                    <td id='xgb_pred' colspan="2" class='td-3d'>0 seconds</th>
                </tr>
            </table>
        </div>
    </div>
    </body>
<script>
    function str_pad_left(string,pad,length) {
        return (new Array(length+1).join(pad)+string).slice(-length);
    }
    function str_pad_hours(string) {
        if(string>10)
            return string;
        else if(string<10 && string>0)
            return '0'+string;
        else
            return '00';
    }    
    function getTime(time){
        var hours = Math.floor(time / 3600);
        time = time - hours * 3600;
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;

        return str_pad_hours(hours)+':'+str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
    }
    $("form#JOBcharform").submit(function(e) {
        document.getElementById("data_table").classList.add('hide');               
        document.getElementById("hpc2010").classList.add('hide');
        d3.selectAll("svg").remove();           
        plotLineChart();
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
                console.log(response);
                res = response.split(';');
                document.getElementById('lr_pred').innerHTML = getTime(res[0])
                document.getElementById('logr_pred').innerHTML = getTime(res[1])
                document.getElementById('dt_pred').innerHTML = getTime(res[2])
                document.getElementById('xgb_pred').innerHTML = getTime(res[3])
                document.getElementById("data_table").classList.remove('hide');
                document.getElementById("hpc2010").classList.remove('hide');
            },
            error: function (response) {
                console.log(response); // display error response from the PHP script
            }
        });
    });
</script>
</html>
