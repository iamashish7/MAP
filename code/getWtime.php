<?php
if (isset($_POST['Q']))
{   
    $command = escapeshellcmd('python /var/www/html/calcWtime.py '.$_POST['nodes'].' '.$_POST['walltime'].' '.$_POST['Q'].' 2> error.txt');
    echo 'HPC 2010 : '.shell_exec($command).' seconds';
}
else
{
    echo "Queue not set";
}
?>