<?php
    if ($_SERVER['REQUEST_URI'] == '/') {
        $read = 'samples/index';
    } else {
        $read = 'samples' . $_SERVER['REQUEST_URI'];
    }
    readfile($read . '.html');
?>
