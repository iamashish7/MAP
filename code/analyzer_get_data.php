<?php
header('Content-Type: application/json');
date_default_timezone_set('GMT');
$from_ = $_POST['from'];
$to_ = $_POST['to'];
$chart = $_POST['chart'];

$from = date('Y-m-d', strtotime($from_));
$to = date('Y-m-d', strtotime($to_));

$from_epoch = strtotime($from);
$to_epoch = strtotime($to);

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

$servername = "localhost";
$username = "ashish";
$password = "ashish007";
$dbname = $_POST['db'];
$table = $_POST['table'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
function date_sort($a, $b)
{
    $a = strtotime($a);
    $b = strtotime($b);
    return $a > $b;
}

switch ($chart) {
    case "1":
        // Jobs Executing per day
        $sql = "select jobid,start,end from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and status='completed'";
        $result = $conn->query($sql);
        $json_array = array();
        $from2 = $from;
        while (strtotime($from) <= strtotime($to)) {
            $json_array[$from] = 0;
            $from = date ("Y-m-d", strtotime("+1 days", strtotime($from)));
        }
        
        while ($row = $result->fetch_assoc()) {
            $start = date('Y-m-d', strtotime($row['start']));
            $end = date('Y-m-d', strtotime($row['end']));
            if (strtotime($end) > strtotime($to)){
                $end = $to;
            }
            if (strtotime($start) < strtotime($from2)){
                $start = $from2;
            }
            $json_array[$start] = $json_array[$start] + 1;
            $end2 = date ("Y-m-d", strtotime("+1 days", strtotime($end)));
            if(strtotime($end2) <= strtotime($to))
                $json_array[$end2] = $json_array[$end2] - 1;
        }
        $keys = array_keys($json_array);
        usort($keys, date_sort);
        for($i = 1; $i<sizeof($keys);++$i)
        {
            $json_array[$keys[$i]] += $json_array[$keys[$i-1]];
            if(strtotime($to)<strtotime($keys[$i]) || strtotime($from2)>strtotime($keys[$i]))
                unset($json_array[$keys[$i]]);
        }
        break;
    case "2":
        // Jobs per month
        $sql = "select concat(year(date),'-',month(date)) as d, count(distinct(jobid)) as jobs from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and status='completed' group by d";
        $sql2 = "select concat(year(date),'-',month(date)) as d, count(distinct(jobid)) as jobs from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and (status='failed' or status='cancelled') group by d";
        
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
        break;
    case "3":
        $json_array = array();
        $sql = "select count(distinct jobid) as total from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' " ;
        $sql2 = "select status,count(distinct jobid) as c from ".$table."  where date >= '" . $from . "' and date <= '" . $to . "' group by status";
        
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
        $sql = "select queue, avg(CAST((wtime)/(60*60) as UNSIGNED)) as avg_waitingtime from ".$table." where stime>='".$from."' and stime<='".$to."' and queue not like 'R%' group by queue";
        $result = $conn->query($sql);
        while ($row = $result->fetch_assoc()) {
            $json_array[$row['queue']] = $row['avg_waitingtime'];
        }
        $jarray = json_encode($json_array);
        break;
    case "5":
        $json_array = [];
        $sql = "select jobid, rtime/(3600) as rtime from ".$table." where date >= '" . $from . "' and date <= '" . $to . "'  and status='completed'" ;
        
        $result = $conn->query($sql);
        while ($row = $result->fetch_assoc()) {
            $json_array[$row['jobid']] = $row['rtime'];
        }
        break;
    case "6":
        $json_array = [];
        $sql = "select CAST((wtime)/(60*60) as UNSIGNED) as wtime
        ,date,count(*) as jobs from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and wtime >= 0 group by wtime,date order by date,wtime;";   
        
        $result = $conn->query($sql);
        while ($row = $result->fetch_assoc()) {
            $index_merge['wtime'] = $row['wtime'];
            $index_merge['date'] = $row['date'];
            $json_array[json_encode($index_merge)] = $row['jobs'];
        }
        $jarray = json_encode($json_array);
        break;
    case "7":
    	$sql = "select jobid,wtime/(3600) as wtime from ".$table." where wtime>=0 and date >= '" . $from . "' and date <= '" . $to . "' and wtime >= 0";
        
        $result = $conn->query($sql);
        while ($row = $result->fetch_assoc()) {
            $json_array[$row['jobid']] = (int)($row['wtime']);
        }
        unset($json_array['']);
        $jarray = json_encode($json_array);
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