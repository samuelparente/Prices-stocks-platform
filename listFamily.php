<?php
	$postBody = file_get_contents("php://input");
	$decodedJson=json_decode($postBody);
	$idFamilia = $decodedJson->familia;
	$filtro_stock = $decodedJson->stock; 	
	$filtro_venda = $decodedJson->venda; 	

	//inicia ligação a base de dados do sage
	$serverName = "HP-LOJA"; // servidor remoto
	$connectionInfo = array( "Database"=>"bd", "UID"=>"sa", "PWD"=>"Sa","CharacterSet" => "UTF-8");
	$conn = sqlsrv_connect( $serverName, $connectionInfo);
		if( $conn === false ) {
		  die( print_r( sqlsrv_errors(), true));
			echo ("Erro a ligar a base de dados");
		}
		else {
			//echo ("<h2>Ligado a base de dados com sucesso!</h2>");
		}
		
	//string de consulta baseada nos filtros
	$string_pedido_bd = "";

	//Querys
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );

	//todas as familias
	if($idFamilia == 9999){
		//sem stock
		if($filtro_stock == 0){
		
			//sem vendas
			if($filtro_venda ==0){
				
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.ItemID = h.ItemID AND i.LastOutgoingDate IS NULL AND h.WarehouseID = 1 AND h.AvailableQty = 0";
					$string_pedido_bd = "SELECT
					i.ItemID,
					i.ItemKey,
					i.LastOutgoingDate,
					i.FamilyID,
					MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
					MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
				FROM dbo.Item i
				LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
				GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID
				HAVING COALESCE(MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END), 0) = 0
				   AND COALESCE(MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END), 0) = 0
				   AND MAX(i.LastOutgoingDate) IS NULL";

			}
			//com vendas
			else if($filtro_venda ==1){
				
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.ItemID = h.ItemID AND i.LastOutgoingDate IS NOT NULL AND h.WarehouseID = 1 AND h.AvailableQty = 0";
				$string_pedido_bd = "SELECT
				i.ItemID,
				i.ItemKey,
				i.LastOutgoingDate,
				i.FamilyID,
				MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
				MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
			FROM dbo.Item i
			LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
			GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID
			HAVING COALESCE(MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END), 0) = 0
			   AND COALESCE(MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END), 0) = 0
			   AND MAX(i.LastOutgoingDate) IS NOT NULL";

			}
			//tudo
			else if($filtro_venda ==2){
				
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.ItemID = h.ItemID AND h.WarehouseID = 1 AND h.AvailableQty = 0";
				
				$string_pedido_bd = "SELECT
					i.ItemID,
					i.ItemKey,
					i.LastOutgoingDate,
					i.FamilyID,
					MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
					MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
				FROM dbo.Item i
				LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
				GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID
				HAVING COALESCE(MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END), 0) = 0
				   AND COALESCE(MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END), 0) = 0";

			
			}
			//outra situação
			else{
			
				$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate FROM dbo.Item";
			}
		}
		//com stock
		else if($filtro_stock == 1){
			
			//sem vendas
			if($filtro_venda ==0){
				
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE  i.ItemID = h.ItemID AND i.LastOutgoingDate IS NULL AND h.WarehouseID = 1 AND h.AvailableQty != 0 ORDER BY h.AvailableQty DESC";
				$string_pedido_bd = "SELECT
					i.ItemID,
					i.ItemKey,
					i.LastOutgoingDate,
					i.FamilyID,
					MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
					MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
				FROM dbo.Item i
				LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
				GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID
				HAVING COALESCE(MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END), 0) > 0
				   OR COALESCE(MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END), 0) > 0
				   AND MAX(i.LastOutgoingDate) IS NULL";

			
			}
			//com vendas
			else if($filtro_venda ==1){
			
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.ItemID = h.ItemID AND i.LastOutgoingDate IS NOT NULL AND h.WarehouseID = 1 AND h.AvailableQty != 0";
			
				$string_pedido_bd = "SELECT
					i.ItemID,
					i.ItemKey,
					i.LastOutgoingDate,
					i.FamilyID,
					MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
					MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
				FROM dbo.Item i
				LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
				GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID
				HAVING COALESCE(MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END), 0) > 0
				   OR COALESCE(MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END), 0) > 0
				   AND MAX(i.LastOutgoingDate) IS NOT NULL";

			}
			//tudo
			else if($filtro_venda ==2){
				
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.ItemID = h.ItemID AND h.WarehouseID = 1 AND h.AvailableQty != 0";
					$string_pedido_bd = "SELECT
					i.ItemID,
					i.ItemKey,
					i.LastOutgoingDate,
					i.FamilyID,
					MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
					MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
				FROM dbo.Item i
				LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
				GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID
				HAVING COALESCE(MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END), 0) > 0
				   OR COALESCE(MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END), 0) > 0";

			
			}
			//outra situação
			else{
				
				$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate FROM dbo.Item";
			}
		}
		//com e sem stock
		else if($filtro_stock == 2){
			
			//sem vendas
			if($filtro_venda ==0){
				
				//$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate, FamilyID FROM dbo.Item WHERE LastOutgoingDate IS NULL";
			
			$string_pedido_bd = "SELECT
				i.ItemID,
				i.ItemKey,
				i.LastOutgoingDate,
				i.FamilyID,
				MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
				MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
			FROM dbo.Item i
			LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
			GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID";

			}
			//com vendas
			else if($filtro_venda ==1){
			
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.ItemID = h.ItemID AND i.LastOutgoingDate IS NOT NULL AND h.WarehouseID = 1";
			
				$string_pedido_bd = "SELECT
					i.ItemID,
					i.ItemKey,
					i.LastOutgoingDate,
					i.FamilyID,
					MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
					MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
				FROM dbo.Item i
				LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
				GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID";

			}
			//tudo
			else if($filtro_venda ==2){
				
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.ItemID = h.ItemID AND i.LastOutgoingDate IS NOT NULL AND h.WarehouseID = 1";
				//$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate FROM dbo.Item";
				$string_pedido_bd = "SELECT
					i.ItemID,
					i.ItemKey,
					i.LastOutgoingDate,
					i.FamilyID,
					MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
					MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
				FROM dbo.Item i
				LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
				GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID";

				
			
			}
			//outra situação
			else{
				
				$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate FROM dbo.Item";
			}
		
		}
		//outra situação
		else{
			$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate FROM dbo.Item";
		}
		
		$consultaItensDaFamilia = sqlsrv_query( $conn, $string_pedido_bd ,$params,$options);
		$qtdeProdutos = sqlsrv_num_rows($consultaItensDaFamilia);
	}
	//familia específica
	else{
		
		//sem stock
		if($filtro_stock == 0){
		
			//sem vendas
			if($filtro_venda ==0){
				
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.FamilyID = $idFamilia AND i.ItemID = h.ItemID AND i.LastOutgoingDate IS NULL AND ((h.WarehouseID = 1 AND h.AvailableQty = 0) AND (h.WarehouseID = 2 AND h.AvailableQty = 0))";
				$string_pedido_bd = "SELECT
									i.ItemID,
									i.ItemKey,
									i.LastOutgoingDate,
									i.FamilyID,
									MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
									MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
								FROM dbo.Item i
								LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
								WHERE i.FamilyID = $idFamilia
								 AND i.LastOutgoingDate IS NULL
								  AND (h.WarehouseID = 1 OR h.WarehouseID = 2)
								  AND h.AvailableQty = 0
								GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID";
			}
			//com vendas
			else if($filtro_venda ==1){
				
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.FamilyID = $idFamilia AND i.ItemID = h.ItemID AND i.LastOutgoingDate IS NOT NULL AND ((h.WarehouseID = 1 AND h.AvailableQty = 0) AND (h.WarehouseID = 2 AND h.AvailableQty = 0))";
					$string_pedido_bd = "SELECT
							i.ItemID,
							i.ItemKey,
							i.LastOutgoingDate,
							i.FamilyID,
							MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
							MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
						FROM dbo.Item i
						LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
						WHERE i.FamilyID = $idFamilia
						  AND i.LastOutgoingDate IS NOT NULL
						  AND (h.WarehouseID = 1 OR h.WarehouseID = 2)
						GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID
						HAVING MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) = 0
						   AND MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) = 0";

			}
			//tudo
			else if($filtro_venda ==2){
				
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.FamilyID = $idFamilia AND i.ItemID = h.ItemID AND ((h.WarehouseID = 1 AND h.AvailableQty = 0) AND (h.WarehouseID = 2 AND h.AvailableQty = 0))";
			
					$string_pedido_bd = "SELECT
							i.ItemID,
							i.ItemKey,
							i.LastOutgoingDate,
							i.FamilyID,
							MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
							MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
						FROM dbo.Item i
						LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
						WHERE i.FamilyID = $idFamilia
						  AND ((i.LastOutgoingDate IS NULL OR i.LastOutgoingDate IS NOT NULL)
						  AND (h.WarehouseID = 1 OR h.WarehouseID = 2))
						GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID
						HAVING (MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) = 0
							 AND MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) = 0)";

			
			}
			//outra situação
			else{
			
				$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate FROM dbo.Item WHERE FamilyID = $idFamilia";
			}
		}
		//com stock
		else if($filtro_stock == 1){
			
			//sem vendas
			if($filtro_venda ==0){
				
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.FamilyID = $idFamilia AND i.ItemID = h.ItemID AND i.LastOutgoingDate IS NULL AND ((h.WarehouseID = 1 AND h.AvailableQty != 0) OR (h.WarehouseID = 2 AND h.AvailableQty != 0))";
				$string_pedido_bd = "SELECT
									i.ItemID,
									i.ItemKey,
									i.LastOutgoingDate,
									i.FamilyID,
									MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
									MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
								FROM dbo.Item i
								LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
								WHERE i.FamilyID = $idFamilia
								 AND i.LastOutgoingDate IS NULL
								  AND (h.WarehouseID = 1 OR h.WarehouseID = 2)
								  AND h.AvailableQty != 0
								GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID";
			
			}
			//com vendas
			else if($filtro_venda ==1){
			
				//$string_pedido_bd = "SELECT  i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.FamilyID = $idFamilia AND i.ItemID = h.ItemID AND i.LastOutgoingDate IS NOT NULL AND h.WarehouseID IN (1,2) AND h.AvailableQty != 0";
				$string_pedido_bd = "SELECT
									i.ItemID,
									i.ItemKey,
									i.LastOutgoingDate,
									i.FamilyID,
									MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
									MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
								FROM dbo.Item i
								LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
								WHERE i.FamilyID = $idFamilia
								 AND i.LastOutgoingDate IS NOT NULL
								  AND (h.WarehouseID = 1 OR h.WarehouseID = 2)
								  AND h.AvailableQty != 0
								GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID";
			
			}
			//tudo
			else if($filtro_venda ==2){
				
				//$string_pedido_bd = "SELECT DISTINCT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.FamilyID = $idFamilia AND i.ItemID = h.ItemID AND h.WarehouseID IN (1,2) AND h.AvailableQty != 0";
			
			$string_pedido_bd = "SELECT
									i.ItemID,
									i.ItemKey,
									i.LastOutgoingDate,
									i.FamilyID,
									MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
									MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
								FROM dbo.Item i
								LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
								WHERE i.FamilyID = $idFamilia
								  AND (h.WarehouseID = 1 OR h.WarehouseID = 2)
								  AND h.AvailableQty != 0
								GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID";

										
			}
			//outra situação
			else{
				
				$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate FROM dbo.Item WHERE FamilyID = $idFamilia";
			}
		}
		//com stock (com e sem vendas)
		else if($filtro_stock == 2){
			
			//sem vendas
			if($filtro_venda ==0){
				
				//$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate, FamilyID FROM dbo.Item  WHERE FamilyID = $idFamilia AND LastOutgoingDate IS NULL";
			
					$string_pedido_bd = "SELECT
						i.ItemID,
						i.ItemKey,
						i.LastOutgoingDate,
						i.FamilyID,
						MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
						MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
					FROM dbo.Item i
					LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
					WHERE i.FamilyID = $idFamilia
					  AND i.LastOutgoingDate IS NULL
					GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID";


			}
			//com vendas
			else if($filtro_venda ==1){
			
				//$string_pedido_bd = "SELECT i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID, h.AvailableQty, h.WarehouseID, h.ItemID FROM dbo.Item i, dbo.Stock h WHERE i.FamilyID = $idFamilia AND i.ItemID = h.ItemID AND i.LastOutgoingDate IS NOT NULL AND (h.WarehouseID = 1 AND h.WarehouseID = 2)";
			$string_pedido_bd = "SELECT
				i.ItemID,
				i.ItemKey,
				i.LastOutgoingDate,
				i.FamilyID,
				MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
				MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
			FROM dbo.Item i
			LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
			WHERE i.FamilyID = $idFamilia
			  AND i.LastOutgoingDate IS NOT NULL
			GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID";

			}
			//tudo
			else if($filtro_venda ==2){
				
				//$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate FROM dbo.Item WHERE FamilyID = $idFamilia";
					$string_pedido_bd = "SELECT
					i.ItemID,
					i.ItemKey,
					i.LastOutgoingDate,
					i.FamilyID,
					MAX(CASE WHEN h.WarehouseID = 1 THEN h.AvailableQty END) AS Warehouse1Qty,
					MAX(CASE WHEN h.WarehouseID = 2 THEN h.AvailableQty END) AS Warehouse2Qty
				FROM dbo.Item i
				LEFT JOIN dbo.Stock h ON i.ItemID = h.ItemID
				WHERE i.FamilyID = $idFamilia
				GROUP BY i.ItemID, i.ItemKey, i.LastOutgoingDate, i.FamilyID";

			
			}
			//outra situação
			else{
				
				$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate FROM dbo.Item WHERE FamilyID = $idFamilia";
			}
		
		}
		//outra situação
		else{
			$string_pedido_bd = "SELECT ItemID, ItemKey, LastOutgoingDate FROM dbo.Item WHERE FamilyID = $idFamilia";
		}
		
		$consultaItensDaFamilia = sqlsrv_query( $conn, $string_pedido_bd ,$params,$options);
		$qtdeProdutos = sqlsrv_num_rows($consultaItensDaFamilia);	
	}
	
	class artigoSage
		{
			public $nomeSage;
			public $cnpSage;
			public $pcuSage;
			public $pvpSage;
			public $lastDateSage;
			public $validade1;
			public $validade2;
			public $validade3;
			public $skuXML;
			public $pvpReal;
			public $erro;
			public $taxaIvaSage;
		}

class produtoFeedXML
		{
			public $cnpXML="0";
			public $precoXML="0.0 EUR";
		}

$listagemProdutosXML = array();
$var1=0;

	$file = 'https://www.zonpharma.com/extend/catalog_20.xml';
    $xml = simplexml_load_file($file);
	
foreach($xml->children() as $produtosPvp){
	
	$listagemProdutosXML[$var1] = new produtoFeedXML();
	$listagemProdutosXML[$var1]-> cnpXML = $produtosPvp->id_product;
	$listagemProdutosXML[$var1]-> precoXML = $produtosPvp->sale_price;
	$var1++;
	
}

	$listagemArtigos = array();
	
	for ($temp = 0; $temp<$qtdeProdutos;$temp++) {

		//cnp do produto
		$itemCnp = sqlsrv_fetch_array($consultaItensDaFamilia);
		$itemCnpFetch = $itemCnp["ItemID"];
		
		//ultima venda
		$itemLastSell = $itemCnp["LastOutgoingDate"];
	
		//preço de custo sem iva do produto
		$consultaCnpPcu = sqlsrv_query($conn, "SELECT * FROM dbo.ItemSellingPrices WHERE ItemID = '$itemCnpFetch' AND PriceLineID = 0",$params,$options);
		$pcuRetornado = sqlsrv_fetch_array($consultaCnpPcu);
		
		//preço pvp sem iva do produto
		$consultaCnpPvp = sqlsrv_query($conn, "SELECT * FROM dbo.ItemSellingPrices WHERE ItemID = '$itemCnpFetch' AND PriceLineID = 1",$params,$options);
		$pvpRetornado = sqlsrv_fetch_array($consultaCnpPvp);
		
		//nome do produto
		$consultaNome = sqlsrv_query( $conn, "SELECT Description  FROM dbo.ItemNames WHERE ItemID='$itemCnpFetch'",$params,$options);
		$nomeProduto = sqlsrv_fetch_array($consultaNome);
		
		//stock disponível em loja
		$consultaStock = sqlsrv_query( $conn, "SELECT AvailableQty  FROM dbo.Stock WHERE ItemID = '$itemCnpFetch' AND WarehouseID = 1",$params,$options);
		$stockLoja = sqlsrv_fetch_array($consultaStock);
		
		//stock disponível em farmácia
		$consultaStock = sqlsrv_query( $conn, "SELECT AvailableQty  FROM dbo.Stock WHERE ItemID = '$itemCnpFetch' AND WarehouseID = 2",$params,$options);
		$stockFarmacia = sqlsrv_fetch_array($consultaStock);
		
		//taxa de iva do produto
		$consultaTaxaIvaSage = sqlsrv_query( $conn, "SELECT TaxableGroupID  FROM dbo.Item WHERE ItemID = '$itemCnpFetch'",$params,$options);
		$taxaIvaSage = sqlsrv_fetch_array($consultaTaxaIvaSage);

		//validades
		$consultaValidades = sqlsrv_query( $conn,	"SELECT 
													i.itemID,
													i.ItemFirstGroupID,
													i.ItemSecondGroupID,
													i.ItemThirdGroupID,
													f.Description,
													g.Description,
													h.Description 
													FROM 
													dbo.Item i,
													dbo.ItemFirstGroup f,
													dbo.ItemSecondGroup g,
													dbo.ItemThirdGroup h 
													WHERE 
													i.ItemFirstGroupID = f.ItemFirstGroupID 
													AND i.ItemSecondGroupID = g.ItemSecondGroupID 
													AND i.ItemThirdGroupID = h.ItemThirdGroupID 
													AND i.ItemID = '$itemCnpFetch'
												    ",$params,$options);
		
		$validades = sqlsrv_fetch_array($consultaValidades);

		$keyPvpXML = false; // Initialize $keyPvpXML with a default value
		
		foreach ($listagemProdutosXML as $key => $produto) {
			if ($produto->cnpXML == $itemCnpFetch) {
				$keyPvpXML = $key; // Atribui a chave (índice) do objeto encontrado
				break; // Encerra o loop, pois o objeto foi encontrado
			}
		}
		
		//$final_pvp_xml = new stdClass();
		if ($keyPvpXML !== false) {
			$final_pvp_xml = $listagemProdutosXML[$keyPvpXML];
	
		} else {
			$final_pvp_xml = new produtoFeedXML();
			$final_pvp_xml ->precoXML= "0.0 EUR";
			$final_pvp_xml ->cnpXML= "Sem cnp";
		}
		
		$listagemArtigos[$temp] = new artigoSage();
		$listagemArtigos[$temp]-> nomeSage = $nomeProduto[0];
		$listagemArtigos[$temp]-> cnpSage = $itemCnpFetch;
		$listagemArtigos[$temp]-> pcuSage = round($pcuRetornado[5],2);
		$listagemArtigos[$temp]-> pvpSage = round($pvpRetornado[5],2);
		$listagemArtigos[$temp]-> stockSageLoja = $stockLoja;
		$listagemArtigos[$temp]-> stockSageFarmacia = $stockFarmacia;
		$listagemArtigos[$temp]-> lastDateSage = $itemLastSell;
		$listagemArtigos[$temp]-> validade1 = $validades[4];
		$listagemArtigos[$temp]-> validade2 = $validades[5];
		$listagemArtigos[$temp]-> validade3 = $validades[6];
		$listagemArtigos[$temp]-> skuXML = $final_pvp_xml->cnpXML;
		$listagemArtigos[$temp]-> pvpReal = $final_pvp_xml->precoXML;
		$listagemArtigos[$temp]-> erro = 0;
		$listagemArtigos[$temp]-> taxaIvaSage = $taxaIvaSage[0];
	};

	//fechar conexão a base de dados
	sqlsrv_close($conn);

// Log para debug
//$ficheiro = fopen("logfile.txt", "w") or die("Não foi possível abrir o ficheiro");
//fwrite($ficheiro, json_encode($listagemArtigos));
//fclose($ficheiro);

header('Content-Type: application/json');
	 $jsonReturn=json_encode($listagemArtigos);
	echo($jsonReturn);

?>