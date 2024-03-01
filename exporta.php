<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>LISTA EXPORTADA</title>
</head>

<body>
	
<?php

//"puxa" o id da marca selecionada

$marcaID = $_GET["marca"];	

//inicia ligação a base de dados do sage
$serverName = "LOJA";
$connectionInfo = array( "Database"=>"bd", "UID"=>"sa", "PWD"=>"Sa","CharacterSet" => "UTF-8");
$conn = sqlsrv_connect( $serverName, $connectionInfo);
	if( $conn === false ) {
   	  die( print_r( sqlsrv_errors(), true));
		echo ("Erro a ligar a base de dados");
	}

	else {

		//echo ("<h2>Ligado a base de dados com sucesso!</h2>");
	}

//Querys
$params = array();
$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );

$consultaItensDaFamilia = sqlsrv_query( $conn, "SELECT ItemID, ItemKey  FROM dbo.Item WHERE FamilyID = $marcaID",$params,$options);
$qtdeProdutos = sqlsrv_num_rows($consultaItensDaFamilia);

		if($qtdeProdutos==0){
			
			echo("Marca sem produtos associados");
		}

		else{
			
		
				
						
						
						//tabela HTML com o formato da folha excel
						$html = '';
						$html .= '<table>';
						$html .= '<tr>';
						$html .= '<td><b>Descrição</b></td>';
						$html .= '<td><b>SKU</b></td>';
						$html .= '<td><b>Preço de custo s/IVA</b></td>';
						$html .= '<td><b>Preço de venda s/IVA</b></td>';
						$html .= '</tr>';
						
				for ($temp = 0; $temp<$qtdeProdutos;$temp++) {

						//cnp do produto
						$itemCnp = sqlsrv_fetch_array($consultaItensDaFamilia);
						$itemCnpFetch = $itemCnp["ItemID"];
						
						
						//nome da família para o nome do ficheiro
						//$consultaFamilia = sqlsrv_query( $conn, "SELECT FamilyID, Description FROM dbo.Family ORDER BY Description",$params,$options);
						//$nomeFamilia = sqlsrv_fetch_array($consultaFamilia);
						//nome do arquivo que será exportado
						$arquivo ='listagem.xls';
						
						//preço de custo sem iva do produto
						$consultaCnpPcu = sqlsrv_query($conn, "SELECT * FROM dbo.ItemSellingPrices WHERE ItemID = '$itemCnpFetch' AND PriceLineID = 0",$params,$options);
						$pcuRetornado = sqlsrv_fetch_array($consultaCnpPcu);
						
						//preço pvp sem iva do produto
						$consultaCnpPvp = sqlsrv_query($conn, "SELECT * FROM dbo.ItemSellingPrices WHERE ItemID = '$itemCnpFetch' AND PriceLineID = 1",$params,$options);
						$pvpRetornado = sqlsrv_fetch_array($consultaCnpPvp);
						
						//nome do produto
						$consultaNome = sqlsrv_query( $conn, "SELECT Description  FROM dbo.ItemNames WHERE ItemID='$itemCnpFetch'",$params,$options);
						$nomeProduto = sqlsrv_fetch_array($consultaNome);
						
						//echo ('<p>'.$itemCnpFetch.' - '.$pcuRetornado["UnitPrice"].' - '.$nomeProduto['Description'].'</p>');
						
						$tablePcu = $pcuRetornado['UnitPrice'];
						$tablePvp = $pvpRetornado['UnitPrice'];
						$tableDesc = $nomeProduto['Description'];
						
						
						
						
						
						$html .= '<tr>';
						$html .= '<td>'.$tableDesc.'</td>';
						$html .= '<td>'.$itemCnpFetch.'</td>';
						$html .= '<td>'.$tablePcu.'</td>';
						$html .= '<td>'.$tablePvp.'</td>';
						$html .= '</tr>';
						
						
						
				}
				
				
				
				
						$html .= '</table>';
				
						// Configurações header para forçar o download
						header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
						header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
						header ("Cache-Control: no-cache, must-revalidate");
						header ("Pragma: no-cache");
						header ("Content-type: application/x-msexcel");
						header ("Content-Disposition: attachment; filename=\"{$arquivo}\"" );
						header ("Content-Description: PHP Generated Data" );

						// Envia o conteúdo do arquivo
						echo $html;
						exit;
			}

//fechar conexão a base de dados

	sqlsrv_close($conn);



/*
$pesquisa = sqlsrv_query( $conn, "SELECT * FROM ItemSellingPrices WHERE ",$params,$options);

$row_count = sqlsrv_num_rows($pesquisa);
	   
	if ($row_count === false){
	   echo "<h3>Erro na requisição do número de registos de produtos.</h3>";
	}
	
	else{
		$row_count=$row_count/4;
		//echo ("<h3>Existem ".$row_count." produtos registados na base de dados.</h3>");
	}


//listagem dos produtos-código+PCU sem iva+descrição

$consultaCnpPcu = sqlsrv_query( $conn, "SELECT ItemID, UnitPrice  FROM dbo.ItemSellingPrices WHERE PriceLineID = 0",$params,$options);
$consultaNome = sqlsrv_query( $conn, "SELECT Description  FROM dbo.ItemNames",$params,$options);

echo ('<table class="table table-striped" id="tabelaProdutos">');
	echo ('<tr>');
		echo ('<th width="200px">');
		echo ('SKU');
		echo ('</th>');
		echo ('<th width="200px">');
		echo ('Preço custo sem IVA');
		echo ('</th>');
		echo ('<th width="600px">');
		echo ('Descrição');
		echo ('</th>');
	echo ('</tr>');
	
if ($row_count!=0) {
	
	while ($cadaLinha = sqlsrv_fetch_array($consultaProduto)) {
	
	echo ('<tr>');
		echo ('<td id="'.$cadaLinha["ItemID"].'">');
		echo $cadaLinha["ItemID"];
		echo ('</td>');
		echo ('<td>');
		echo $cadaLinha["UnitPrice"];
		echo ('</td>');
		
		$cadaLinha2 = sqlsrv_fetch_array($consultaNome);
		
		echo ('<td>');
		echo $cadaLinha2["Description"];
		echo ('</td>');

	}
	
echo ('<table>');

//fechar conexão a base de dados

	sqlsrv_close($conn);

}


/////////////////////////////////////////////////////////////////////////////////
	
/*
* Criando e exportando planilhas do Excel
* /
*/
/*
//nome do arquivo que será exportado
$arquivo = $marca.'.xls';

//tabela HTML com o formato da folha excel
$html = '';
$html .= '<table>';
$html .= '<tr>';
$html .= '<td colspan="3">Planilha teste</tr>';
$html .= '</tr>';
$html .= '<tr>';
$html .= '<td><b>Coluna 1</b></td>';
$html .= '<td><b>Coluna 2</b></td>';
$html .= '<td><b>Coluna 3</b></td>';
$html .= '</tr>';
$html .= '<tr>';
$html .= '<td>L1C1</td>';
$html .= '<td>L1C2</td>';
$html .= '<td>L1C3</td>';
$html .= '</tr>';
$html .= '<tr>';
$html .= '<td>L2C1</td>';
$html .= '<td>L2C2</td>';
$html .= '<td>L2C3</td>';
$html .= '</tr>';
$html .= '</table>';

// Configurações header para forçar o download
header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
header ("Cache-Control: no-cache, must-revalidate");
header ("Pragma: no-cache");
header ("Content-type: application/x-msexcel");
header ("Content-Disposition: attachment; filename=\"{$arquivo}\"" );
header ("Content-Description: PHP Generated Data" );

// Envia o conteúdo do arquivo
echo $html;
exit;

*/
	
?>



</body>
</html>