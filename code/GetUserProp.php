<?php
/*
abbr :
MFQ : Most frequent queue
AJSI : average job submission interval (means average time between two job submissions)
AWT : average wait time
AMU : average memory used
MUC : most used cluster
TJS : total jobs submitted
ANU : average nodes used per job
//CJNC : count of jobs per node count
FJ : Failed
CJ : completed jobs
*/

header('Content-Type: application/json');
ini_set('display_errors',1);
ini_set('max_execution_time',300);

error_reporting(E_ALL);

$servername = "localhost";
$username = "monalys";
$password = "monalys";
$dbname = "HPC_new2";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$USER = $_POST['user'];
$sql = "select count(*) as c from user_profile where uid='" . $USER . "'";
// $USER = 'user9';
$result = $conn->query($sql);
$json_array['error'] = 0;
while ($row = $result->fetch_assoc()) {
    if($row['c']=='0')
    {    $json_array['error'] = 1;
        $conn->close();
        $returnData['data'] = $json_array;
        exit((json_encode($returnData)));        
        break;
    }
}
//User data
$sql = "select MFQ,AJSI,AWT,AMU,MUC,TJS,ANU,FJ,CJ from user_profile where uid='". $USER ."'";
$result = $conn->query($sql);
while ($row = $result->fetch_assoc()) {
    $json_array['MFQ'] = $row['MFQ'];
    $json_array['AJSI'] = $row['AJSI'];
    $json_array['AWT'] = $row['AWT'];
    $json_array['AMU'] = $row['AMU'];
    $json_array['MUC'] = $row['MUC'];
    $json_array['TJS'] = $row['TJS'];
    $json_array['ANU'] = $row['ANU'];
    $json_array['FJ'] = $row['FJ'];
    $json_array['CJ'] = $row['CJ'];
}

$json_array_2 = array();
//Avg data (normalized)
$sql = "select avg(AJSI) as AJSI,min(AJSI) as minAJSI,max(AJSI) as maxAJSI, avg(AWT) as AWT,min(AWT) as minAWT,max(AWT) as maxAWT, avg(AMU) as AMU,min(AMU) as minAMU,max(AMU) as maxAMU, avg(TJS) as TJS,min(TJS) as minTJS,max(TJS) as maxTJS, avg(ANU) as ANU,min(ANU) as minANU,max(ANU) as maxANU, avg(FJ) as FJ,min(FJ) as minFJ,max(FJ) as maxFJ, avg(CJ) as CJ,min(CJ) as minCJ,max(CJ) as maxCJ from user_profile";
$result = $conn->query($sql);
while ($row = $result->fetch_assoc()) {
    $json_array_2['AJSI'] = round(($row['AJSI']-$row['minAJSI'])/($row['maxAJSI']-$row['minAJSI']),4);
    $json_array_2['AWT'] = round(($row['AWT']-$row['minAWT'])/($row['maxAWT']-$row['minAWT']),4);
    $json_array_2['AMU'] = round(($row['AMU']-$row['minAMU'])/($row['maxAMU']-$row['minAMU']),4);
    $json_array_2['TJS'] = round(($row['TJS']-$row['minTJS'])/($row['maxTJS']-$row['minTJS']),4);
    $json_array_2['ANU'] = round(($row['ANU']-$row['minANU'])/($row['maxANU']-$row['minANU']),4);
    $json_array_2['FJ'] = round(($row['FJ']-$row['minFJ'])/($row['maxFJ']-$row['minFJ']),4);
    $json_array_2['CJ'] = round(($row['CJ']-$row['minCJ'])/($row['maxCJ']-$row['minCJ']),4);
    // $json_array_2['AJSI'] = round(($row['AJSI'])/($row['maxAJSI']),4);
    // $json_array_2['AWT'] = round(($row['AWT'])/($row['maxAWT']),4);
    // $json_array_2['AMU'] = round(($row['AMU'])/($row['maxAMU']),4);
    // $json_array_2['TJS'] = round(($row['TJS'])/($row['maxTJS']),4);
    // $json_array_2['ANU'] = round(($row['ANU'])/($row['maxANU']),4);
    // $json_array_2['FJ'] = round(($row['FJ'])/($row['maxFJ']),4);
    // $json_array_2['CJ'] = round(($row['CJ'])/($row['maxCJ']),4);
}

//normalized data for user 
$json_array_3 = array();
$result = $conn->query($sql);
while ($row = $result->fetch_assoc()) {
    $json_array_3['AJSI'] = round(($json_array['AJSI']-$row['minAJSI'])/($row['maxAJSI']-$row['minAJSI']),4);
    $json_array_3['AWT'] = round(($json_array['AWT']-$row['minAWT'])/($row['maxAWT']-$row['minAWT']),4);
    $json_array_3['AMU'] = round(($json_array['AMU']-$row['minAMU'])/($row['maxAMU']-$row['minAMU']),4);
    $json_array_3['TJS'] = round(($json_array['TJS']-$row['minTJS'])/($row['maxTJS']-$row['minTJS']),4);
    $json_array_3['ANU'] = round(($json_array['ANU']-$row['minANU'])/($row['maxANU']-$row['minANU']),4);
    $json_array_3['FJ'] = round(($json_array['FJ']-$row['minFJ'])/($row['maxFJ']-$row['minFJ']),4);
    $json_array_3['CJ'] = round(($json_array['CJ']-$row['minCJ'])/($row['maxCJ']-$row['minCJ']),4);
    // $json_array_3['AJSI'] = round(($json_array['AJSI'])/($row['maxAJSI']),4);
    // $json_array_3['AWT'] = round(($json_array['AWT'])/($row['maxAWT']),4);
    // $json_array_3['AMU'] = round(($json_array['AMU'])/($row['maxAMU']),4);
    // $json_array_3['TJS'] = round(($json_array['TJS'])/($row['maxTJS']),4);
    // $json_array_3['ANU'] = round(($json_array['ANU'])/($row['maxANU']),4);
    // $json_array_3['FJ'] = round(($json_array['FJ'])/($row['maxFJ']),4);
    // $json_array_3['CJ'] = round(($json_array['CJ'])/($row['maxCJ']),4);
}


$conn->close();
$returnData['data'] = $json_array;
$returnData['data2'] = $json_array_2;
$returnData['data3'] = $json_array_3;
exit((json_encode($returnData)));
?>
