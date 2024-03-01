<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
<title>teste</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<link href="pricelist.css" rel="stylesheet" type="text/css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
	
	
</head>

<body>

	<div class="container">
		<div class="row" id="headerTexto">
			<div class="col-4">
				<img src="logo.png"></img>
			</div>
			<div class="col-8" >
				<h3>Exportação de preços de custo</h3>
			</div>
			
		</div>
		
		<div class="row">
		
		 <div class="col-5">
			 
			<div class="input-group mb-3" id="listaEntrada">
			  <label class="input-group-text" for="listaMarcas">Marcas</label>
			  <select class="form-select" id="listaMarcas">
				<option selected>Selecionar...</option>

				  <?php
				  header('Content-type: text/html; charset=utf-8');
				  
						// liga ao servidor
						//$serverName = "server"; //servidor local
						$serverName = "name"; // servidor remoto
						$connectionInfo = array( "Database"=>"db", "UID"=>"sa", "PWD"=>"##", "CharacterSet" => "UTF-8");
						$conn = sqlsrv_connect( $serverName, $connectionInfo);
							if( $conn === false ) {
							  die( print_r( sqlsrv_errors(), true));
								echo ("<h3>Erro a ligar a base de dados</h3>");

							}

							else {

								//echo ("<h3>Ligado a base de dados com sucesso!</h3>");
							}
	
	//////////////////////////////////////////////////////////////////////////////////////////
								//listagem das famílias

								//Querys
								$params = array();
								$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);

								$searchFamily = sqlsrv_query( $conn, "SELECT * FROM Family",$params,$options);
								$consultaFamilia = sqlsrv_query( $conn, "SELECT FamilyID, Description FROM dbo.Family ORDER BY Description",$params,$options);

								$row_count = sqlsrv_num_rows($searchFamily);
								   
								if ($row_count === false){
								  // echo "<h3>Erro na requisição do número de registos de produtos.</h3>";
								}


								else{
								   
									//echo ("<h3>Encontradas ".$row_count." marcas registadas na base de dados.</h3>");

								}

									
								if ($row_count!=0) {
									

									
										while ($cadaLinha = sqlsrv_fetch_array($consultaFamilia)) {
											
										?>
										
										<option value="<?php echo $cadaLinha['FamilyID']; ?>">
										<?php echo $cadaLinha['FamilyID']." - ".$cadaLinha['Description'];?>
										</option>
										
										
										<?php } //loop while ?>
									
									<?php } //loop if

									//fechar conexão a base de dados
									sqlsrv_close($conn);
									echo ("<h3>Ligado a base de dados com sucesso!</h3>");
									 ?>
									
					
		
			  </select>
			</div>	

			 
	     </div> <!--coluna marcas -->
			
			<div class="col-2">
				<button type="button" class="btn btn-primary" id="btnExportar">Exportar</button>
			</div> <!--coluna botao-->
				
		</div> <!--linha selecao-->
		
		
	</div> <!--container-->
	
</body>
</html>