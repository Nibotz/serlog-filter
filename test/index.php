<?php

include("db_connection.php");
$conn = openConn("test_database");

?>
<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
<a class="float-box" href="page2.htm">page 2</a>
<a class="float-box" href="filter_test.htm">filter</a>
<a class="float-box" href="index.php">refresh page</a>
<h1>Database practise</h1>

<form method="post" action="index.php">
    <textarea name="input" cols="30" rows="5"></textarea><br>
    <input type="radio" name="mode" value="Insert">Insert rows<br>
    <input type="radio" name="mode" value="Code">Input code<br>
    <input type="radio" name="mode" value="View">Show table<br>
    <input type="radio" name="mode" value="Clear">Clear table<br>
    <input type="submit" name="button" value="Run"><br>
</form>

<!-- Random practises -->
<?php
$table_name = "family";
$table_colls = array("id", "fname", "lname", "birth");
$insert_colls = array("fname", "lname", "birth");
$insert_types = "ssi";

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["mode"])) {
    // Insert rows
    if ($_POST["mode"] === "Insert" && $_POST["input"] !== "") {
        $l = count($insert_colls);
        $v = array_fill(0, $l, " ");
        $conn2 = $conn->prepare("INSERT INTO " . $table_name . " (" . join(",", $insert_colls) . ") VALUES (" . str_repeat("?,", $l - 1) . "?)");
        $conn2->bind_param($insert_types, ...$v);
        
        $ar = preg_split("/\s+/", trim($_POST["input"]));
        for ($i = 0; $i < count($ar); $i += $l) {
            for ($j=0; $j < $l; $j++) {
                $v[$j] = $ar[$i + $j];
            }
            $conn2->execute();
        }
        echo "Values inserted succesfully!";
        $conn2->close();
    } // Input code
    else if ($_POST["mode"] === "Code" && $_POST["input"] !== "") {
        $result = $conn->query($_POST["input"]);
        if (gettype($result) !== "boolean" && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo "<table><tr>";
            foreach ($table_colls as $coll) {
                if (isset($row[$coll])) {
                    echo "<th>" . $coll . "</th>";
                }
            }
            echo "</tr>";
            do {
                echo "<tr>";
                foreach ($table_colls as $coll) {
                    if (isset($row[$coll])) {
                        echo "<td>" . $row[$coll] . "</td>";
                    }
                }
                echo "</tr>";
            } while ($row = $result->fetch_assoc());
            echo "</table><br>";
        }
        $conn->query("ALTER TABLE " . $table_name . " AUTO_INCREMENT = 0;");
        echo "Code run succesfully!";
    } // Show table
    else if ($_POST["mode"] === "View") {
        $result = $conn->query("SELECT * FROM " . $table_name);
        if ($result->num_rows > 0) {
            echo "<table><tr>";
            foreach ($table_colls as $coll) {
                echo "<th>" . $coll . "</th>";
            }
            echo "</tr>";
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                foreach ($table_colls as $coll) {
                    echo "<td>" . $row[$coll] . "</td>";
                }
                echo "</tr>";
            }
            echo "</table><br>";
        } else {
            echo "Table is empty!";
        }
    } // Clear table
    else if ($_POST["mode"] === "Clear") {
        $conn->query("DELETE FROM " . $table_name . ";");
        $conn->query("ALTER TABLE " . $table_name . " AUTO_INCREMENT = 0;");
        echo "Table cleared succesfully!";
    }
}

?>

</body>
</html>