<?php
    $fileName = '/var/www/cmsPane/stash/loc.data';
    file_put_contents($fileName, $_POST['data']);
    echo $_POST['data'];
?>
