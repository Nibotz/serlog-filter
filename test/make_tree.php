<?php
// is data called?
if (!isset($_POST["get_data"])) {
    exit("Can't get the data that way!");
}
// connect database
include("db_connection.php");
$conn = openConn("serlog");

// get the data with sql
$query = "SELECT * FROM cats;";
// run the command
$table = $conn->query($query);

// data to the tree
$output = [];
while ($row = $table->fetch_assoc()) {
    $output[] = [
        "id" => $row["id"],
        "parent" => $row["parent_id"] == 0 ? "#" : $row["parent_id"],
        "text" => trim(str_replace("_", " ", $row["name"])),
        "icon" => false
    ];
}

exit(json_encode($output));

?>