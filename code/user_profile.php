<html lang="en">
<head>
    <title>MAP</title>
    <meta charset="utf-8">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script src="js/d3.v4.min.js"></script>
    <script src="js/d3.tip.v0.6.3.js"></script>
    <script src="js/UserProfile.js"></script>
    <script src="js/RadarChart.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
</head>
<style>
       .text-bold{
           font-weight:bold;
       }
       .err-msg {
            width: 30%;
            margin-left: auto;
            margin-right: auto;
            display : none;
       }
       .border-table {
            border-style: solid;
            border-color:#D3D3D3;
       }
       .card-height{
            height: 25%;
       } 
       .text-center{
            text-align: center;
       }
       .fix-table-layout{
            table-layout: fixed;
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
                <li class="nav-item dropdown">
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
        <a class="navbar-brand" style="color: white; font-family: Arial, Helvetica, sans-serif">Indian Institute of Technology Kanpur</a>
    </nav>
    <br>
    <div class="container-fluid ">
        <form class="form-inline justify-content-center">
            <label for="userid">UserId:</label>&nbsp;
            <input type="text" class="form-control" id="user" placeholder="Enter UserID" name="user">&nbsp;&nbsp;
            <button type='button' id="submit-btn" class="btn btn-primary">Submit</button>
        </form>
        <div class="alert alert-danger err-msg ">
            <div class="d-flex justify-content-center">
                <strong>ERROR! &nbsp&nbsp</strong> No such user present.
            </div>
        </div>
        <br>
        <!-- USE TBALE TO DESIGN LAYOUT -->
        <table class="table border-table fix-table-layout">
            <tr>
                <td colspan='1' class="border-table card-height">
                    <div class="card bg-primary text-white">
                        <div class="card-body container text-center">
                            <h4 id='total'><b>N/A</b></h4>
                            <p>Total Jobs(TJS)</p>
                        </div>
                    </div>
                </td>
                <td colspan='1' class="border-table card-height">
                    <div class="card bg-success text-white">
                        <div class="card-body container text-center">
                            <h4 id='completed'><b>N/A</b></h4>
                            <p>Completed Jobs(CJ)</p>
                        </div>
                    </div>
                </td>
                <td colspan='1' class="border-table card-height">
                    <div class="card bg-danger text-white">
                        <div class="card-body container text-center">
                            <h4 id='failed'><b>N/A</b></h4>
                            <p>Failed Jobs(FJ)</p>
                        </div>
                    </div>
                </td>
                <td colspan='3' rowspan='2' class="border-table">
                    <table id='userData' class="table table-striped">
                        <tr>
                            <td class='text-bold'> User ID </td>
                            <td id='UID'></td>
                        </tr>
                        <tr>
                            <td class='text-bold'> Most frequent queue(MFQ) </td>
                            <td id='MFQ'></td>
                        </tr>
                        <tr>
                            <td class='text-bold'> Average job submission frequency(AJSI) </td>
                            <td id='AJSI'></td>
                        </tr>
                        <tr>
                            <td class='text-bold'> Average wait-time(AWT) </td>
                            <td id='AWT'></td>
                        </tr>
                        <tr>
                            <td class='text-bold'> Average memory used(AMU) </td>
                            <td id='AMU'></td>
                        </tr>
                        <tr>
                            <td class='text-bold'> Most used cluster(MUC) </td>
                            <td id='MUC'></td>
                        </tr>
                        <!-- <tr>
                            <td class='text-bold'> total jobs submitted(TJS) </td>
                            <td id='TJS'></td>
                        </tr> -->
                        <tr>
                            <td class='text-bold'> Average nodes used per job(ANU) </td>
                            <td id='ANU'></td>
                        </tr>
                        <!-- <tr>
                            <td class='text-bold'> Completed jobs(CJ) </td>
                            <td id='CJ'></td>
                        </tr> -->
                        <!-- <tr>
                            <td class='text-bold'> Failed jobs(FJ) </td>
                            <td id='FJ'></td>
                        </tr> -->
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan='3' class="border-table" id='user_chart'></td>
            </tr>
        </table>
        <!-- <div class="row">
            <div id='chart_area' class="col-6">
                <div class="row">
                    <div class="card">
                            <div class="container">
                                <h4><b>John Doe</b></h4>
                                <p>Architect & Engineer</p>
                            </div>
                    </div>
                    <div class="card">
                            <div class="container">
                                <h4><b>John Doe</b></h4>
                                <p>Architect & Engineer</p>
                            </div>
                    </div>
                    <div class="card">
                            <div class="container">
                                <h4><b>John Doe</b></h4>
                                <p>Architect & Engineer</p>
                            </div>
                    </div> 
                </div>
            </div>
            <table id='userData' class="table table-striped col-6">
                <tr>
                    <td class='text-bold'> User ID </td>
                    <td id='UID'></td>
                </tr>
                <tr>
                    <td class='text-bold'> Most frequent queue </td>
                    <td id='MFQ'></td>
                </tr>
                <tr>
                    <td class='text-bold'> Average job submission frequency </td>
                    <td id='AJSI'></td>
                </tr>
                <tr>
                    <td class='text-bold'> Average wait-time </td>
                    <td id='AWT'></td>
                </tr>
                <tr>
                    <td class='text-bold'> Average memory used </td>
                    <td id='AMU'></td>
                </tr>
                <tr>
                    <td class='text-bold'> Most used cluster </td>
                    <td id='MUC'></td>
                </tr>
                <tr>
                    <td class='text-bold'> total jobs submitted </td>
                    <td id='TJS'></td>
                </tr>
                <tr>
                    <td class='text-bold'> Average nodes used per job </td>
                    <td id='ANU'></td>
                </tr>
                <tr>
                    <td class='text-bold'> Completed jobs </td>
                    <td id='CJ'></td>
                </tr>
                <tr>
                    <td class='text-bold'> Failed jobs </td>
                    <td id='FJ'></td>
                </tr>
            </table>
        </div> -->
    </div>
</body>
<script type="text/javascript">
    $(document).ready(function () {
        $("#submit-btn").click(function(event){
            document.getElementsByClassName('err-msg')[0].style.display = 'none';
            var userId = $("#user").val();
            console.log(userId);
            //$("#chart1").empty();
            $.ajax({
                url:"GetUserProp.php",
                method:"POST",
                data:{user:userId},
                success:function(returnData) {
                    data = returnData.data;
                    if(data.error==1)
                    {    
                        document.getElementsByClassName('err-msg')[0].style.display = 'block';
                        ClearUserTable();
                    }
                    else
                    {
                        console.log(returnData.data2);
                        console.log(returnData.data3);
                        fillUserTable(returnData.data,userId);
                        plotSpiderChart(returnData.data2,returnData.data3,'user_chart',userId);
                    }
                },
                error:function(err) {
                    console.log(err);
                }
            });
        });
    });
</script>
</html>
