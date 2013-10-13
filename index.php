<?php
    if (file_exists('index.html')) {
        echo ' exist' ;
    } else {
        echo ' not exist';
    }

    echo file_get_contents('index.html');

    echo '<pre>';
    var_dump($_SERVER);
?>
