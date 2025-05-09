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
$id = $conn->real_escape_string($data->id); // Color ID
$name = $conn->real_escape_string($data->name);
$hex_value = $conn->real_escape_string($data->hex_value);

// Check if the new color name or hex value already exists (excluding the current color)
$query = "SELECT * FROM colors WHERE (name = '$name' OR hex_value = '$hex_value') AND id != '$id'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    // If color name or hex value already exists (excluding the current color), send an error response
    echo json_encode(["error" => "Color name or hex value must be unique."]);
} else {
    // Update the color in the database
    $update_query = "UPDATE colors SET name = '$name', hex_value = '$hex_value' WHERE id = '$id'";

    if ($conn->query($update_query) === TRUE) {
        echo json_encode(["message" => "Color updated successfully."]);
    } else {
        echo json_encode(["error" => "Error updating color: " . $conn->error]);
    }
}

$conn->close();
?>