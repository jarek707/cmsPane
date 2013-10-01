<?php
    ini_set('display_errors', 1);
    $fileName = $_SERVER['DOCUMENT_ROOT']  . '/stash/loc.data';
    if (file_exists($fileName)) {
        echo file_get_contents($fileName);
    } else { 
        echo "File doesn't exist :" . $fileName;
    }
    flush();
?>
