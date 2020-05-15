<?php
if (isset($_POST['Q']))
{   
    $command = escapeshellcmd('python3 -W ignore /var/www/html/new/code/calcWtime2.py '.$_POST['nodes'].' '.$_POST['walltime'].' '.$_POST['Q']);
    echo shell_exec($command);
}
else
{
    echo "Queue not set";
}
?>
