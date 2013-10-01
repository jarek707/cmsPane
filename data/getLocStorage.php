<?php
    ini_set('display_errors', 1);
    $fileName = $_SERVER['DOCUMENT_ROOT']  . '/stash/loc.data';
    if (file_exists($fileName)) {
        echo file_get_contents($fileName);
    } else { 
        echo "File doesn't exist :" . $fileName;
        if ( file_exists($_SERVER['DOCUMENT_ROOT'] ) {
            echo ' server not exist';
            var_dump( scandir($_SERVER['DOCUMENT_ROOT']  ));
        } else {
            echo ' server path is good ';
            var_dump( scandir($_SERVER['DOCUMENT_ROOT']  ));
        }
    }
    flush();
?>
