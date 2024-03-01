<?php
	$postBody = file_get_contents("php://input");
	$decodedJson=json_decode($postBody);
	$newPriceTax = $decodedJson->novoPrecoComIva;
	$newPriceNoTax = $decodedJson->novoPrecoSemIva;
	$itemCnp = $decodedJson->cnp;
	$newProfit = $decodedJson->margemNova;
	
	//debug
	//$itemCnp = "TESTE123";
	// New price value
	//$newPrice = 2.97; // Replace this with the actual new price
	
	//$newPriceTax = 9.99;
	//$newPriceNoTax = 5.99;
	//$itemCnp = "TESTE123";
	//$newProfit = 50;
	
	class mensagemRetorno
		{
			public $codigoEstado;
		}
		
	//Querys
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
	
	//inicia ligação a base de dados do sage
	$serverName = "LOJA"; // servidor remoto
	$connectionInfo = array( "Database"=>"db", "UID"=>"sa", "PWD"=>"sa","CharacterSet" => "UTF-8");
	$conn = sqlsrv_connect( $serverName, $connectionInfo);
		if( $conn === false ) {
		  die( print_r( sqlsrv_errors(), true));
			$estadoRetornado[0] = new mensagemRetorno();
		    $estadoRetornado[0]-> codigoEstado = 0;
		}
		else {
			//echo ("<h2>Ligado a base de dados com sucesso!</h2>");
		}
		
/*	
	//pesquisa debug
	// Realiza a consulta SQL
    $sql = "SELECT DtAlt, HrAlt FROM ItemSellingPrices WHERE ItemID = 'TESTE123'";
    $stmt = sqlsrv_query($conn, $sql, $params, $options);

    // Verifica se a consulta foi bem-sucedida
    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
    }

    // Exibe os resultados
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        echo "Data de Alteração: " . $row["DtAlt"]->format('d/m/Y') . "<br>";
        echo "Hora de Alteração: " . $row["HrAlt"] . "<br>";
    }
	
	*/
	

	// Atualiza o pvp com iva na bd
    $updateQuery = "UPDATE dbo.ItemSellingPrices SET TaxIncludedPrice = ? WHERE ItemID = ? AND PriceLineID = 1";
    $updateParams = array($newPriceTax, $itemCnp);

    $updateStatement = sqlsrv_query($conn, $updateQuery, $updateParams);

    if ($updateStatement === false) {
        die(print_r(sqlsrv_errors(), true));
			$estadoRetornado[0] = new mensagemRetorno();
		    $estadoRetornado[0]-> codigoEstado = 0;
    } else {
			$estadoRetornado[0] = new mensagemRetorno();
		    $estadoRetornado[0]-> codigoEstado = 1;
    }
	
	
	// Atualiza o pvp sem iva  na bd
	$updateQuery = "UPDATE dbo.ItemSellingPrices SET UnitPrice = ? WHERE ItemID = ?  AND PriceLineID = 1";
    $updateParams = array($newPriceNoTax, $itemCnp);

    $updateStatement = sqlsrv_query($conn, $updateQuery, $updateParams);

    if ($updateStatement === false) {
        die(print_r(sqlsrv_errors(), true));
			$estadoRetornado[1] = new mensagemRetorno();
		    $estadoRetornado[1]-> codigoEstado = 0;
    } else {
			$estadoRetornado[1] = new mensagemRetorno();
		    $estadoRetornado[1]-> codigoEstado = 1;
    }
	
	// Obtém a data de hoje
	$dataDeHoje = new DateTime();

	// Converte para o formato 'd/m/Y'
	$dataFormatada = $dataDeHoje->format('d/m/Y');
	
	// Obtém a hora atual
	$horaAtual = new DateTime();
	$horaFormatada = $horaAtual->format('H:i:s');

	// Divide a hora em horas, minutos e segundos
	list($horas, $minutos, $segundos) = explode(':', $horaFormatada);

	// Calcula o valor decimal da fração do dia
	$valorDecimal = ($horas + $minutos / 60 + $segundos / 3600) / 24;
	
	// Atualiza a data e hora de alteração 
	$updateQuery = "UPDATE dbo.Item SET DtAlt = ? , HrAlt = ? WHERE ItemID = ?";
    $updateParams = array($dataDeHoje, $valorDecimal ,$itemCnp);
	
    $updateStatement = sqlsrv_query($conn, $updateQuery, $updateParams);

    if ($updateStatement === false) {
        die(print_r(sqlsrv_errors(), true));
			$estadoRetornado[2] = new mensagemRetorno();
		    $estadoRetornado[2]-> codigoEstado = 0;
    } else {
			$estadoRetornado[2] = new mensagemRetorno();
		    $estadoRetornado[2]-> codigoEstado = 1;
    }
	
	//fechar conexão a base de dados
	sqlsrv_close($conn);
	
	header('Content-Type: application/json');
	$jsonReturn=json_encode($estadoRetornado);
	echo($jsonReturn);
	

/*	
// Obtém a hora atual
$horaAtual = new DateTime();
$horaFormatada = $horaAtual->format('H:i:s');

// Divide a hora em horas, minutos e segundos
list($horas, $minutos, $segundos) = explode(':', $horaFormatada);

// Calcula o valor decimal da fração do dia
$valorDecimal = ($horas + $minutos / 60 + $segundos / 3600) / 24;

// Exibe o resultado
echo "Hora atual formatada: $horaFormatada<br>";
echo "Valor Decimal: $valorDecimal";
*/

?>