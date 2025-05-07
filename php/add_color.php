<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header("Content-Type: application/json");

// Connection info
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

// Get input data
$data = json_decode(file_get_contents("php://input"));
$name = $conn->real_escape_string($data->name);
$hex_value = $conn->real_escape_string($data->hex_value);

// Check if the color name or hex already exists
$query = "SELECT * FROM colors WHERE name = '$name' OR hex_value = '$hex_value'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    // If color name or hex value already exists, send an error response
    echo json_encode(["error" => "Color name or hex value must be unique."]);
} else {
    // Insert the new color into the database
    $insert_query = "INSERT INTO colors (name, hex_value) VALUES ('$name', '$hex_value')";
    
    if ($conn->query($insert_query) === TRUE) {
        echo json_encode(["message" => "Color added successfully."]);
    } else {
        echo json_encode(["error" => "Error adding color: " . $conn->error]);
    }
}

$conn->close();
?>
