<?php
	$postBody = file_get_contents("php://input");
	$decodedJson=json_decode($postBody);
	$textoPesquisa =$decodedJson->pesquisa;
	
	//inicia ligação a base de dados do sage
	$serverName = "HP-LOJA"; // servidor remoto
	$connectionInfo = array( "Database"=>"db", "UID"=>"sa", "PWD"=>"sa","CharacterSet" => "UTF-8");
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
	$temp = 0;
	//estruturas
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
		
		$listagemArtigos = array();
	
	//Querys
	$qtdeProdutos=0;
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
	
	$string_pedido_bd = "SELECT i.ItemID, i.ItemKey,i.ItemTax, i.LastOutgoingDate FROM dbo.Item i WHERE i.ItemID LIKE '" . $textoPesquisa . "'";
	
	$consultaItensDaFamilia = sqlsrv_query( $conn, $string_pedido_bd, $params,$options);
	
		if ($consultaItensDaFamilia === false) {
		
			die(print_r(sqlsrv_errors(), true));
		}
		
	$qtdeProdutos = sqlsrv_num_rows($consultaItensDaFamilia);
	
	//encontrou por cnp?se não encontrou,tenta por descrição
	if($qtdeProdutos==0){
		
		//$string_pedido_bd = "SELECT i.ItemID, i.Description FROM dbo.ItemNames i WHERE i.Description LIKE '%" . $textoPesquisa . "%'"; 
			
		//print_r("Nao encontrei por cnp\n");
		
		$palavrasChave = explode(" ", $textoPesquisa);
		$expressoesRegulares = array();

		foreach ($palavrasChave as $palavra) {
			$expressoesRegulares[] = "i.Description COLLATE Latin1_General_CI_AI  LIKE '%" . $palavra . "%'";
		}

		$string_pedido_bd = "SELECT i.ItemID, h.ItemID, h.LastOutgoingDate, i.Description FROM dbo.ItemNames i, dbo.Item h WHERE " . implode(" AND ", $expressoesRegulares) . " AND i.ItemID = h.ItemID";

		$consultaItensDaFamilia = sqlsrv_query( $conn, $string_pedido_bd, $params,$options);
	
		if ($consultaItensDaFamilia === false) {
		
			die(print_r(sqlsrv_errors(), true));
		}
		
		$qtdeProdutos = sqlsrv_num_rows($consultaItensDaFamilia);
		
	}
	
	
	//encontrou produtos com texto da pesquisa ou cnp.
	if($qtdeProdutos !=0){

		foreach($xml->children() as $produtosPvp){
			
			$listagemProdutosXML[$var1] = new produtoFeedXML();
			$listagemProdutosXML[$var1]-> cnpXML = $produtosPvp->id_product;
			$listagemProdutosXML[$var1]-> precoXML = $produtosPvp->sale_price;
			$var1++;
		}

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
				
				//stock disponível loja
				$consultaStock = sqlsrv_query( $conn, "SELECT AvailableQty  FROM dbo.Stock WHERE ItemID = '$itemCnpFetch' AND WarehouseID = 1",$params,$options);
				$stockLoja = sqlsrv_fetch_array($consultaStock);
				
				//stock disponível loja
				$consultaStock = sqlsrv_query( $conn, "SELECT AvailableQty  FROM dbo.Stock WHERE ItemID = '$itemCnpFetch' AND WarehouseID = 2",$params,$options);
				$stockFarmacia = sqlsrv_fetch_array($consultaStock);
				
				//taxa de iva do produto
				//$consultaTaxaIvaSage = sqlsrv_query( $conn, "SELECT i.TaxableGroupID, o.TaxGroupID, o.TaxRate FROM dbo.Item i,TaxTable o WHERE i.ItemID='$itemCnpFetch' AND o.TaxGroupID=i.TaxableGroupID",$params,$options);
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

	}
	else{
		$listagemArtigos[0] = new artigoSage();
		$listagemArtigos[0]-> erro = 1;
	}
	
	//fechar conexão a base de dados
	sqlsrv_close($conn);
	header('Content-Type: application/json');
	$jsonReturn=json_encode($listagemArtigos);
	echo($jsonReturn);
?>