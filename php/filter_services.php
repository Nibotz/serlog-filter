<?php
// is data called?
if (!isset($_POST["get_data"])) {
    exit("No data for you.");
}
// connect to the database
include("db_connection.php");
$conn = openConn("serlog");

// creating sql command from data
$query = "SELECT s.id, s.title, s.created, s.edited, s.locality, s.description,
MIN(sc.child_price) AS minprice, MAX(sc.child_price) AS maxprice, c.id AS cat_id
FROM services AS s
LEFT JOIN services_childs AS sc ON s.id = sc.par_srv_id
LEFT JOIN cats AS c ON s.js_tree_cat = c.id
WHERE 1 ";

// local/online filter
if (isset($_POST["locality"]) && !empty($_POST["locality"])) {
    $query .= "AND(s.locality LIKE '%" . $_POST["locality"][0] . "%'";
    for ($i=1; $i < count($_POST["locality"]); $i++) {
        $query .= " AND s.locality LIKE '%" . $_POST["locality"][$i] . "%'";
    }
    $query .= ")";
}
// price filters using services_childs
if ($_POST["price1"] !== "" && ctype_digit($_POST["price1"])) {
    $query .= "AND(" . $_POST["price1"] . " <= (SELECT MAX(sc.child_price) FROM services_childs AS sc WHERE s.id = sc.par_srv_id))";
}
if ($_POST["price2"] !== "" && ctype_digit($_POST["price2"])) {
    $query .= "AND(" . $_POST["price2"] . " >= (SELECT MIN(sc.child_price) FROM services_childs AS sc WHERE s.id = sc.par_srv_id))";
}
// created date filters
if ($_POST["created1"] !== "" && $_POST["created1"][0] !== "0") {
    $query .= "AND('" . $_POST["created1"] . "' <= s.created)";
}
if ($_POST["created2"] !== "" && $_POST["created2"][0] !== "0") {
    $query .= "AND('" . $_POST["created2"] . "' >= s.created)";
}
// edited date filters
if ($_POST["edited1"] !== "" && $_POST["edited1"][0] !== "0") {
    $query .= "AND('" . $_POST["edited1"] . "' <= s.edited)";
}
if ($_POST["edited2"] !== "" && $_POST["edited2"][0] !== "0") {
    $query .= "AND('" . $_POST["edited2"] . "' >= s.edited)";
}
// sorting and limits
$query .= "GROUP BY s.id ORDER BY s.title LIMIT " . $_POST["load_limit"] . ";";

// run the command
$table = $conn->query($query);

if ($table->num_rows > 0) { // output
    $output = [];
    while ($row = $table->fetch_assoc()) {
        $output[] = $row;
    }
    exit(json_encode($output));
} else { // no output
    exit("[]");
}

?>