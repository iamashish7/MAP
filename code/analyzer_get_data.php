<?php
header('Content-Type: application/json');
// ini_set('display_errors',1);
// error_reporting(E_ALL);

ini_set('max_execution_time',300);
ini_set('memory_limit', '256M');


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
$username = "monalys";
$password = "monalys";
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

function get_data_jobs_executing_per_day($table,$from,$to,$conn)
{
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
    return $json_array;
}

function get_data_jobs_per_month($table,$from,$to,$conn)
{
    // Jobs per month
    $sql = "select concat(year(date),'-',month(date)) as d, count(distinct(jobid)) as jobs from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and status='completed' group by d";
    $sql2 = "select concat(year(date),'-',month(date)) as d, count(distinct(jobid)) as jobs from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and (status='failed' or status='cancelled') group by d";
    
    $result = $conn->query($sql);
    $result2 = $conn->query($sql2);
    while ($row = $result->fetch_assoc()) {
        $json_array[$row['d']] = [0,0];
        $json_array[$row['d']][0] = $row['jobs'];
        // array_push($json_array[$row['d']], $row['jobs']);
    }
    while ($row = $result2->fetch_assoc()) {
        $json_array[$row['d']][1] = $row['jobs'];
        // array_push($json_array[$row['d']], $row['jobs']);
    }
    $keys = array_keys($json_array);
    usort($keys, date_sort);
    $json_array_2 = array();
    for ($x = 0; $x < sizeof($json_array); $x++) {
        $json_array_2[$keys[$x]] = $json_array[$keys[$x]];
    }
    $json_array = $json_array_2;
    return $json_array;
}

function get_data_count_per_status($table,$from,$to,$conn)
{
    // Job count per status
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
    return $json_array;
}

function get_data_avg_wtime_per_Q($table,$from,$to,$conn)
{
    // AVG wtime per queue
    $sql = "select queue, avg(CAST((wtime)/(60*60) as UNSIGNED)) as avg_waitingtime from ".$table." where wtime >= 0 and stime>='".$from."' and stime<='".$to."' and queue not like 'R%' group by queue";
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $json_array[$row['queue']] = $row['avg_waitingtime'];
    }
    return $json_array;
}

function get_data_extime_vs_jobs($table,$from,$to,$conn)
{
    $json_array = [];
    $sql = "select jobid, rtime/(60*60) as rtime from ".$table." where date >= '" . $from . "' and date <= '" . $to . "'  and rtime>0" ;
    
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $json_array[$row['jobid']] = $row['rtime'];
    }
    return $json_array;
}

function get_data_vartn_wtime_by_day($table,$from,$to,$conn)
{
    $json_array = [];
    $sql = "select CAST((wtime)/(60*60) as UNSIGNED) as wtime ,date,count(*) as jobs from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and wtime >= 0 group by wtime,date order by date,wtime;";   
    
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $index_merge['wtime'] = $row['wtime'];
        $index_merge['date'] = $row['date'];
        $json_array[json_encode($index_merge)] = $row['jobs'];
    }
    return $json_array;
}

function get_data_wtime_vs_jobs($table,$from,$to,$conn)
{
    $sql = "select jobid,wtime/(3600) as wtime from ".$table." where wtime>=0 and date >= '" . $from . "' and date <= '" . $to . "'";
    
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $json_array[$row['jobid']] = (int)($row['wtime']);
    }
    unset($json_array['']);
    return $json_array;
}

function get_data_vartn_wtime_by_req($table,$from,$to,$conn)
{
    // $rtime_buckets = [[0,1],[1,2],[2,4],[4,7],[7,10],[10,13],[13,15],[15,17],[17,20],[20,24],[24,27],[27,30],[30,33],[33,36],[36,40],[40,44],[44,50],[50,57],[57,65],[65,80],[80,90],[90,100],[100,117],[117,121],[121,152],[152,1000]];
    // $proc_buckets = [[0,1],[2,4],[4,8],[8,16],[16,32],[32,64],[64,128],[128,256],[256,512],[512,1024],[1024,2048]];
    // for ($i = 0; $i < count($rtime_buckets); $i++) {
    //     for ($j = 0; $j < count($proc_buckets); $j++) {
    //         $sql = "select avg(wtime) as wtime from ".$table." where wtime>=0 and date >= '" . $from . "' and date <= '" . $to . "' and req_rtime>=".($rtime_buckets[$i][0]*3600)." and req_rtime<".($rtime_buckets[$i][1]*3600)." and req_proc>=".$proc_buckets[$j][0]." and req_proc<".$proc_buckets[$j][1]." ";
    //         $sql2 = "select count(*) as jobs from ".$table." where wtime>=0 and date >= '" . $from . "' and date <= '" . $to . "' and req_rtime>=".($rtime_buckets[$i][0]*3600)." and req_rtime<".($rtime_buckets[$i][1]*3600)." and req_proc>=".$proc_buckets[$j][0]." and req_proc<".$proc_buckets[$j][1]." ";
    //         $result = $conn->query($sql);
    //         $result2 = $conn->query($sql2);
    //         $wtime = 0;
    //         $jobs = 0;
    //         while ($row = $result->fetch_assoc()) {
    //             $wtime = $row['wtime']; 
    //         }
    //         while ($row = $result2->fetch_assoc()) {
    //             $jobs = $row['jobs']; 
    //         }
    //         if($jobs){
    //             $index_merge['rtime'] = [$rtime_buckets[$i][0],$rtime_buckets[$i][1]];
    //             $index_merge['proc'] = [$proc_buckets[$j][0],$proc_buckets[$j][1]];
    //             $json_array[json_encode($index_merge)] = [$wtime,$jobs];
    //         }
    //     }
    // }

    $rtime_buckets = [[0,1],[1,2],[2,4],[4,7],[7,10],[10,13],[13,15],[15,17],[17,20],[20,24],[24,27],[27,30],[30,33],[33,36],[36,40],[40,44],[44,50],[50,57],[57,65],[65,80],[80,90],[90,100],[100,117],[117,121],[121,152],[152,1000]];
    $proc_buckets = [[0,1],[2,4],[4,8],[8,16],[16,32],[32,64],[64,128],[128,256],[256,512],[512,1024],[1024,2048]];
    $sql = " SELECT avg(wtime) as wtime,count(*) as jobs, CASE ";
    for ($i = 0; $i < count($rtime_buckets); $i++) {
        for ($j = 0; $j < count($proc_buckets); $j++) {
            $temp_str = "WHEN req_rtime>=".($rtime_buckets[$i][0]*3600)." and req_rtime<".($rtime_buckets[$i][1]*3600)." and req_proc>="
            .$proc_buckets[$j][0]." and req_proc<".$proc_buckets[$j][1]." THEN '".$rtime_buckets[$i][0].";".$rtime_buckets[$i][1].";".$proc_buckets[$j][0].";".$proc_buckets[$j][1]."'\n";
            $sql .= $temp_str;
        }
    }
    $sql .= "END AS groups FROM HPC2010 where wtime>=0 and date >= '" . $from . "' and date <= '" . $to . "' group by groups order by groups;"; 
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        if($row['groups']!='NULL') {
            $grouparr = explode(";", $row['groups']);
            if(sizeof($grouparr)==4) {
                $index_merge['rtime'] = [(int)$grouparr[0],(int)$grouparr[1]];
                $index_merge['proc'] = [(int)$grouparr[2],(int)$grouparr[3]];
                $json_array[json_encode($index_merge)] = [$row['wtime'],$row['jobs']]; 
            }
            
        }
    }
    return $json_array;
}

function get_data_vartn_wtime_by_req2($table,$from,$to,$conn)
{
    $rtime_min = 0;
    $rtime_max = 0;
    $proc_min = 0;
    $proc_max = 0;
    $no_buckets = 50;
    $boundary_percent = 0.8;
    $sql = " SELECT min(req_rtime) as minn,max(req_rtime) as maxx FROM HPC2010 where wtime>=0 and req_rtime>=0 and date >= '" . $from . "' and date <= '" . $to . "'";
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $rtime_min = floor($row['minn']/3600);
        $rtime_max = ceil($row['maxx']/3600);
    }
    
    $sql = " SELECT min(req_proc) as minn,max(req_proc) as maxx FROM HPC2010 where wtime>=0 and req_proc>0 and date >= '" . $from . "' and date <= '" . $to . "'";
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $proc_min = (int)$row['minn'];
        $proc_max = (int)$row['maxx'];
    }
    $rtime_range = $rtime_max-$rtime_min;
    $rtime_buckets = [];
    if((($rtime_range*$boundary_percent)/$no_buckets)>1){
        // Greater than with last class ranging to 80%
        $end_range_value = $rtime_min + $rtime_range*$boundary_percent;
        $interval = floor(($rtime_range*$boundary_percent)/$no_buckets);
        $i = $interval;
        $prev = 0;
        while($i <= $end_range_value){
            array_push($rtime_buckets,[$prev,$i]);
            $prev = $i;
            $i += $interval;
        }
        array_push($rtime_buckets,[$prev,$rtime_max]);
    }
    else if(($rtime_range/$no_buckets)>1){
        // No greater than
        $interval = floor($rtime_range/$no_buckets);
        $i = $interval;
        $prev = 0;
        while($i <= $rtime_max){
            array_push($rtime_buckets,[$prev,$i]);
            $prev = $i;
            $i += $interval;
        }
    }
    else {
        // One value per bucket
        $interval = 1;
        $i = $interval;
        $prev = 0;
        while($i <= $rtime_max){
            array_push($rtime_buckets,[$prev,$i]);
            $prev = $i;
            $i += $interval;
        }
    }
    // $rtime_buckets = [[0,1],[1,2],[2,4],[4,7],[7,10],[10,13],[13,15],[15,17],[17,20],[20,24],[24,27],[27,30],[30,33],[33,36],[36,40],[40,44],[44,50],[50,57],[57,65],[65,80],[80,90],[90,100],[100,117],[117,121],[121,152],[152,1000]];
    $proc_buckets = [[0,1],[2,4],[4,8],[8,16],[16,32],[32,64],[64,128],[128,256],[256,512],[512,1024],[1024,2048]];
    $sql = " SELECT avg(wtime) as wtime,count(*) as jobs, CASE ";
    for ($i = 0; $i < count($rtime_buckets); $i++) {
        for ($j = 0; $j < count($proc_buckets); $j++) {
            $temp_str = "WHEN req_rtime>=".($rtime_buckets[$i][0]*3600)." and req_rtime<".($rtime_buckets[$i][1]*3600)." and req_proc>="
            .$proc_buckets[$j][0]." and req_proc<".$proc_buckets[$j][1]." THEN '".$rtime_buckets[$i][0].";".$rtime_buckets[$i][1].";".$proc_buckets[$j][0].";".$proc_buckets[$j][1]."'\n";
            $sql .= $temp_str;
        }
    }
    $sql .= "END AS groups FROM HPC2010 where wtime>=0 and date >= '" . $from . "' and date <= '" . $to . "' group by groups order by groups;"; 
    // echo $sql;
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        if($row['groups']!='NULL') {
            // echo $row['groups'];
            // echo "|";
            // echo $row['wtime'];
            // echo "|";
            // echo $row['jobs'];
            // echo "##";
            $grouparr = explode(";", $row['groups']);
            if(sizeof($grouparr)==4) {
                $index_merge['rtime'] = [(int)$grouparr[0],(int)$grouparr[1]];
                $index_merge['proc'] = [(int)$grouparr[2],(int)$grouparr[3]];

                $json_array[json_encode($index_merge)] = [$row['wtime'],$row['jobs']]; 
            }
            
        }
    }
    // print_r($json_array);
    return $json_array;
}

function get_data_job_status_per_queue($table,$from,$to,$conn)
{
    $sql = "select queue,count(*) as c from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and status='Completed' and queue not like 'R%' and queue not like 'work%' group by queue";
    $sql2 = "select queue,count(*) as c from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and status='cancelled' and queue not like 'R%' and queue not like 'work%' group by queue";
    $sql3 = "select queue,count(*) as c from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and status='Failed' and queue not like 'R%' and queue not like 'work%' group by queue";
    $q = "select distinct(queue) as queue from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and queue not like 'R%' and queue not like 'work%' group by queue";
    
    // forming queues
    $result = $conn->query($q);
    while ($row = $result->fetch_assoc()) {
        $json_array[$row['queue']] = [0,0,0];
    }
    
    // Completed
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $json_array[$row['queue']][0] = (int)($row['c']);
    }
    // Cancelled
    $result = $conn->query($sql2);
    while ($row = $result->fetch_assoc()) {
        $json_array[$row['queue']][1] = (int)($row['c']);
    }
    // Failed
    $result = $conn->query($sql3);
    while ($row = $result->fetch_assoc()) {
        $json_array[$row['queue']][2] = (int)($row['c']);
    }
    return $json_array;
}

function get_data_busy_cpus_per_day($table,$from,$to,$conn)
{
    // CPU load per day
    $sql = "select jobid,start,end,proc_alloc as proc from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and status='completed'";
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
        $json_array[$start] = $json_array[$start] + $row['proc'];
        $end2 = date ("Y-m-d", strtotime("+1 days", strtotime($end)));
        if(strtotime($end2) <= strtotime($to))
            $json_array[$end2] = $json_array[$end2] - $row['proc'];
    }
    $keys = array_keys($json_array);
    usort($keys, date_sort);
    for($i = 1; $i<sizeof($keys);++$i)
    {
        $json_array[$keys[$i]] += $json_array[$keys[$i-1]];
        if(strtotime($to)<strtotime($keys[$i]) || strtotime($from2)>strtotime($keys[$i]))
            unset($json_array[$keys[$i]]);
    }
    return $json_array;
}

function get_data_wtime_per_month($table,$from,$to,$conn)
{
    // Jobs per month
    $sql = "select concat(year(date),'-',month(date)) as d, wtime from ".$table." where date >= '" . $from . "' and date <= '" . $to . "' and wtime>=0 order by d";
    
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $json_array[$row['d']] = [];
    }
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        array_push($json_array[$row['d']], $row['wtime']);
    }
    $keys = array_keys($json_array);
    usort($keys, date_sort);
    $json_array_2 = array();
    for ($x = 0; $x < sizeof($json_array); $x++) {
        $json_array_2[$keys[$x]] = $json_array[$keys[$x]];
    }
    $json_array = $json_array_2;
    return $json_array;
}

switch ($chart) {
    case "1":
        $json_array = get_data_jobs_executing_per_day($table,$from,$to,$conn);
        break;
    case "2":
        $json_array = get_data_jobs_per_month($table,$from,$to,$conn);
        break;
    case "3":
        $json_array = get_data_count_per_status($table,$from,$to,$conn);
        break;
    case "4":
        $json_array = get_data_avg_wtime_per_Q($table,$from,$to,$conn);
        break;
    case "5":
        $json_array = get_data_extime_vs_jobs($table,$from,$to,$conn);
        break;
    case "6":
        $json_array = get_data_vartn_wtime_by_day($table,$from,$to,$conn);
        break;
    case "7":
    	$json_array = get_data_wtime_vs_jobs($table,$from,$to,$conn);
        break;
    case "8":
        $json_array = get_data_vartn_wtime_by_req2($table,$from,$to,$conn);
        break;
    case "9":
        $json_array = ['data1'=>[],'data2'=>[]];
        $json_array['data1'] = get_data_jobs_executing_per_day($table,$from,$to,$conn);
        $json_array['data2'] = get_data_jobs_per_month($table,$from,$to,$conn);
        break;
    case "10":
        $json_array = get_data_job_status_per_queue($table,$from,$to,$conn);
        break;
    case "11":
        $json_array = ['data1'=>[],'data2'=>[]];
        $json_array['data1'] = get_data_count_per_status($table,$from,$to,$conn);
        $json_array['data2'] = get_data_job_status_per_queue($table,$from,$to,$conn);
        break;
    case "12":
        $json_array = get_data_busy_cpus_per_day($table,$from,$to,$conn);
        break;
    case "13":
        $json_array = get_data_wtime_per_month($table,$from,$to,$conn);
        break;
    default:
        //echo "Your favorite color is neither red, blue, nor green!";
}

$conn->close();
// echo "Here1";
$returnData['data'] = $json_array;
$returnData['months'] = $monthDiff;
$returnData['years'] = $yearDiff;
$returnData['dates'] = $dateDiff;
$returnData['ID'] = $chart;
exit((json_encode($returnData)));
?>
