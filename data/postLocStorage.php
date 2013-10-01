<?php
    $fileName = '/var/www/cmsPane/stash/loc.data';

    $res = file_put_contents($fileName, json_encode(json_decode($_POST['data']), JSON_PRETTY_PRINT));
    echo json_encode($res);
?>
