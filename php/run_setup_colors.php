<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header("Content-Type: application/json");

// Connection info for your course account's database
$servername = "faure";           
$username = "eid";               
$password = "student id";  
$dbname = "eid";                

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Read the SQL file
$sql_file = "colors.sql";
$setup_sql = file_get_contents($sql_file);

if (!$setup_sql) {
    die(json_encode(["error" => "Could not read colors.sql file."]));
}

// Execute SQL
if ($conn->multi_query($setup_sql)) {
    echo json_encode(["message" => "Colors table setup completed."]);
} else {
    echo json_encode(["error" => "Error running setup: " . $conn->error]);
}

$conn->close();
?>