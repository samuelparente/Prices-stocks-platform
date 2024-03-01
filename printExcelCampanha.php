<?php
session_start();

$decodedJson = $_SESSION['lista'];

	
	$qtdeItems = count($decodedJson);	

//tabela HTML com o formato da folha excel
						$html = '';
						$html .= '<table>';
						$html .= '<tr>';
						$html .= '<td>SKU</td>';
						$html .= '<td>PVP</td>';
						$html .= '</tr>';
						
				for($temp = 0; $temp<$qtdeItems; $temp++){

						$html .= '<tr>';
						$html .= '<td>'.$decodedJson[$temp]['sku'].'</td>';
						$html .= '<td>'.$decodedJson[$temp]['pvp'].'</td>';
						$html .= '</tr>';
						
				}
						$html .= '</table>';
			
						$arquivo = "listagem.xls";
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
						
?>