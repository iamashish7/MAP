<html lang="en">
<head>
    <title>MAP</title>
    <meta charset="utf-8">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <script src="js/d3.v4.min.js"></script>
    <script src="js/d3.tip.v0.6.3.js"></script>
    <script type="text/javascript" src="js/plot_realtime_2013.js"></script>
    <script type="text/javascript" src="js/realtime_graph_2013.js"></script>
    <script type="text/javascript" src="js/Graphs.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
</head>
<style>
        .makeGinline {
            display: inline-block;
        }
        .hide{
            display: none;
        }
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
        tr{
            //border-style: solid;
            border-color:#D3D3D3;

        }
        td{
            height:1px;
        }
        table{
            //width:100%;
            //height:100%;
            //border-style: solid;
            table-layout: fixed;
            border-collapse: collapse;
            padding:0;
        }
        /* text {
            font-family: sans-serif;
            font-size: 15px;
        } */

        /* Add shadow effect to chart. If you don't like it, get rid of it. */
        /* svg {
            -webkit-filter: drop-shadow( 0px 3px 3px rgba(0,0,0,.3) );
            filter: drop-shadow( 0px 3px 3px rgba(0,0,0,.25) );
        } */

        /*Styling for the lines connecting the labels to the slices*/
        polyline{
            opacity: .3;
            stroke: black;
            stroke-width: 2px;
            fill: none;
        }

        /* Make the percentage on the text labels bold*/
        .labelName tspan {
            font-style: normal;
            font-weight: 700;
        }

        /* In biology we generally italicise species names. */
        .labelName {
            font-size: 0.9em;
            font-style: italic;
        }
        /* text {
            font-family: sans-serif;
            font-size: 15px;
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

        /* For Tablets */
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
        
        /* For PC */
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

        /* For PC */
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

        /* For PC */
        @media screen and  (min-width: 1020px) and (max-width: 1260px) {
            .graph-title {
                font-size: 15px;
                text-align: center;
            }
            .axis-labels{
                font-size: 14px;
            }
            .axis-ticks{
                font-size: 13px;
            }
        }

        /* For PC */
        @media screen and  (min-width: 1261px) and (max-width: 1500px) {
            .graph-title {
                font-size: 15px;
                text-align: center;
            }
            .axis-labels{
                font-size: 14px;
            }
            .axis-ticks{
                font-size: 13px;
            }
        }

        /* For PC */
        @media screen and  (min-width: 1500px)  and (max-width: 1740px){
            .graph-title {
                font-size: 17px;
                text-align: center;
            }
            .axis-labels{
                font-size: 16px;
            }
            .axis-ticks{
                font-size: 15px;
            }
        }

        /* For PC */
        @media screen and  (min-width: 1741px) {
            .graph-title {
                font-size: 19px;
                text-align: center;
            }
            .axis-labels{
                font-size: 17px;
            }
            .axis-ticks{
                font-size: 16px;
            }
        }
        
    </style>
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
                    <a class="nav-link" href="monitor_2013_multiple_selection.html">Monitoring</a>
                </li>
                <li class="nav-item dropdown active">
                    <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
                        Analysis
                    </a>
                    <div class="dropdown-menu ">
                        <a class="dropdown-item" href="#">Current Analysis</a>
                        <!-- <a class="dropdown-item" href="#">Past Data Analysis</a> -->
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="wait_time_pred.php">Prediction</a>
                </li>
            </ul>
        </div>
        <a class="navbar-brand" style="color: white; font-family: Arial, Helvetica, sans-serif">Indian Institute of Technology Kanpur</a>
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
        ready_data_plot();
    });
</script>
</html>
