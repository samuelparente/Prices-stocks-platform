<?php
// URL to fetch
$cnpPesquisa ="7754473"; // Replace this with your search query

// Initialize curl
$ch = curl_init();

// Set curl options
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
curl_setopt($ch, CURLOPT_URL, "https://www.kuantokusta.pt/search?q=" . $cnpPesquisa);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the curl request
$response = curl_exec($ch);

// Check for curl errors
if(curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch);
}

// Close curl
curl_close($ch);

// Output the response

echo($response);
?>
