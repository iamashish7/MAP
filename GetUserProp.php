<?php
header('Content-Type: application/json');
ini_set('display_errors',1);
ini_set('max_execution_time',300);

error_reporting(E_ALL);

$servername = "localhost";
$username = "ashish";
$password = "ashish007";
$dbname = "HPC_new2";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$USER = $_POST['user'];
$USER = 'user9';

//Most used queue
$json_array = [];
$sql = "select C.queue as Q ,C.c from (select max(c) as m from(select queue,count(*) as c from Master_E where id>=0 and (exit_status>=0 and exit_status<128 or (exit_status is null)) and queue not like 'R%' and start>'1970-01-01 00:00:00' and user = 'user9' and queue <> 'workq' group by queue) A) B, (select queue,count(*) as c from Master_E where id>=0 and (exit_status>=0 and exit_status<128 or (exit_status is null)) and queue not like 'R%' and start>'1970-01-01 00:00:00' and user = '" . $USER . "' and queue <> 'workq' group by queue) C where C.c = B.m;";
$result = $conn->query($sql);
$json_array['most_used_Q'] = '';
while ($row = $result->fetch_assoc()) {
    $json_array['most_used_Q'] = $json_array['most_used_Q'] . $row['Q'];
}
// unset($json_array['']);
// Avg wtime
$sql = "select avg(wtime) as wtime from (select timestampdiff(second,ctime,start) as wtime from Master_E where id>=0 and (exit_status>=0 and exit_status<128 or (exit_status is null)) and queue not like 'R%' and start>'1970-01-01 00:00:00' and user = '" . $USER . "' ) A ";
$result = $conn->query($sql);
$json_array['avg_wtime'] = '';
while ($row = $result->fetch_assoc()) {
    $json_array['avg_wtime'] = $json_array['avg_wtime'] . $row['wtime'];
}

// select C.queue,C.c from (select max(c) as m from(select queue,count(*) as c from Master_E where id>=0 and (exit_status>=0 and exit_status<128 or (exit_status is null)) and queue not like 'R%' and start>'1970-01-01 00:00:00' and user = 'user9' and queue <> 'workq' group by queue) A) B, (select queue,count(*) as c from Master_E where id>=0 and (exit_status>=0 and exit_status<128 or (exit_status is null)) and queue not like 'R%' and start>'1970-01-01 00:00:00' and user = 'user9' and queue <> 'workq' group by queue) C where C.c = B.m;
$conn->close();
$returnData['data'] = $json_array;
exit((json_encode($returnData)));
?>