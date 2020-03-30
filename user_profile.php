<html lang="en">
<head>
    <title>HPC-Analysis</title>
    <meta charset="utf-8">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script src="js/d3.v4.min.js"></script>
    <script src="js/d3.tip.v0.6.3.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
</head>
<style>
                
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
        <p style="color: white; font-size: 20px; font-family: Verdana, Geneva, Tahoma, sans-serif">Indian Institute of Technology, Kanpur</p>
    </nav>
    <br>
    <div class="container-fluid ">
        <form class="form-inline justify-content-center">
            <label for="userid">UserId:</label>&nbsp;
            <input type="text" class="form-control" id="user" placeholder="Enter UserID" name="user">&nbsp;&nbsp;
            <button type='button' id="submit-btn" class="btn btn-primary">Submit</button>
        </form>
        <br>
        <div id='chart_area' class="col-6"></div>
        <table id='userData' class="col-6">
        </table>
    </div>
</body>
<script type="text/javascript">
    $(document).ready(function () {
    	$("#submit-btn").click(function(event){
            var userId = $("#user").val();
            //$("#chart1").empty();
            $.ajax({
                url:"GetUserProp.php",
                method:"POST",
                data:{user:userId},
                success:function(returnData) {
                    fillUserTable(returnData);
                },
                error:function(err) {
                    console.log(err);
                }
            });
        });
    });
</script>
</html>