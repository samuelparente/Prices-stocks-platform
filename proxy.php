<?php
// Get the URL to fetch from the query string (assuming you pass it as 'url' parameter)
$url = $_GET['url'];

// Make the request to the target URL
$response = file_get_contents($url);

// Set the necessary CORS headers
header('Access-Control-Allow-Origin: *'); // Change * to the specific origin if required
header('Content-Type: application/json');
// Output the response from the target URL
echo $response;
?>
