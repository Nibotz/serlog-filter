<?php
if (!isset($_POST["set_data"])) {
    exit("no.");
}
// connect to the database
include("db_connection.php");
$conn = openConn("serlog");

// values to insert into database
$VALS = ["title", "locality", "js_tree_cat", "location", "email_srv", "url", "description"];
// loop trough them
$keys = "(";
$values = "(";
foreach ($VALS as $val) {
    $keys .= "$val,";
    $values .= "'$_POST[$val]',";
}
$keys[-1] = ")";
$values[-1] = ")";

// sql command
$query = "INSERT INTO `services` $keys VALUES $values;";
$conn->query($query);

exit("success");
?>