<?php
    readfile('index.html');
    if (file_exists('index.html')) {
        echo ' exist' ;
    } else {
        echo ' not exist';
    }
    echo '<pre>';
    var_dump($_SERVER);
?>
