<?php

$serverName = "HP-LOJA";
$connectionInfo = array(
    "Database" => "db",
    "UID" => "sa",
    "PWD" => "Sa",
    "CharacterSet" => "UTF-8"
);

$conn = sqlsrv_connect($serverName, $connectionInfo);

if ($conn === false) {
    die(print_r(sqlsrv_errors(), true));
}

$tableName = 'dbo.ItemSellingPrices';

// Consulta para obter os nomes das colunas
$columnQuery = "SELECT * FROM  $tableName WHERE ItemID = ? AND PriceLineID = ?";

$params = array("6576322","1");
$options = array("Scrollable" => SQLSRV_CURSOR_KEYSET);

$columnStatement = sqlsrv_prepare($conn, $columnQuery, $params);

if ($columnStatement === false) {
    die(print_r(sqlsrv_errors(), true));
}

// Executar a consulta preparada
if (sqlsrv_execute($columnStatement) === false) {
    die(print_r(sqlsrv_errors(), true));
}

// Obter os dados da consulta
$columnData = array();

while ($row = sqlsrv_fetch_array($columnStatement, SQLSRV_FETCH_ASSOC)) {
    $columnData[] = $row;
}



// Retornar os dados como JSON
header('Content-Type: application/json');
echo json_encode($columnData);

// Fechar conexão
sqlsrv_close($conn);
?>
