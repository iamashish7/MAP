<?php
// header('Content-Type: application/json');
ini_set('display_errors',1);
ini_set('max_execution_time',300);
error_reporting(E_ALL);

    $success = 0;
    // print_r($_FILES);
    // echo 'sdfa '.$_FILES['fileToUpload']['name'].' '.$_POST['parser'];
    if (isset($_FILES['fileToUpload']['name'])) {
        if (0 < $_FILES['fileToUpload']['error']) {
			throw new Exception('Error during file upload ' . $_FILES['fileToUpload']['error']);
		} else {
			if (file_exists('uploads/' . $_FILES['fileToUpload']['name'])) {
                $filename = '/var/www/html/new/code/uploads/' . $_FILES['fileToUpload']['name'];
                if (unlink($filename)) {
                    if(move_uploaded_file($_FILES['fileToUpload']['tmp_name'], 'uploads/' . $_FILES['fileToUpload']['name']))
                    {
                        $success = 1;
                    }
                } 
                else {
                    // echo 'Cannot remove that file';
                }
                // echo ("File already exists");
				// throw new Exception('File already exists at uploads/' . $_FILES['fileToUpload']['name']);
			} else {
                if(move_uploaded_file($_FILES['fileToUpload']['tmp_name'], 'uploads/' . $_FILES['fileToUpload']['name']))
                {
                    $success = 1;
                }
			}
		}
	} else {
		throw new Exception('Please choose a file');
    }
    if($success)
    {
        if($_POST['parser']=='2')
        {
            $command = escapeshellcmd('python3 /var/www/html/new/code/parser/parser_pbs.py '.$_FILES['fileToUpload']['name']);
            $output = shell_exec($command);
            echo $output;
        }
        else
        {
            $command = escapeshellcmd('python3 /var/www/html/new/code/parser/parser_swf.py '.$_FILES['fileToUpload']['name']);
            $output = shell_exec($command);
            echo $output;
        }
    }
    else
    {
        throw new Exception('Cant upload file :: ERROR');
    }
?>