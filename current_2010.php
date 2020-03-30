<html lang="en">
<head>
    <title>HPC-Analysis</title>
    <meta charset="utf-8">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <script src="js/d3.v4.min.js"></script>
    <script src="js/d3.tip.v0.6.3.js"></script>
    <script type="text/javascript" src="js/plot_realtime.js"></script>
    <script type="text/javascript" src="js/realtime_graph.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
</head>
<style>
        
        .mini_chart{
            width:100%;
            height:100%; 
            //text-align: center;
            //border-style: solid;
        }
	    #chart_1{
            border-style: solid;
            border-color:#D3D3D3;

            width: 25%;
        }

	    #chart_2{
            border-style: solid;
            border-color:#D3D3D3;

            width: 37.5%;
        }
	    #chart_3{
            border-style: solid;
            border-color:#D3D3D3;

            width: 50%;
        }
	    #chart_4{
            border-style: solid;
            border-color:#D3D3D3;

            width: 50%;
        }
	    #chart_5 {
            //border-style: solid;
            border-color:#D3D3D3;

            width: 100%;
        }
        #chart_6{
            border-style: solid;
            border-color:#D3D3D3;

            width: 37.5%;
        }
        tr {
            //border-style: solid;
        }
        td {
            height:1px;
        }
        table {
            //width:100%;
            //height:100%;
            //border-style: solid;
            table-layout: fixed;
            border-collapse: collapse;
            padding:0;
        }
        text {
            font-family: sans-serif;
            font-size: 15px;
        }
    </style>
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
                        <a class="dropdown-item" href="#">Current Analysis</a>
                        <a class="dropdown-item" href="previous_2010.php">Past Data Analysis</a>
                    </div>
                </li>
            </ul>
        </div>
        <p style="color: white; font-size: 20px; font-family: Verdana, Geneva, Tahoma, sans-serif">Indian Institute of Technology, Kanpur</p>
    </nav>
    <br>
    <div class="container-fluid">
        <table>
            <tr>
                <td id="chart_1" colspan='2'></td>
                <td id="chart_2" colspan='3'></td>
                <td id="chart_6" colspan='3'></td>
            </tr>
            <tr>
                <td id="chart_3" colspan='4'></td>
                <td id="chart_4" colspan='4'></td>
            </tr>
            <tr>
                <td id="chart_5" colspan='8'></td>
            </tr>
        </table>
    </div>
</body>
<script type="text/javascript">
    $(document).ready(function () {
        plot_graph();
    });
</script>
</html>