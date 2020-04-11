<?php
header('Content-Type: application/json');
$from_ = $_POST['from'];
$to_ = $_POST['to'];
$chart = $_POST['chart'];

$from = date('Y-m-d', strtotime($from_));
$to = date('Y-m-d', strtotime($to_));

$ts1 = strtotime($from_);
$ts2 = strtotime($to_);

$year1 = date('Y', $ts1);
$year2 = date('Y', $ts2);

$month1 = date('m', $ts1);
$month2 = date('m', $ts2);

$date1 = date('d', $ts1);
$date2 = date('d', $ts2);

$yearDiff = ($year2 - $year1) + 1;
$monthDiff = (($year2 - $year1) * 12) + ($month2 - $month1) + 1;
$dateDiff = (($year2 - $year1) * 12) + (($month2 - $month1)*30) + (($month2 - $month1)/2) + ($date2 - $date1) + 1;
//echo $diff;

$servername = "localhost";
$username = "ashish";
$password = "ashish007";
$dbname = "";
if (array_key_exists('db',$_POST))
    $dbname = $_POST['db'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
if ($conn2->connect_error) {
    die("Connection failed: " . $conn2->connect_error);
}
function date_sort($a, $b)
{
    $a = strtotime($a);
    $b = strtotime($b);
    return $a > $b;
}

switch ($chart) {
    case "1":
        $timebegin = round(microtime(true) * 1000000);
        //$sql = "select A.jobid,start,end from (select jobid,start from loganalysis_master where status='S' and date >= '" . $from . "' and date <= '" . $to . "')A left join (select jobid,end from loganalysis_master where status='E' and date >= '" . $from . "' and date <= '" . $to . "')B on A.jobid = B.jobid where end>=start UNION select A.jobid,start,end from (select jobid,start from loganalysis_master where status='S' and date >= '" . $from . "' and date <= '" . $to . "')A right join (select jobid,end from loganalysis_master where status='E' and date >= '" . $from . "' and date <= '" . $to . "')B on A.jobid = B.jobid where end>=start";
        //$sql = "select * from (select A.jobid,start,end from (select jobid,start from loganalysis_master where status='S' and date >= '" . $from . "' and date <= '" . $to . "')A left join (select jobid,end from loganalysis_master where status='E' and date >= '" . $from . "' and date <= '" . $to . "')B on A.jobid = B.jobid where end>=start UNION select A.jobid,start,end from (select jobid,start from loganalysis_master where status='S' and date >= '" . $from . "' and date <= '" . $to . "')A right join (select jobid,end from loganalysis_master where status='E' and date >= '" . $from . "' and date <= '" . $to . "')B on A.jobid = B.jobid where end>=start)C where start>='" . $from . "' order by start desc";
        //$sql = "select * from (select A.jobid,start,end from (select jobid,start from loganalysis_master where status='S' and start<'" . $to . "')A left join (select jobid,end from loganalysis_master where status='E' and end>'" . $from . "')B on A.jobid = B.jobid where end>=start UNION select A.jobid,start,end from (select jobid,start from loganalysis_master where status='S' and start<'" . $to . "')A right join (select jobid,end from loganalysis_master where status='E' and end>'" . $from . "')B on A.jobid = B.jobid where end>=start)C order by start";
        $sql = "select jobid,start,end from Master where date >= '" . $from . "' and date <= '" . $to . "'";
        $timeend = round(microtime(true) * 1000000);
        //echo '<script>console.log('.($timeend-$timebegin).')</script>';
        //echo '<script>console.log('.($timebegin).')</script>';
        //echo '<script>console.log('.($timeend).')</script>';
         
        $result = $conn->query($sql);
        $json_array = array();
        $from2 = $from;

        $timebegin = round(microtime(true) * 1000);
        while (strtotime($from) <= strtotime($to)) {
            $json_array[$from] = 0;
            $from = date ("Y-m-d", strtotime("+1 days", strtotime($from)));
        }
        $timeend = round(microtime(true) * 1000);
        //echo 'Initialization = '.($timeend-$timebegin).' ms';
        
        $timebegin = round(microtime(true) * 1000);
        
        while ($row = $result->fetch_assoc()) {
            $start = date('Y-m-d', strtotime($row['start']));
            $end = date('Y-m-d', strtotime($row['end']));
            if ($end > $to){
                $end = $to;
            }
            if ($start < $from2){
                $start = $from2;
            }
            while (strtotime($start) <= strtotime($end)) {
                $json_array[$start] = $json_array[$start] + 1;
                $start = date ("Y-m-d", strtotime("+1 days", strtotime($start)));
            }
        }
        $timeend = round(microtime(true) * 1000);
        //echo 'Population = '.($timeend-$timebegin).' ms';
        
        //echo $json_array;
        //$keys = array_keys($json_array);
        //usort($keys, date_sort);
        //$json_array_2 = array();
        //for ($x = 0; $x < sizeof($json_array); $x++) {
        //    $json_array_2[$keys[$x]] = $json_array[$keys[$x]];
        //}
        //$jarray = json_encode($json_array_2);
        //print_r($jarray);
        break;
    case "2":
        $timebegin = round(microtime(true) * 1000000);
        //$sql = "select concat(year(date),'-',month(date)) as d, count(distinct(jobid)) as jobs from loganalysis_master where date >= '" . $from . "' and date <= '" . $to . "' and status = 'Q' group by d";
        //$sql2 = "select concat(year(date),'-',month(date)) as d, count(distinct(jobid)) as jobs from loganalysis_master where date >= '" . $from . "' and date <= '" . $to . "' and status = 'E' group by d";
        $sql = "select concat(year(date),'-',month(date)) as d, count(distinct(jobid)) as jobs from Master where date >= '" . $from . "' and date <= '" . $to . "' group by d";
        $sql2 = "select concat(year(date),'-',month(date)) as d, count(distinct(jobid)) as jobs from Master where date >= '" . $from . "' and date <= '" . $to . "' group by d";
        $timeend = round(microtime(true) * 1000000);
        //echo '<script>console.log('.($timeend-$timebegin).')</script>';
        // echo '<script>console.log('.($timebegin).')</script>';
        // echo '<script>console.log('.($timeend).')</script>';
        
        $result = $conn->query($sql);
        $result2 = $conn->query($sql2);
        while ($row = $result->fetch_assoc()) {
            $json_array[$row['d']] = array();
            array_push($json_array[$row['d']], $row['jobs']);
        }
        while ($row = $result2->fetch_assoc()) {
            array_push($json_array[$row['d']], $row['jobs']);
        }
        $keys = array_keys($json_array);
        usort($keys, date_sort);
        $json_array_2 = array();
        for ($x = 0; $x < sizeof($json_array); $x++) {
            $json_array_2[$keys[$x]] = $json_array[$keys[$x]];
        }
        $json_array = $json_array_2;
        $jarray = json_encode($json_array_2);
        //print_r($jarray);
        break;
    case "3":
        /*
        $json_array = array();
        $timebegin = round(microtime(true) * 1000000);
        $sql = 'select CONCAT(  " select \"",  table_name,  "\" as table_name, COUNT(*) as exact_row_count from `", table_schema, "`.`", table_name, "` union " ) as c  FROM INFORMATION_SCHEMA.TABLES  WHERE table_schema = "HPC_new2" and table_name<>"id_table";';
        $sql2 = 'select CONCAT(  " select  COUNT(distinct(jobid)) as total from `", table_schema, "`.`", table_name,"` where jobid>=0",  " union " ) as c  FROM INFORMATION_SCHEMA.TABLES  WHERE table_schema = "HPC_new2" and table_name<>"id_table" and table_name<>"Master_L";';
        $timeend = round(microtime(true) * 1000000);
        //echo '<script>console.log('.($timeend-$timebegin).')</script>';
        
        $result2 = $conn->query($sql2);
        $new_query = "";
        while ($row = $result2->fetch_assoc()) {
            $new_query .= $row['c'];
        }
        
        $total = 0;
        $new_query .= "   select  COUNT(*) as total from `HPC_new2`.`Master_L`;";
        
        
        $result2 = $conn->query($new_query);
        while ($row = $result2->fetch_assoc()) {
            $total += $row['total'];
        }

        $result = $conn->query($sql);
        $new_query = "";
        while ($row = $result->fetch_assoc()) {
            $new_query .= $row['c'];
        }
        $new_query = preg_replace('/\W\w+\s*(\W*)$/', '$1', $new_query);
        
        $result = $conn->query($new_query);
        while ($row = $result->fetch_assoc()) {
            $json_array[substr($row['table_name'], -1)] = ceil(($row['exact_row_count']/$total)*100);
        }*/
        $json_array = array();
        $timebegin = round(microtime(true) * 1000000);
        $sql = "select count(distinct jobid) as total from Master where date >= '" . $from . "' and date <= '" . $to . "' " ;
        $sql2 = "select status,count(distinct jobid) as c from Master  where date >= '" . $from . "' and date <= '" . $to . "' group by status";
        $timeend = round(microtime(true) * 1000000);
        //echo '<script>console.log('.($timeend-$timebegin).')</script>';
        
        $result = $conn->query($sql);
        $result2 = $conn->query($sql2);
        while ($row = $result->fetch_assoc()) {
            $total = $row['total'];
        }
        while ($row = $result2->fetch_assoc()) {
            $json_array[$row['status']] = ceil(($row['c']/$total)*100);
        }
        $jarray = json_encode($json_array);
        break;
    case "4":
        $timebegin = round(microtime(true) * 1000000);    
        //$sql = "select queue, avg(CAST((UNIX_TIMESTAMP(start)-UNIX_TIMESTAMP(qtime))/(60*60) as UNSIGNED)) as avg_waitingtime from loganalysis_master where queue not like '"."R%"."' and status='"."S"."' and start >= qtime and qtime>='".$from."' and qtime<='".$to."' group by queue";
        $sql = "select queue, avg(CAST((UNIX_TIMESTAMP(start)-UNIX_TIMESTAMP(stime))/(60*60) as UNSIGNED)) as avg_waitingtime from Master where stime>='".$from."' and stime<='".$to."' group by queue";
        $timeend = round(microtime(true) * 1000000);
        //echo '<script>console.log('.($timeend-$timebegin).')</script>';
        // echo '<script>console.log('.($timebegin).')</script>';
        // echo '<script>console.log('.($timeend).')</script>';
        
        $result = $conn->query($sql);
        while ($row = $result->fetch_assoc()) {
            $json_array[$row['queue']] = $row['avg_waitingtime'];
        }
        $jarray = json_encode($json_array);
        //print_r($jarray);
        break;
    case "5":
        $json_array = [];
        $timebegin = round(microtime(true) * 1000000);    
    	//$sql = "select id, timestampdiff(hour,start,end) as extime from loganalysis_master where (exitstatus>=0 and exitstatus<128 or (exitstatus is null)) and status='E' and queue not like 'R%' and start>'1970-01-01 00:00:00' and date >= '" . $from . "' and date <= '" . $to . "' " ;
        $sql = "select jobid, timestampdiff(hour,start,end) as extime from Master where date >= '" . $from . "' and date <= '" . $to . "' " ;
        $timeend = round(microtime(true) * 1000000);
        //echo '<script>console.log('.($timeend-$timebegin).')</script>';
        // echo '<script>console.log('.($timebegin).')</script>';
        // echo '<script>console.log('.($timeend).')</script>';
        
        //echo "here";
        $result = $conn->query($sql);
        while ($row = $result->fetch_assoc()) {
            //echo "here1";
            $json_array[$row['id']] = $row['extime'];
        }
        // unset($json_array['']);
        //asort($json_array);
        //print_r($jarray);
        break;
    case "6":
        $json_array = [];
    	$timebegin = round(microtime(true) * 1000000);
        $sql = "select wtime,date,count(*) as jobs from Master where date >= '" . $from . "' and date <= '" . $to . "' and wtime >= 0 group by wtime,date order by date,wtime;";   
        $timeend = round(microtime(true) * 1000000);
        //echo '<script>console.log('.($timeend-$timebegin).')</script>';
        // echo '<script>console.log('.($timebegin).')</script>';
        // echo '<script>console.log('.($timeend).')</script>';
        
        $result = $conn->query($sql);
        while ($row = $result->fetch_assoc()) {
            $index_merge['wtime'] = $row['wtime'];
            $index_merge['date'] = $row['date'];
            $json_array[json_encode($index_merge)] = $row['jobs'];
        }
        $jarray = json_encode($json_array);
        //print_r($jarray);
        break;
    case "7":
    	//$sql = "select timestampdiff(hour,ctime,start) as wtime,count(*) as num_jobs from loganalysis_master where (exitstatus>=0 and exitstatus<128 or (exitstatus is null)) and status='E' and queue not like '"."R%"."' and start>'1970-01-01 00:00:00' and date >= '" . $from . "' and date <= '" . $to . "' group by difff";
        $timebegin = round(microtime(true) * 1000000);
        $sql = "select jobid,wtime from Master where wtime>=0 and date >= '" . $from . "' and date <= '" . $to . "' ";
        $timeend = round(microtime(true) * 1000000);
        //echo '<script>console.log('.($timeend-$timebegin).')</script>';
        // echo '<script>console.log('.($timebegin).')</script>';
        // echo '<script>console.log('.($timeend).')</script>';
        
        $result = $conn->query($sql);
        while ($row = $result->fetch_assoc()) {
            $json_array[$row['id']] = (int)($row['wtime']);
        }
        //echo $json_array;
        unset($json_array['']);
        //asort($json_array);
        $jarray = json_encode($json_array);
        //print_r($jarray);
        break;
    default:
        //echo "Your favorite color is neither red, blue, nor green!";
}
$conn->close();
$returnData['data'] = $json_array;
$returnData['months'] = $monthDiff;
$returnData['years'] = $yearDiff;
$returnData['dates'] = $dateDiff;
$returnData['ID'] = $chart;
exit((json_encode($returnData)));

?>
<!-- <html>
<head>
</head>
<body>
    <form id="myform" method="post" action="analysis3.php">
        <input type="hidden" id="data" name="data" value=<?php //echo $jarray ?>>
        <input type="hidden" id="months" name="months" value=<?php //echo $diff ?>>
        <input type="hidden" id="ID" name="ID" value=<?php //echo $chart ?>>
    </form>
    <p id="temp" name="temp"></p>
</body>
<script>
    window.onload = function() {
        var form = document.getElementById("myform");
        form.submit();
        //document.getElementById("temp").innerHTML = <?php //print_r($jarray) ?>;
    }
</script>
</html> -->
