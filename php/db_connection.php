<?php

function openConn($database) {
    $host = "localhost";
    $user = "root";
    $password = "";

    $conn = new mysqli($host, $user, $password, $database);
    if ($conn->error) {
        echo "Connection failed: " . $conn->error;
    }

    return $conn;
}

?>