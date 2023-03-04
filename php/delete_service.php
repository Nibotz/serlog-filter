<?php
if (!isset($_POST["set_data"])) {
    exit("nope.");
}
// connect to the database
include("db_connection.php");
$conn = openConn("serlog");

// delete main service
$query = "DELETE FROM `services` WHERE id=" . $_POST["id"] . ";";
$conn->query($query);
// delete subservices
$query = "DELETE FROM `services_childs` WHERE par_srv_id=" . $_POST["id"]. ";";
$conn->query($query);

exit("success");
?>