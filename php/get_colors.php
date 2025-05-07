<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header("Content-Type: application/json");

// Database credentials 
$servername = "faure";
$username = "your_eid";         // Replace with your CSU eID
$password = "your_student_id";  // Replace with your student ID
$dbname = "your_eid";           // Replace with your CSU eID

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Query the colors table
$sql = "SELECT id, name, hex_value FROM colors ORDER BY id ASC";
$result = $conn->query($sql);

$colors = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $colors[] = $row;
    }
}

// Return colors as JSON
echo json_encode($colors);

// Close connection
$conn->close();
?>
