<?php
session_start();


	$postBody = file_get_contents("php://input");
	$decodedJson=json_decode($postBody,true);
	$_SESSION['lista'] = $decodedJson;
/*
$url = "http://localhost/lists/printExcel.php";

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$headers = array(
   "Accept: application/json",
   "Content-Type: application/json",
);

curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$data = json_encode($decodedJson);

curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

$resp = curl_exec($curl);
curl_close($curl);
*/

header('Content-Type: application/json');
		$retornaEstado = ["estado do pedido"=>"ok"];
	 //$jsonReturn=json_encode($qtdeItems);
	 $jsonReturn=json_encode($retornaEstado);
	echo($jsonReturn);

?>