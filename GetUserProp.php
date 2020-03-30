<?php
header('Content-Type: application/json');
// ini_set('display_errors',1);
ini_set('max_execution_time',300);

// error_reporting(E_ALL);

$USER = $_POST['user'];

//Most frequent queue
$json_array = [];
$timebegin = round(microtime(true) * 1000000);    
//$sql = "select id, timestampdiff(hour,start,end) as extime from loganalysis_master where (exitstatus>=0 and exitstatus<128 or (exitstatus is null)) and status='E' and queue not like 'R%' and start>'1970-01-01 00:00:00' and date >= '" . $from . "' and date <= '" . $to . "' " ;
$sql = "select id, timestampdiff(hour,start,end) as extime from Master_E where id>=0 and (exit_status>=0 and exit_status<128 or (exit_status is null)) and queue not like 'R%' and start>'1970-01-01 00:00:00' and date >= '" . $from . "' and date <= '" . $to . "' " ;
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
unset($json_array['']);
        

?>