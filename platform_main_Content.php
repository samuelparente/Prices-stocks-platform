
<div class="container-fluid">	

	<div class="offcanvas offcanvas-top text-bg-dark h-50vh" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
		<div class="offcanvas-header">
			<h5 id="offcanvasTopLabel">Simulador de PVP e margens</h5>
			<button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		</div>
		<div class="offcanvas-body container-fluid" id="divCanvasSimulador">
			<div class="col-6" id="divSimulador">
				<div>
					<p>Deixar em branco o campo PVP ou o campo MARGEM APLICADA, conforme o valor a calcular.</p>
				</div>
				<table class="table table-light table-striped table-sm align-middle">
					<thead class = "table-dark table-sm align-middle">
						<tr>
							<th>PCU sem IVA</th>
							<th>PCU com IVA</th>
							<th>Taxa de IVA</th>
							<th>Margem aplicada em %</th>
							<th>PVP com IVA</th>
							<th>Lucro em €</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody class="align-middle">
						<tr >
							<td>
								<input type="text" class="form-control" value="" id="pcuSemIva">
							</td>
							<td>
								<input type="text" disabled="disabled" class="form-control" value="" id="pcuComIva">
							</td>
							<td>
								<input type="text" class="form-control" value="23" id="txIva">
							</td>
							<td>
								<input type="text" class="form-control" value="" id="mgAplicada">
							</td>
							<td>
								<input type="text" class="form-control" value="" id="pvpIva">
							</td>
							<td>
								<input type="text" disabled="disabled" class="form-control" value="" id="lucro">
							</td>
							<td>
								<button type="button" class="btn btn-success" id="btnSimular">Simular</button>
							</td>
							<td>
								<button type="button" class="btn btn-danger" id="btnLimpar">Limpar</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>	
	
</div>

<div class="container-fluid">	
	<div class="offcanvas offcanvas-top text-bg-dark h-70vh " tabindex="-1" id="offcanvasTopVarios" aria-labelledby="offcanvasTopLabelVarios">
		<div class="offcanvas-header">
			<h5 id="offcanvasTopLabelVarios">Outras opções</h5>
			<button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		</div>
		<div class="offcanvas-body container-fluid" id="divCanvasVarios">
			
			<div class="container-fluid opcoesGerais">
				<div id="divExportar">
					<button type="button" class="btn btn-primary btn-sm pad" id="btnExportar">Exportar selecionados - PVP NORMAL</button>
					<button type="button" class="btn btn-primary btn-sm pad" id="btnExportarCampanha">Exportar selecionados - PVP CAMPANHA</button>
				</div>
			</div>
			
			<div class="container-fluid opcoesGerais">
			<input type="text" class="form-control" value="25" id="margemGlobal" aria-describedby="basic-addon2">
			<span class="input-group-text" id="basic-addon2"> % </span>
			<button type="button" class="btn btn-success btn-sm" id="aplicarGlobal">Aplicar margem global</button>
			</div>
			
			<div class="container-fluid opcoesGerais">		
				<select class="form-select form-select-sm" id="selectCampanha">
					<option selected>Selecionar tipo de campanha...</option>
					<option value="percentagem">Percentagem</option>
					<option value="valor">Valor</option>
				</select>
			<input type="text" class="form-control" value="0" id="descontoCampanha" aria-describedby="basic-addon3">
			<button type="button" class="btn btn-success btn-sm" id="aplicarCampanha">Aplicar campanha</button>
			</div>
			
			
		</div>
	</div>	
</div>
<div class="container-fluid">	

	<div class="offcanvas offcanvas-start text-bg-dark h-auto" tabindex="-1" id="offcanvasTopMargens" aria-labelledby="offcanvasTopLabelMargens">
		<div class="offcanvas-header">
			<h5 id="offcanvasTopLabelMargens">Tabela de margens por defeito</h5>
			<button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		</div>
		<div class="offcanvas-body container-fluid" id="divCanvasMargens">
			<div class="col-4" id="divTabelaMargens"></div>
		</div>
	</div>	
	
</div>

<div class="container-fluid">	

	<div class="offcanvas offcanvas-end text-bg-dark h-auto" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasConcorrencia" aria-labelledby="offcanvasTopLabelConcorrencia">
		<div class="offcanvas-header">
			<h5 id="offcanvasTopLabelConcorrencia">Outras lojas</h5>
			
			<button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		</div>
		<div id="divCnpProduto"></div>
		<div class="offcanvas-body container-fluid" id="divCanvasConcorrencia">
			
			<div id="divConcorrencia"></div>
		</div>
	</div>	
	
</div>

<div class="container-fluid">
	<div class="offcanvas offcanvas-top" tabindex="-1"  id="offCanvasMensagem">
	  <div class="offcanvas-body" id="offcanvasCorpo">
	  </div>
	</div>
</div>

<div class="container-fluid" id="linhaBotoes">
	
	
	<div class="container-fluid" id="selectPvp">
		<p>ORIGEM DO PVP</p>	
		<div class="form-check">
		  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
		  <label class="form-check-label" for="flexRadioDefault1">
			Usar tabela de margens por defeito e calcular PVP
		  </label>
		</div>
		<div class="form-check">
		  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
		  <label class="form-check-label" for="flexRadioDefault2">
			Usar PVP atual e calcular margens
		  </label>
		</div>
	</div>
	
	<div class="container-fluid" id="filtro_stocks">	
		<p>STOCK</p>
		<div class="form-check">
		  <input class="form-check-input" type="radio" name="filtro_stock" id="filtro_com_stock" checked>
		  <label class="form-check-label" for="filtro_com_stock">
			Com stock
		  </label>
		</div>
		
		<div class="form-check">
		  <input class="form-check-input" type="radio" name="filtro_stock" id="filtro_sem_stock">
		  <label class="form-check-label" for="filtro_sem_stock">
			Sem stock
		  </label>
		</div>
		
		<div class="form-check">
		  <input class="form-check-input" type="radio" name="filtro_stock" id="filtro_tudo_stock">
		  <label class="form-check-label" for="filtro_tudo_stock">
			Tudo
		  </label>
		</div>
		
	</div>
	
	<div class="container-fluid" id="filtro_vendas">	
		<p>VENDAS</p>
		<div class="form-check">
		  <input class="form-check-input" type="radio" name="filtro_venda" id="filtro_com_venda">
		  <label class="form-check-label" for="filtro_com_venda">
			Com vendas
		  </label>
		</div>
		
		<div class="form-check">
		  <input class="form-check-input" type="radio" name="filtro_venda" id="filtro_sem_venda">
		  <label class="form-check-label" for="filtro_sem_venda">
			Sem vendas
		  </label>
		</div>
		
		<div class="form-check">
		  <input class="form-check-input" type="radio" name="filtro_venda" id="filtro_tudo_venda" checked>
		  <label class="form-check-label" for="filtro_tudo_venda">
			Tudo
		  </label>
		</div>
	</div>

</div>

<div class="container-fluid" id="linhaMercadoFamilias">		
	<div id="divselectMercado">
		<select class="form-select form-select-sm" id="selectMercado">
		  <option selected>Selecionar mercado...</option>
			<option value="PT">Portugal</option>
			<option value="ES">Espanha</option>
		</select>
	</div>
	
	<select class="form-select form-select-sm" id="listaMarcas">
	  <option selected>Selecionar família...</option>
	<option value="9999">Todas</option>
	 <?php
				 
		// liga ao servidor
		//$serverName = "server"; //servidor local
		$serverName = "LOJA"; // servidor remoto
		$connectionInfo = array( "Database"=>"db", "UID"=>"sa", "PWD"=>"sa", "CharacterSet" => "UTF-8");
		$conn = sqlsrv_connect( $serverName, $connectionInfo);
			if( $conn === false ) {
			  die( print_r( sqlsrv_errors(), true));
				echo ("<h3>Erro a ligar a base de dados</h3>");

			}

			else {

				//echo ("<h3>Ligado a base de dados com sucesso!</h3>");
			}

				//listagem das famílias

				//Querys
				$params = array();
				$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);

				$searchFamily = sqlsrv_query( $conn, "SELECT * FROM Family",$params,$options);
				$consultaFamilia = sqlsrv_query( $conn, "SELECT FamilyID, Description FROM dbo.Family ORDER BY Description",$params,$options);

				$row_count = sqlsrv_num_rows($searchFamily);
				   
				if ($row_count === false){
				 //  echo "<h3>Erro na requisição do número de registos de produtos.</h3>";
				}


				else{
				   
					//echo ("<h3>Encontradas ".$row_count." marcas registadas na base de dados.</h3>");

				}

					
				if ($row_count!=0) {
					
						while ($cadaLinha = sqlsrv_fetch_array($consultaFamilia)) {
							
						?>
						<option value="<?php echo $cadaLinha['FamilyID']; ?>">
						<?php echo $cadaLinha['Description'];?>
						</option>
						<?php } //loop while ?>
					<?php } //loop if

					//fechar conexão a base de dados
					sqlsrv_close($conn);
					
				?>
	</select>
	
	<button type="button" class="btn btn-primary btn-sm" id="btnListar">Listar</button>
</div>

<div class="container-fluid mensagensAvisos">		

	
</div>


<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Aguarde... </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div  id="progresso" ></div>
      </div>
      <div class="modal-footer">
        
      </div>
    </div>
  </div>
</div>

<div class="container-fluid" >		

	<div  id="mensagens"></div>
	
</div>
<div class="container-fluid" >		

	<div id="mensagens2"></div>
	
</div>
<div class="container-fluid">		

	<div id="mensagens3"></div>
	
</div>


<div class="container-fluid">		

	<div id="tabelaLinha"></div>
	
</div>

<div class="container" >		

	<div class="col-12" id="tabelaMedias"></div>
	
</div>

