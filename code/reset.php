<?php
header('Content-Type: application/json');
if (!unlink($_POST['file'])) {  
    echo ("$_POST['file'] cannot be deleted due to an error");  
}  
else {  
    echo ("$_POST['file'] has been deleted");  
}  
?>