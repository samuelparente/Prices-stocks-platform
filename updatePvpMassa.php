<?php
	//$postBody = file_get_contents("php://input");
	//$decodedJson=json_decode($postBody);
	
	$dadosRecebidos = json_decode(file_get_contents('php://input'), true);
	$dadosArray = $dadosRecebidos['dadosJson'];
	
	/*
	$newPriceTax = $decodedJson->novoPrecoComIva;
	$newPriceNoTax = $decodedJson->novoPrecoSemIva;
	$itemCnp = $decodedJson->cnp;
	$newProfit = $decodedJson->margemNova;
	*/
	
	//debug
	//$itemCnp = "TESTE123";
	// New price value
	//$newPrice = 2.97;
	
	class mensagemRetorno
		{
			public $estadoAtualizacao;
		}
		
		
	//Querys
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
	
	//inicia ligação a base de dados do sage
	$serverName = "LOJA"; // servidor remoto
	$connectionInfo = array( "Database"=>"bd", "UID"=>"sa", "PWD"=>"Sa","CharacterSet" => "UTF-8");
	$conn = sqlsrv_connect( $serverName, $connectionInfo);
		if( $conn === false ) {
		  die( print_r( sqlsrv_errors(), true));
			$estadoRetornado[0] = new mensagemRetorno();
		    $estadoRetornado[0]-> codigoEstado = 0;
		}
		else {
			//echo ("<h2>Ligado a base de dados com sucesso!</h2>");
		}
		
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//atualiza os produtos que vieram por json
	$contador = 0;
	
	foreach ($dadosArray as &$produto) {
    
		$newPriceTax = $produto['novoPrecoComIva'];
		$newPriceNoTax = $produto['novoPrecoSemIva'];
	     $itemCnp = $produto['cnp'];
		 
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

	   
    }
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//fechar conexão a base de dados
	sqlsrv_close($conn);
	
	header('Content-Type: application/json');
	$jsonReturn=json_encode($estadoRetornado);
	echo($jsonReturn);
	
?>