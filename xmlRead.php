<?php

	class produtoFeedXML
		{
			public $cnpXML;
			public $precoXML;
			
		}

$listagemProdutosXML = array();
$var1=0;


	
	$file = 'https://www.zonpharma.com/extend/catalog_20.xml';
    $xml = simplexml_load_file($file);
	
foreach($xml->children() as $produtosPvp){
	
	$listagemProdutosXML[$var1] = new produtoFeedXML();
	$listagemProdutosXML[$var1]-> cnpXML = $produtosPvp->id_product;
	$listagemProdutosXML[$var1]-> precoXML = $produtosPvp->sale_price;
	
	
	//echo $produtosPvp->id_product." - ".$produtosPvp->sale_price."<br>";
	//echo $listagemProdutosXML[$var1]->precoXML;
	$var1++;
}

foreach ($listagemProdutosXML as $key => $produto) {
			if ($produto->cnpXML == 6031963) {
				$keyPvpXML = $key; // Atribui a chave (índice) do objeto encontrado
				echo $keyPvpXML;
			}
		}
