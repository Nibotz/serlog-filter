<?php
if (!isset($_POST["get_data"])) {
    exit("no data called");
}
// database connection
include("db_connection.php");
$conn = openConn("serlog");

// get the data for the tab from database
$query = "SELECT * FROM services WHERE id=" . $_POST["id"] . ";";

$tab_info = $conn->query($query);
$tab_info = $tab_info->fetch_assoc();

// return the data
exit(json_encode($tab_info));

?>