<?php
if (!isset($_POST["get_data"])) {
    exit("no data called");
}
// database connection
include("db_connection.php");
$conn = openConn("serlog");

// get the data for the tab from database
$query = "SELECT * FROM services WHERE id IN (" . $_POST["ids"] . ");";

$tab_info = $conn->query($query);

// loop trough the data
$output = [];
while ($row = $tab_info->fetch_assoc()) {
    $output[] = $row;
}

// return the data
exit(json_encode($output));

?>