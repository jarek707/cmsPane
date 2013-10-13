<?php
    if (file_exists('index.html')) {
        echo ' exist' ;
    } else {
        echo ' not exist';
    }

    ob_clean();
    flush();
    readfile('index.html');

    echo '<pre>';
    var_dump($_SERVER);
?>
