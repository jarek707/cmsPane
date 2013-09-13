<?php
    ini_set('display_errors', 1);
    $fileName = '/var/www/cmsPane/stash/loc.data';
    if (file_exists($fileName)) {
        echo file_get_contents($fileName);
    } else { 
        echo "File doesn't exist";
    }
    flush();
?>
