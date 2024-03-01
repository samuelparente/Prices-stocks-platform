
window.onload = () => {
	
	var btnListar = document.getElementById("btnListar");
	var btnExportar = document.getElementById("btnExportar");
	var selectMercado = document.getElementById("selectMercado");
	var btnaplicarGlobal = document.getElementById("aplicarGlobal");
	var boxMargem = document.getElementsByClassName("cxMg");
	var listagem = document.getElementById("listaMarcas");
	var btnAplicarCampanha = document.getElementById("aplicarCampanha");
	var btnSimular = document.getElementById("btnSimular");
	var btnLimpar = document.getElementById("btnLimpar");
	var boxPcuIva = document.getElementById('pcuSemIva');
	var boxPcuIvaNovo = document.getElementById('txIva');
	var lupa_pesquisa = document.getElementById('lupa_pesquisa');
	var pesquisa = document.getElementById("pesquisa");
	var iva=0;
	var botaoTestes = document.getElementById('botaoTestes');
	
	//botaoTestes.addEventListener("click", mostrarMensagem);
	
	btnListar.addEventListener("click", listaFamilia);
	btnExportar.addEventListener("click", exportaFamilia);
	btnExportarCampanha.addEventListener("click", exportaFamiliaCampanha);
	btnaplicarGlobal.addEventListener("click", aplicaMargemGlobal);
	btnAplicarCampanha.addEventListener("click", aplicaCampanha);
	btnSimular.addEventListener("click", simulaPvp);
	btnLimpar.addEventListener("click", limparCampos);
	lupa_pesquisa.addEventListener("click", pesquisar);
	
	var botaoPvp = document.getElementById("flexRadioDefault2");
	
	//if(botaoPvp.checked == true){
	//	selectMercado.selectedIndex=1;
	//	listagemEventos();
	//}
	

  
	pesquisa.addEventListener("keypress",function(event) {
		  if (event.keyCode === 13) { // Verifica se a tecla pressionada é o "Enter"
			pesquisar(); // Chame a função desejada aqui
		  }
	});
	
	selectMercado.addEventListener("change",criaTabelaMargens);
	listagem.addEventListener("change",listagemEventos);
	boxPcuIva.addEventListener("change",escrevePcuIva);
	boxPcuIvaNovo.addEventListener("change",escrevePcuIva);
	
	btnListar.disabled = true;
	btnExportar.disabled = true;
	btnaplicarGlobal.disabled = true;
	btnAplicarCampanha.disabled = true;
	
	listagemEventos();
	
	
	function pesquisar(){
	
		var textoPesquisa = document.getElementById("pesquisa").value;
		
		var contadorNulos = 0;
		var contadorPcuNulos = 0;
		var contadorPvpSageNulo = 0;
		var valueStock = 0;
		var valueVenda = 0;
		
		document.getElementById("mensagens").innerHTML = "";
		document.getElementById("mensagens2").innerHTML = "";
		document.getElementById("mensagens3").innerHTML = "";
		
		//botoes radio de selecão de pvp
		var tabela_select = document.getElementById("flexRadioDefault1");
		var pvp_xml_select = document.getElementById("flexRadioDefault2");
		
		//botoes radio de selecao de stock
		var com_stock_radio = document.getElementById("filtro_com_stock");
		var sem_stock_radio = document.getElementById("filtro_sem_stock");
		var tudo_stock_radio = document.getElementById("filtro_tudo_stock");
		
		//botoes radio de selecao de vendas
		var com_venda_radio = document.getElementById("filtro_com_venda");
		var sem_venda_radio = document.getElementById("filtro_sem_venda");
		var tudo_venda_radio = document.getElementById("filtro_tudo_venda");
		
		//pedido do filtro stock
		if(com_stock_radio.checked){
			valueStock = 1;
		}
		else if(sem_stock_radio.checked){
			valueStock = 0;
		}
		else if(tudo_stock_radio.checked){
			valueStock = 2;
		}
		else{
			
		}
		
		//pedido do filtro venda
		if(com_venda_radio.checked){
			valueVenda = 1;
		}
		else if(sem_venda_radio.checked){
			valueVenda = 0;
		}
		else if(tudo_venda_radio.checked){
			valueVenda = 2;
		}
		else{
			
		}
		
		
		//dados para pedir info a base de dados
		var pedidoListagem={"pesquisa":textoPesquisa};					
			
			
		if (textoPesquisa == ""){
			
		}
		else{
			
		var divProgresso = document.getElementById("progresso");
		
		
		divProgresso.innerHTML = "A pesquisar produto na base de dados... <div class=\"spinner-border\" role=\"status\"><span class=\"visually-hidden\">A pesquisar produto na base de dados...</span></div>";
		$("#exampleModal").modal('show');		
		
		
		fetch ('pesquisaProduto.php', {
						method: 'POST',
						headers:{
							'Content-Type': 'application/json',
							
						},
						body:JSON.stringify(pedidoListagem),
						
						
					})//fetch
		
				
						.then(listaFamilia => listaFamilia.json())
							 
						.then(listaFamilia => {	
						
							var selecionaMercado = document.getElementById("selectMercado");
							selecionaMercado.selectedIndex = 1;
							criaTabelaMargens();
							
							//encontrou pelo menos um resultado
							if(listaFamilia[0].erro ==0){
							
							
							divProgresso = document.getElementById('progresso');
							divProgresso.innerHTML = "";
							
								$("#exampleModal").modal('hide');
							
							var tr,linhaId,cnp,descricao,pcuSage,pvpSage,iva=0,margem=25,pvpVenda,mgLucro,blocoEntrada,temp2,temp3,caixaMargem,tempText,caixaPvp,taxaIvaSage;
							var stringContadorPcu="",stringContadorPvpSage="",stringcontadorPvpFinal="";
							var mediaMargem = 0;
							var mediaLucro = 0;
							var pvpReal = "";
							
							//validades
							var validade1="";
							var validade2="";
							var validade3="";
							
							var tabelaLinha =  document.getElementById('tabelaLinha');
							var tabela = document.createElement('table');
							tabela.setAttribute('class','table table-light align-middle'); 
							tabela.setAttribute('id','tabelaPcu');
							tabelaLinha.innerHTML = "";
							
							var thead = document.createElement('thead');
							thead.setAttribute('class','table-dark table-sm');
							
							tr = document.createElement('tr');
							
							//cabeçalhos da tabela
							
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('#'));
							tr.appendChild(linhaId);
							//cria um check box para selecionar todos ou não
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							var checkAll = document.createElement('input');
							checkAll.setAttribute('class','form-check-input');
							checkAll.setAttribute('type','checkbox');
							checkAll.setAttribute('id','selectAll');
							checkAll.setAttribute('checked','true');
							linhaId.appendChild(checkAll);
							tr.appendChild(linhaId);
							
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('SKU'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Descrição'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('PCU Sage s/IVA'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('PCU Sage c/IVA'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Taxa de IVA'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Margem aplicada'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('PVP c/IVA'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Lucro'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('PVP campanha'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Stock'));
							linhaId.setAttribute('class','class_stock');
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Última venda'));
							linhaId.setAttribute('class','class_vendas');
							tr.appendChild(linhaId);
							//validades
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							
							linhaId.appendChild(document.createTextNode('Validade 1'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							
							linhaId.appendChild(document.createTextNode('Validade 2'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');

							linhaId.appendChild(document.createTextNode('Validade 3'));
							tr.appendChild(linhaId);
							
							//botões de gravar preço
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode(' '));
							tr.appendChild(linhaId);
							
							
							thead.appendChild(tr);
							tabela.appendChild(thead);
							
							tabelaLinha.appendChild(tabela);
							
							var tbody = document.createElement('tbody');	
							
							
							//ler patamares de margem
								var p1 = document.getElementById('p1').value;
								var p2 = document.getElementById('p2').value;
								var p3 = document.getElementById('p3').value;
								var p4 = document.getElementById('p4').value;
								var p5 = document.getElementById('p5').value;
								var p6 = document.getElementById('p6').value;
								var p7 = document.getElementById('p7').value;
								var p8 = document.getElementById('p8').value;
								var p9 = document.getElementById('p9').value;
								var p10 = document.getElementById('p10').value;
								var p11 = document.getElementById('p11').value;
								var p12 = document.getElementById('p12').value;
								var p13 = document.getElementById('p13').value;
								var p14 = document.getElementById('p14').value;
								var p15 = document.getElementById('p15').value;
								var p16 = document.getElementById('p16').value;
								var p17 = document.getElementById('p17').value;
								var p18 = document.getElementById('p18').value;
				
							
							for(let temp=0;temp<listaFamilia.length;temp++){
								
								
								tr = document.createElement('tr');
								
								//id da linha
								linhaId = document.createElement('td');
								linhaId.appendChild(document.createTextNode(temp+1));
								tr.appendChild(linhaId);
								//checkboxes
								//cria um check box para selecionar todos ou não
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','center');
								var checkItem = document.createElement('input');
								checkItem.setAttribute('class','form-check-input');
								checkItem.setAttribute('type','checkbox');
								checkItem.setAttribute('name','checkThid');
								checkItem.setAttribute('checked','true');
								checkItem.setAttribute('id','selectItem'+(temp+1));
								linhaId.appendChild(checkItem);
								tr.appendChild(linhaId);
								
								//cnp sage
								//linhaId = document.createElement('td');
								//linhaId.appendChild(document.createTextNode(listaFamilia[temp].cnpSage));
								//tr.appendChild(linhaId);
							
								//cnp sage - clicar em cima cnp para chamar a função de ver preços da concorrência. ao fazer mouse hover aparecer o balao-"clicar para ver preços outras lojas"
								linhaId = document.createElement('td');
								linhaId.setAttribute('data-bs-toggle','tooltip');
								linhaId.setAttribute('data-bs-placement','top');
								linhaId.setAttribute('title','Clique para ver as outras lojas');
								
								var linkCnp = document.createElement('a');
								linkCnp.style.cursor = 'pointer';
								linkCnp.style.color = 'blue';
								//linkCnp.href = listaFamilia[temp].cnpSage; // Set the URL for the link
								linkCnp.textContent = listaFamilia[temp].cnpSage; // Set the link text

								linhaId.appendChild(linkCnp);
								
								linkCnp.addEventListener('click', function(event) {
								  event.preventDefault(); // Prevent the default behavior of navigating to the URL
								  var cnpPesquisa = listaFamilia[temp].cnpSage;
								  precosConcorrencia(cnpPesquisa,listaFamilia[temp].nomeSage);
								});
										
								//linhaId.appendChild(document.createTextNode(listaFamilia[temp].cnpSage));
								tr.appendChild(linhaId);
								
								
								//nome sage
								linhaId = document.createElement('td');
								linhaId.appendChild(document.createTextNode(listaFamilia[temp].nomeSage));
								tr.appendChild(linhaId);
								//pcu sage sem iva
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.appendChild(document.createTextNode(listaFamilia[temp].pcuSage));
								tr.appendChild(linhaId);
								
								
								taxaIvaSage = listaFamilia[temp].taxaIvaSage;
								
								if(taxaIvaSage==1){
									taxaIvaSage=23;
									iva=23;
								}
								else if(taxaIvaSage==3){
									taxaIvaSage=6;
									iva=6;
								}
								else{
									taxaIvaSage=23;
									iva=23;
								}
								
								//pvp sage sem iva
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								//linhaId.appendChild(document.createTextNode(listaFamilia[temp].pvpSage)); //pvp sage sem iva
								linhaId.appendChild(document.createTextNode(((listaFamilia[temp].pcuSage)*((taxaIvaSage/100)+1)).toFixed(2)));
								tr.appendChild(linhaId);
								
								//iva
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								
								
								linhaId.appendChild(document.createTextNode(taxaIvaSage));
								tr.appendChild(linhaId);
								
								
								
								//margem aplicada
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								
								var margemAplicar = 25;
								
								//preço custo
								var pcuExportar = listaFamilia[temp].pcuSage;
								var tempboxMargin=0;
								//definir qual margem a aplicar consoante patamar de pcu
								if (pcuExportar>=0.01 && pcuExportar<=1){
									margemAplicar = p1;
									tempboxMargin = "margemP1"
								}
								else if (pcuExportar>=1.01 && pcuExportar<=2){
									margemAplicar = p2;
									tempboxMargin = "margemP2"
								}
								else if (pcuExportar>=2.01 && pcuExportar<=3){
									margemAplicar = p3;
									tempboxMargin = "margemP3"
								}
								else if (pcuExportar>=3.01 && pcuExportar<=4){
									margemAplicar = p4;
									tempboxMargin = "margemP4"
								}
								else if (pcuExportar>=4.01 && pcuExportar<=5){
									margemAplicar = p5;
									tempboxMargin = "margemP5"
								}
								else if (pcuExportar>=5.01 && pcuExportar<=10){
									margemAplicar = p6;
									tempboxMargin = "margemP6"
								}
								else if (pcuExportar>=10.01 && pcuExportar<=15){
									margemAplicar = p7;
									tempboxMargin = "margemP7"
								}
								else if (pcuExportar>=15.01 && pcuExportar<=20){
									margemAplicar = p8;
									tempboxMargin = "margemP8"
								}
								else if (pcuExportar>=20.01 && pcuExportar<=25){
									margemAplicar = p9;
									tempboxMargin = "margemP9"
								}
								else if (pcuExportar>=25.01 && pcuExportar<=30){
									margemAplicar = p10;
									tempboxMargin = "margemP10"
								}
								else if (pcuExportar>=30.01 && pcuExportar<=35){
									margemAplicar = p11;
									tempboxMargin = "margemP11"
								}
								else if (pcuExportar>=35.01 && pcuExportar<=40){
									margemAplicar = p12;
									tempboxMargin = "margemP12"
								}
								else if (pcuExportar>=40.01 && pcuExportar<=45){
									margemAplicar = p13;
									tempboxMargin = "margemP13"
								}
								else if (pcuExportar>=45.01 && pcuExportar<=50){
									margemAplicar = p14;
									tempboxMargin = "margemP14"
								}
								else if (pcuExportar>=50.01 && pcuExportar<=100){
									margemAplicar = p15;
									tempboxMargin = "margemP15"
								}
								else if (pcuExportar>=100.01 && pcuExportar<=150){
									margemAplicar = p16;
									tempboxMargin = "margemP16"
								}
								else if (pcuExportar>=150.01 && pcuExportar<=200){
									margemAplicar = p17;
									tempboxMargin = "margemP17"
								}
								else if (pcuExportar>=200.01){
									margemAplicar = p18;
									tempboxMargin = "margemP18"
								}
								else {
									margemAplicar = 25;
									tempboxMargin = "margem25"
								}
								
								//escreve margem aplicada
								caixaMargem = document.createElement('input');
								caixaMargem.setAttribute('type','text');
								caixaMargem.setAttribute('class','cxMg');
								caixaMargem.setAttribute('name',tempboxMargin);
								caixaMargem.setAttribute('id',"tempboxMargin"+(temp+1));
								caixaMargem.value = margemAplicar;
								
								caixaMargem.addEventListener("change", updatePvp);
								linhaId.appendChild(caixaMargem);
								tr.appendChild(linhaId);
								
									//media margem
									var tempValue = caixaMargem.value;
									mediaMargem = mediaMargem+parseFloat(tempValue);
								
								
								//pvp venda com iva e margem
								
									//verificar se é para utilizar a tabela por defeito ou ler diretamente o pvp atual e calcular as margens
								
									if(pvp_xml_select.checked){
										
										//debug
										//console.log(listaFamilia[temp].skuXML[0] + " - "+ listaFamilia[temp].pvpReal[0] + "\n");
									
										var string_pvp_xml = listaFamilia[temp].pvpReal[0];
										pvpVenda = parseFloat(string_pvp_xml.replace(" EUR",""));
										pvpVenda = pvpVenda.toFixed(2);
										
										if (pvpVenda!=0){}
										else{
											pvpVenda=0.0;
										}
									
									}
									else{
										pvpVenda = (listaFamilia[temp].pcuSage/(1-(margemAplicar/100)))*(1+(iva/100));
										pvpVenda = pvpVenda.toFixed(2);
									}
								
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								
								caixaPvp = document.createElement('input');
								caixaPvp.setAttribute('type','text');
								caixaPvp.setAttribute('class','cxMg');
								caixaPvp.setAttribute('name',"pvpVenda"+(temp+1));
								caixaPvp.setAttribute('id',"pvpVenda"+(temp+1));
								caixaPvp.value = pvpVenda;
								
								linhaId.appendChild(caixaPvp);
								tr.appendChild(linhaId);
								
								
								caixaPvp.addEventListener("change", updateMargin);
								
								//margem de lucro
								mgLucro = pvpVenda-(pcuExportar+(pvpVenda-(pvpVenda/1.23)));
								mgLucro = mgLucro.toFixed(2);
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.appendChild(document.createTextNode(mgLucro));
								tr.appendChild(linhaId);
								
								
								
								//valor por defeito de campanha =0
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.setAttribute('id','campanha'+(temp+1));
								linhaId.appendChild(document.createTextNode("0"));
								tr.appendChild(linhaId);
								
								//stock em loja
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.innerHTML = "Loja: " + listaFamilia[temp].stockSageLoja[0] + "<br>Farmácia: " + listaFamilia[temp].stockSageFarmacia[0];
								tr.appendChild(linhaId);
								
								var itemDate = listaFamilia[temp].lastDateSage;
								
								var sales="";
								
								if(itemDate != null){

									var dataUltimaVenda = (itemDate.date).split(' ',1);
									
									var sales = (dataUltimaVenda[0]);
								}
								else{
									sales = "Sem vendas.";
								}
								
								//data da ultima venda
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.appendChild(document.createTextNode(sales));
								tr.appendChild(linhaId);
								
								//validades
							
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.setAttribute('class','validade1Cor');
								linhaId.appendChild(document.createTextNode(listaFamilia[temp].validade1));
								tr.appendChild(linhaId);
								
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.setAttribute('class','validade2Cor');
								linhaId.appendChild(document.createTextNode(listaFamilia[temp].validade2));
								tr.appendChild(linhaId);
								
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.setAttribute('class','validade3Cor');
								linhaId.appendChild(document.createTextNode(listaFamilia[temp].validade3));
								tr.appendChild(linhaId);
								
								//botões de gravar preço
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','center');
								
								var botaoGravar = document.createElement('button');
								botaoGravar.setAttribute('class','btn btn-primary botaoGravaPVP');
								botaoGravar.setAttribute('id',listaFamilia[temp].cnpSage);
								botaoGravar.innerHTML = "Gravar PVP";
								
								linhaId.appendChild(botaoGravar);
								
								tr.appendChild(linhaId);
							 	
								//media lucro		
								var tempProfit = mgLucro;
								mediaLucro = mediaLucro+parseFloat(tempProfit);
								
								//insere linha
								tbody.appendChild(tr);
								
								//encontrou artigos sem pvp final?
								if(pvpVenda == 0 || pvpVenda ==0.0 || pvpVenda == 0.00){
									contadorNulos++;
									stringcontadorPvpFinal = stringcontadorPvpFinal+listaFamilia[temp].cnpSage+", ";
								}
								//encontrou artigos sem pvp sage?
								if(listaFamilia[temp].pvpSage == 0 || listaFamilia[temp].pvpSage == 0.0 || listaFamilia[temp].pvpSage == 0.000){
									contadorPvpSageNulo++;
									stringContadorPvpSage = stringContadorPvpSage+listaFamilia[temp].cnpSage+", ";
								}
								
								//encontrou artigos sem pcu?
								if(pcuExportar == 0 || pcuExportar == 0.0 || pcuExportar == 0.000){
									contadorPcuNulos++;
									stringContadorPcu = stringContadorPcu+listaFamilia[temp].cnpSage+", ";
								}
								
								
							}
								
							//insere body total de linhas
							tabela.appendChild(tbody);
							
							btnListar.disabled = false;
							btnExportar.disabled = false;
							btnaplicarGlobal.disabled = false;
							
							var mensagemUtilizador = document.getElementById("mensagens");
							var mensagemUtilizador2 = document.getElementById("mensagens2");
							var mensagemUtilizador3 = document.getElementById("mensagens3");
							
							if(contadorNulos!=0){
								mensagemUtilizador.innerHTML="<div class=\"alert alert-danger d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-exclamation-triangle\"></i><div> "+contadorNulos+" produto(s) sem PVP final para exportar.</div></div>";
							}
							
							if(contadorPcuNulos!=0){
								mensagemUtilizador2.innerHTML="<div class=\"alert alert-danger d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-exclamation-triangle\"></i><div> "+contadorPcuNulos+" produto(s) sem preço de custo no SAGE.</div></div>";
							}
							if(contadorPvpSageNulo!=0){
								mensagemUtilizador3.innerHTML="<div class=\"alert alert-danger d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-exclamation-triangle\"></i><div> "+contadorPvpSageNulo+" produto(s) sem PVP no SAGE.</div></div>";
							}
							
							checkAllClick = document.getElementById('checkAll');
							checkAll.addEventListener('click',allCheck);
							
							//tabela resumo+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
							var tabelaLinhaMedias =  document.getElementById('tabelaMedias');
							var tabelaMedias = document.createElement('table');
							tabelaMedias.setAttribute('class','table table-light table-striped table-sm align-middle');
							tabelaMedias.setAttribute('id','tabelaMedias');
							tabelaLinhaMedias.innerHTML = "";
							
							var theadMedias = document.createElement('thead');
							theadMedias.setAttribute('class','table-dark table-sm');
							
							tr = document.createElement('tr');
							
							//cabeçalhos da tabela
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Média da margem aplicada - %'));
							tr.appendChild(linhaId);
							
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Média da margem de lucro - €'));
							tr.appendChild(linhaId);
							
							theadMedias.appendChild(tr);
							tabelaMedias.appendChild(theadMedias);
							
							tabelaLinhaMedias.appendChild(tabelaMedias);
							
							var tbodyMedias = document.createElement('tbody');	
							var minhaTabela2 = document.getElementById('tabelaMedias');
							
							var minhaTabelaCompleta = document.getElementById('tabelaPcu');
							var linhasTabelaCompleta = minhaTabelaCompleta.rows.length;
							
							var linhasNumber = parseFloat(linhasTabelaCompleta)-1;
							
							mediaLucro = mediaLucro/linhasNumber;
							
							mediaMargem = mediaMargem/linhasNumber;
							
							//body da tabela
							
							tr = document.createElement('tr');
								
								//media lucro
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','center');
								linhaId.setAttribute('id','mediaMargemCell');
								linhaId.appendChild(document.createTextNode(mediaMargem.toFixed(2)));
								tr.appendChild(linhaId);
								//media margem
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','center');
								linhaId.setAttribute('id','mediaLucroCell');
								linhaId.appendChild(document.createTextNode(mediaLucro.toFixed(2)));
								tr.appendChild(linhaId);
								
								//insere linha
								tbodyMedias.appendChild(tr);
								//insere body total de linhas
							tabelaMedias.appendChild(tbodyMedias);
							
							btnAplicarCampanha.disabled = false;
							
							//atualiza os campos da margem-necessário caso os pvp's sejam os reais
							updateMargin();
							
							$("#exampleModal").modal('hide');
							
							//escutar se algum botao de gravar foi pressionado
							document.getElementById('tabelaPcu').addEventListener('click', function (event) {
							// Verifique se o clique ocorreu em um botão com a classe 'botaoAcao'
								if (event.target.classList.contains('botaoGravaPVP')) {
								  
								  // o id do botão corresponde ao cnp do produto
								  var idBotao = event.target.getAttribute('id'); 
								
								//lê o pvp qu vai ser gravado na bd do SAGE
								var novoPrecoComIva = event.target.closest('tr').querySelector('td:nth-child(9) input').value;
								
								//lê o iva aplicado ao produto para enviar o PVP sem iva para gravar no SAGE
								var ivaNovoPrecoString = event.target.closest('tr').querySelector('td:nth-child(7)').textContent;
								 
								  if (ivaNovoPrecoString == "23"){
									  ivaNovoPreco = 1.23;
								  }
								  else if (ivaNovoPrecoString == "6"){
									  ivaNovoPreco = 1.06;
								  }
								  else{
									  ivaNovoPreco = 1.23;
								  }
								  
								//preço sem Iva
								var novoPrecoSemIva = (novoPrecoComIva / ivaNovoPreco).toFixed(5);
								
								//ler a margem nova
								var margemNova = event.target.closest('tr').querySelector('td:nth-child(8) input').value;
								
								//debug
								//console.log("cnp:" + idBotao + "  PVP com iva:" + novoPrecoComIva + " PVP sem iva:" + novoPrecoSemIva + " Iva:" + ivaNovoPreco + " Margem:" + margemNova);
								
									//verifica os campos antes de gravar.
									if((novoPrecoSemIva <0 ) || (novoPrecoSemIva == '') || (novoPrecoSemIva == 0) || (margemNova < 0) || (margemNova == 0) || (margemNova == '') || (margemNova =='-Infinity')){
										
										mostrarMensagem("Verifique os campos MARGEM APLICADA e PVP c/IVA", "#FF6961");
										
									}
									else{
										
										//grava o novo pvp								
										gravaPVP(novoPrecoComIva,novoPrecoSemIva,margemNova,idBotao);
									}
									
								}
							});
								
						}
						else{
							$("#exampleModal").modal('hide');
							divProgresso = document.getElementById('progresso');
							divProgresso.innerHTML = "";
							console.log("NAO ENCONTRADO");
							var mensagemUtilizador = document.getElementById("mensagens");
							mensagemUtilizador.innerHTML="<div class=\"alert alert-danger d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-exclamation-triangle\"></i><div>Produto não encontrado.</div></div>";
						}
								
						})
						
						.catch(listaFamilia => {
							
							console.log("ERRO!");
						})
					
		}
		
	}
			
	
	function limparCampos(){
	 document.getElementById('pcuSemIva').value = "";
	 document.getElementById('pcuComIva').value = "";
	 document.getElementById('mgAplicada').value = "";
	 document.getElementById('pvpIva').value = "";
	 document.getElementById('lucro').value = "";	
		
	}
	
	function aplicaCampanha(){

		//ler dados tabela para fazer update do pvp e margem da campanha.tambem verifica preços abaixo do pcu.
		var minhaTabela = document.getElementById('tabelaPcu');
		var linhasTabela = minhaTabela.rows.length;
		var tipoCampanha = document.getElementById('selectCampanha').value;
		var valorCampanha = document.getElementById('descontoCampanha').value;
		var celulas = minhaTabela.rows.item(i).cells;
		//loop pelas linhas todas para "pegar" nos dados
		for(var i =1;i<linhasTabela;i++){
			
			celulas = minhaTabela.rows.item(i).cells;
			var pcu = parseFloat(celulas.item(5).innerHTML);
			var pvpAtual =0;
			var mgLucroAtual = 0;
			
			//var margemUpdate;// = document.getElementById("tempboxMargin"+i).value;
			pvpAtual = document.getElementById("pvpVenda"+i);
			var pvpAtualValor = pvpAtual.value;
			//pvpUpdate = celulas.item(5).innerHTML;
			var ivaUpdate=23;
			var pvpCampanha = 0;
			
			if (tipoCampanha =='percentagem' && valorCampanha!=0){
				pvpCampanha = pvpAtualValor - (pvpAtualValor*(valorCampanha/100));
				//update do pvp campanha
				document.getElementById("campanha"+i).innerHTML = pvpCampanha.toFixed(2);
				pvpCampanha=pvpCampanha.toFixed(2);
				//verifica se depois de aplicar campanha, o pvp não é inferior ao pcu
					if(pcu>pvpCampanha){
						celulas.item(10).style.backgroundColor = "red";
					}
	
					else{
						celulas.item(10).style.backgroundColor = "";
					}
			}
			
			else if (tipoCampanha =='valor' && valorCampanha!=0){
				
				pvpCampanha = pvpAtualValor - valorCampanha;
				//update do pvp campanha
				document.getElementById("campanha"+i).innerHTML = pvpCampanha.toFixed(2);
				
				pvpCampanha=pvpCampanha.toFixed(2);
					//verifica se depois de aplicar campanha, o pvp não é inferior ao pcu
					if(pcu>pvpCampanha){
						celulas.item(10).style.backgroundColor = "red";
					}
					
					else{
						celulas.item(10).style.backgroundColor = "";
					}
			}
			
			else if ((tipoCampanha =='valor' && valorCampanha==0) || (tipoCampanha =='percentagem' && valorCampanha==0) ){
					document.getElementById("campanha"+i).innerHTML= 0;
					celulas.item(10).style.backgroundColor = "";
			}
			else{
				document.getElementById("campanha"+i).innerHTML= 0;
					celulas.item(10).style.backgroundColor = "";
			}
		
		}	
	}
	
	function criaTabelaMargens(){
		
		var divTabelaMargens = document.getElementById("divTabelaMargens");
		
		selectMercado = document.getElementById("selectMercado");
		
		if(selectMercado.value == "Selecionar mercado..."){
			divTabelaMargens.innerHTML = "";
			btnListar.disabled = true;
			btnExportar.disabled = true;
			btnaplicarGlobal.disabled = true;
			document.getElementById("tabelaLinha").innerHTML = "";
			document.getElementById("mensagens").innerHTML = "";
			document.getElementById("mensagens2").innerHTML = "";
		document.getElementById("mensagens3").innerHTML = "";
		}
		
		else if(selectMercado.value == "ES"){
			
			btnListar.disabled = false;
			btnExportar.disabled = true;
			btnaplicarGlobal.disabled = true;
		document.getElementById("tabelaLinha").innerHTML = "";
			document.getElementById("mensagens").innerHTML = "";
			document.getElementById("mensagens2").innerHTML = "";
		document.getElementById("mensagens3").innerHTML = "";
		divTabelaMargens = document.getElementById("divTabelaMargens");
		divTabelaMargens.innerHTML = "";
		
		var tabelaMargens = document.createElement('table');
		tabelaMargens.setAttribute('class','table table-light table-striped table-sm align-middle');
		tabelaMargens.setAttribute('id','tabelaMargens');
		tabelaMargens.innerHTML = "";
		
		var theadMargens = document.createElement('thead');
		theadMargens.setAttribute('class','table-dark table-sm align-middle' );
							
			var trMargens = document.createElement('tr');
			var linhaMargens;
			
			//cabeçalhos da tabela de margens

			linhaMargens = document.createElement('td');
			linhaMargens.setAttribute('align','center');
			linhaMargens.appendChild(document.createTextNode('Patamar de preços de custo'));
			trMargens.appendChild(linhaMargens);
			
			linhaMargens = document.createElement('td');
			linhaMargens.setAttribute('align','center');
			linhaMargens.appendChild(document.createTextNode('Margem'));
			trMargens.appendChild(linhaMargens);
			
			
			theadMargens.appendChild(trMargens);
			tabelaMargens.appendChild(theadMargens);
			divTabelaMargens.appendChild(tabelaMargens);
			
			//linhas de patamares de margens por defeito
			var tbodyMargens = document.createElement('tbody');
			
			//patamar 1
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 0.01 a 1'));
			trMargens.appendChild(linhaMargens);
			var caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p1');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 50.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 2
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 1.01 a 2'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p2');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 50.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 3
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 2.01 a 3'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p3');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 50.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 4
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 3.01 a 4'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p4');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 40.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 5
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 4.01 a 5'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p5');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 40.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 6
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 5.01 a 10'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p6');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 30.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 7
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 10.01 a 15'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p7');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 30.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 8
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 15.01 a 20'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p8');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 30.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 9
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 20.01 a 25'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p9');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 30.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 10
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 25.01 a 30'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p10');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 30.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 11
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 30.01 a 35'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p11');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 30.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 12
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 35.01 a 40'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p12');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 30.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 13
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 40.01 a 45'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p13');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 30.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 14
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 45.01 a 50'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p14');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 30.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 15
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 50.01 a 100'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p15');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 30.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 16
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 100.01 a 150'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p16');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 25.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 17
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 150.01 a 200'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p17');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 25.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 18
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('Mais de 200.01'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p18');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 25.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
								
			//insere body total de margens
			tabelaMargens.appendChild(tbodyMargens);
			
		}
		
		else if(selectMercado.value == "PT"){
		
			btnListar.disabled = false;
			btnExportar.disabled = true;
			btnaplicarGlobal.disabled = true;
			document.getElementById("tabelaLinha").innerHTML = "";
			document.getElementById("mensagens").innerHTML = "";
			document.getElementById("mensagens2").innerHTML = "";
		document.getElementById("mensagens3").innerHTML = "";
		divTabelaMargens = document.getElementById("divTabelaMargens");
		divTabelaMargens.innerHTML = "";
		
		var tabelaMargens = document.createElement('table');
		tabelaMargens.setAttribute('class','table table-light table-striped table-sm align-middle');
		tabelaMargens.setAttribute('id','tabelaMargens');
		tabelaMargens.innerHTML = "";
		
		var theadMargens = document.createElement('thead');
		theadMargens.setAttribute('class','table-dark table-sm');
							
			var trMargens = document.createElement('tr');
			var linhaMargens;
			

			linhaMargens = document.createElement('td');
			linhaMargens.setAttribute('align','center');
			linhaMargens.appendChild(document.createTextNode('Patamar de preços de custo'));
			trMargens.appendChild(linhaMargens);
			
			linhaMargens = document.createElement('td');
			linhaMargens.setAttribute('align','center');
			linhaMargens.appendChild(document.createTextNode('Margem'));
			trMargens.appendChild(linhaMargens);
			
			
			theadMargens.appendChild(trMargens);
			tabelaMargens.appendChild(theadMargens);
			divTabelaMargens.appendChild(tabelaMargens);
			
			//linhas de patamares de margens por defeito
			var tbodyMargens = document.createElement('tbody');
			
			//patamar 1
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 0.01 a 1'));
			trMargens.appendChild(linhaMargens);
			var caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p1');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 50.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 2
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 1.01 a 2'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p2');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 50.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 3
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 2.01 a 3'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p3');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 50.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 4
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 3.01 a 4'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p4');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 40.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 5
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 4.01 a 5'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p5');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 40.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 6
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 5.01 a 10'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p6');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 30.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 7
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 10.01 a 15'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p7');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 25.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 8
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 15.01 a 20'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p8');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 22.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 9
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 20.01 a 25'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p9');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 18.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 10
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 25.01 a 30'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p10');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 16.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 11
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 30.01 a 35'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p11');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 15.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 12
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 35.01 a 40'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p12');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 15.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 13
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 40.01 a 45'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p13');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 15.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 14
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 45.01 a 50'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p14');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 15.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 15
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 50.01 a 100'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p15');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 13.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 16
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 100.01 a 150'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p16');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 10.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 17
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('De 150.01 a 200'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p17');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 10.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
			
			//patamar 18
			trMargens = document.createElement('tr');
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(document.createTextNode('Mais de 200.01'));
			trMargens.appendChild(linhaMargens);
			caixaTexto = document.createElement('input');
			caixaTexto.setAttribute('type','text');
			caixaTexto.setAttribute('id','p18');
			caixaTexto.setAttribute('class','cxMg');
			caixaTexto.value = 10.00;
			linhaMargens = document.createElement('td');
			linhaMargens.appendChild(caixaTexto);
			trMargens.appendChild(linhaMargens);
			//insere linha
			tbodyMargens.appendChild(trMargens);
								
			//insere body total de margens
			tabelaMargens.appendChild(tbodyMargens);
			
		}
		if(document.getElementById("listaMarcas").value == "Selecionar família..."){
			btnListar.disabled = true;
			btnExportar.disabled = true;
			btnaplicarGlobal.disabled = true;
			}
			else if(document.getElementById("listaMarcas").value != "Selecionar família..." && document.getElementById("selectMercado").value !="Selecionar mercado..."){
				btnListar.disabled = false;

			}
			
			else{
				btnListar.disabled = true;
			}
	}
	
	function exportaFamilia(){
		
		document.getElementById("mensagens").innerHTML = "";
		document.getElementById("mensagens2").innerHTML = "";
		document.getElementById("mensagens3").innerHTML = "";
		
		if(document.getElementById("listaMarcas").value == "Selecionar família..."){
			console.log("Seleccione uma família");
		}
		else{
		//mensagem ao utilizador
		divProgresso = document.getElementById("progresso");
		divProgresso.innerHTML = "A exportar dados... <div class=\"spinner-border\" role=\"status\"><span class=\"visually-hidden\">A exportar dados...</span></div>";
		
		//constroi o json para requisitar construção do excel com sku e pvp
		var minhaTabela = document.getElementById('tabelaPcu');
		var linhasTabela = minhaTabela.rows.length;
		var itemsPrices=[];
		var itemExport={};
		var contadorNulosExportar=0;
		var contadorChecked = 0;
		var listaString;
		var encodedString;
		//loop pelas linhas todas para "pegar" no sku e pvp
		for(var i =1;i<linhasTabela;i++){
			
			var celulas = minhaTabela.rows.item(i).cells;
			var pvpNew = document.getElementById("pvpVenda"+i).value;
			
			//encontrou artigos sem pvp final? não vai exportar o artigo.
				//if(celulas.item(8).innerHTML == 0 || celulas.item(8).innerHTML ==0.0 || celulas.item(8).innerHTML == 0.00){
				if(pvpNew == 0 || pvpNew == 0.0 || pvpNew == 0.00){
					contadorNulosExportar++;
				}
				
				else{
					
					//produto selecionado?
					var itemIsChecked = document.getElementById('selectItem'+i);
					
					if(itemIsChecked.checked){
						contadorChecked++;
						itemExport = {'sku':celulas.item(2).innerHTML,'pvp':pvpNew};//celulas.item(8).innerHTML
						itemsPrices.push(itemExport);
						listaString = JSON.stringify(itemsPrices);
						encodedString = btoa(listaString);
					}
					else{
						
					}
		
				}
			
		}
			
			if(contadorNulosExportar !=0){
				document.getElementById("mensagens").innerHTML = "<div class=\"alert alert-danger d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-exclamation-triangle\"></i><div> "+" "+contadorNulosExportar+" produto(s) sem PVP final não exportado. Exportado(s) "+contadorChecked+" selecionado(s) de "+(linhasTabela-1)+" produtos disponíveis.</div></div>";
			}
			else if(contadorChecked < (linhasTabela-1)){
				document.getElementById("mensagens").innerHTML ="<div class=\"alert alert-warning d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-exclamation-triangle\"></i><div> "+" Exportado(s) "+contadorChecked+" produto(s) selecionado(s) de"+(linhasTabela-1)+" produtos disponíveis.</div></div>";
			}
			else{
				document.getElementById("mensagens").innerHTML ="<div class=\"alert alert-success d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-check-circle-fill\"></i><div> "+" Exportado(s) "+contadorChecked+" produto(s) selecionado(s) de"+(linhasTabela-1)+" produtos disponíveis.</div></div>";
			}
		
		//debug
		console.log(itemsPrices);
		
		fetch ('exportarLista.php', {
						method: 'POST',
						headers:{
							'Content-Type': 'application/json',
							
						},
						body:JSON.stringify(itemsPrices),
					})//fetch
		.then(estadoPedido => estadoPedido.json())
							 
		.then(estadoPedido => {
			
				let urlExporta="printExcel.php";
				window.open(urlExporta,"_new");
				divProgresso.innerHTML = "";
		})
		
		.catch(estadoPedido => {
							
			console.log("Ocorreu um erro: "+estadoPedido);
		})	
		
		}
	}
	
	function exportaFamiliaCampanha(){
		
		document.getElementById("mensagens").innerHTML = "";
		document.getElementById("mensagens2").innerHTML = "";
		document.getElementById("mensagens3").innerHTML = "";
		
		if(document.getElementById("listaMarcas").value == "Selecionar família..."){
			console.log("Seleccione uma família");
		}
		else{
		//mensagem ao utilizador
		divProgresso = document.getElementById("progresso");
		divProgresso.innerHTML = "A exportar dados... <div class=\"spinner-border\" role=\"status\"><span class=\"visually-hidden\">A exportar dados...</span></div>";
		
		//constroi o json para requisitar construção do excel com sku e pvp
		var minhaTabela = document.getElementById('tabelaPcu');
		var linhasTabela = minhaTabela.rows.length;
		var itemsPrices=[];
		var itemExport={};
		var contadorNulosExportar=0;
		var contadorChecked = 0;
		var listaString;
		var encodedString;
		//loop pelas linhas todas para "pegar" no sku e pvp
		for(var i =1;i<linhasTabela;i++){
			
			var celulas = minhaTabela.rows.item(i).cells;
			var pvpNew = document.getElementById("campanha"+i).innerHTML;
			
			//encontrou artigos sem pvp final? não vai exportar o artigo.
				//if(celulas.item(8).innerHTML == 0 || celulas.item(8).innerHTML ==0.0 || celulas.item(8).innerHTML == 0.00){
				if(pvpNew == 0 || pvpNew == 0.0 || pvpNew == 0.00){
					contadorNulosExportar++;
				}
				
				else{
					
					//produto selecionado?
					var itemIsChecked = document.getElementById('selectItem'+i);
					
					if(itemIsChecked.checked){
						contadorChecked++;
						itemExport = {'sku':celulas.item(2).innerHTML,'pvp':pvpNew};//celulas.item(8).innerHTML
						itemsPrices.push(itemExport);
						listaString = JSON.stringify(itemsPrices);
						encodedString = btoa(listaString);
					}
					else{
						
					}
		
				}
			
		}
			
			if(contadorNulosExportar !=0){
				document.getElementById("mensagens").innerHTML = "<div class=\"alert alert-danger d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-exclamation-triangle\"></i><div> "+" "+contadorNulosExportar+" produto(s) sem PVP final não exportado. Exportado(s) "+contadorChecked+" selecionado(s) de "+(linhasTabela-1)+" produtos disponíveis.</div></div>";
			}
			else if(contadorChecked < (linhasTabela-1)){
				document.getElementById("mensagens").innerHTML ="<div class=\"alert alert-warning d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-exclamation-triangle\"></i><div> "+" Exportado(s) "+contadorChecked+" produto(s) selecionado(s) de "+(linhasTabela-1)+" produtos disponíveis.</div></div>";
			}
			else{
				document.getElementById("mensagens").innerHTML ="<div class=\"alert alert-success d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-check-circle-fill\"></i><div> "+" Exportado(s) "+contadorChecked+" produto(s) selecionado(s) de "+(linhasTabela-1)+" produtos disponíveis.</div></div>";
			}
		
		fetch ('exportarListaCampanha.php', {
						method: 'POST',
						headers:{
							'Content-Type': 'application/json',
							
						},
						body:JSON.stringify(itemsPrices),
					})//fetch
		.then(estadoPedido => estadoPedido.json())
							 
		.then(estadoPedido => {
			
				let urlExporta="printExcelCampanha.php";
				window.open(urlExporta,"_new");
				divProgresso.innerHTML = "";
		})
		
		.catch(estadoPedido => {
							
			console.log("Ocorreu um erro: "+estadoPedido);
		})	
		
		}
	}
	
	
	function listaFamilia(){
		let idFamilia = document.getElementById("listaMarcas");
		var valueFamilia = idFamilia.options[idFamilia.selectedIndex].value;
		
		var contadorNulos = 0;
		var contadorPcuNulos = 0;
		var contadorPvpSageNulo = 0;
		var valueStock = 0;
		var valueVenda = 0;
		
		document.getElementById("mensagens").innerHTML = "";
		document.getElementById("mensagens2").innerHTML = "";
		document.getElementById("mensagens3").innerHTML = "";
		
		//botoes radio de selecão de pvp
		var tabela_select = document.getElementById("flexRadioDefault1");
		var pvp_xml_select = document.getElementById("flexRadioDefault2");
		
		//botoes radio de selecao de stock
		var com_stock_radio = document.getElementById("filtro_com_stock");
		var sem_stock_radio = document.getElementById("filtro_sem_stock");
		var tudo_stock_radio = document.getElementById("filtro_tudo_stock");
		
		//botoes radio de selecao de vendas
		var com_venda_radio = document.getElementById("filtro_com_venda");
		var sem_venda_radio = document.getElementById("filtro_sem_venda");
		var tudo_venda_radio = document.getElementById("filtro_tudo_venda");
		
		//pedido do filtro stock
		if(com_stock_radio.checked){
			valueStock = 1;
		}
		else if(sem_stock_radio.checked){
			valueStock = 0;
		}
		else if(tudo_stock_radio.checked){
			valueStock = 2;
		}
		else{
			
		}
		
		//pedido do filtro venda
		if(com_venda_radio.checked){
			valueVenda = 1;
		}
		else if(sem_venda_radio.checked){
			valueVenda = 0;
		}
		else if(tudo_venda_radio.checked){
			valueVenda = 2;
		}
		else{
			
		}
		
		
		//dados para pedir info a base de dados
		var pedidoListagem={"familia":valueFamilia,"stock":valueStock,"venda":valueVenda};					
			
			console.log(pedidoListagem);
			
		if (document.getElementById("listaMarcas").value == "Selecionar família..." || document.getElementById("selectMercado").value =="Selecionar mercado..."){
			
			btnListar.disabled = true;
			btnExportar.disabled = true;
			btnaplicarGlobal.disabled = true;
		}
		else{
			
		var divProgresso = document.getElementById("progresso");
		divProgresso.innerHTML = "A efetuar pedido à base de dados... <div class=\"spinner-border\" role=\"status\"><span class=\"visually-hidden\">A efetuar pedido à base de dados...</span></div>";
		$("#exampleModal").modal('show');
		
		fetch ('listFamily.php', {
						method: 'POST',
						headers:{
							'Content-Type': 'application/json',
							
						},
						body:JSON.stringify(pedidoListagem),
						
						
					})//fetch
		
				
						.then(listaFamilia => listaFamilia.json())
							 
						.then(listaFamilia => {	
							
							divProgresso = document.getElementById('progresso');
							divProgresso.innerHTML = "";
							$("#exampleModal").modal('hide');
							
							var tr,linhaId,cnp,descricao,pcuSage,pvpSage,margem=25,pvpVenda,mgLucro,blocoEntrada,temp2,temp3,caixaMargem,tempText,caixaPvp;
							var stringContadorPcu="",stringContadorPvpSage="",stringcontadorPvpFinal="";
							var mediaMargem = 0;
							var mediaLucro = 0;
							var pvpReal = "";
							
							//validades
							var validade1="";
							var validade2="";
							var validade3="";
							
							var tabelaLinha =  document.getElementById('tabelaLinha');
							var tabela = document.createElement('table');
							tabela.setAttribute('class','table table-light align-middle'); //table-striped
							tabela.setAttribute('id','tabelaPcu');
							tabelaLinha.innerHTML = "";
							
							var thead = document.createElement('thead');
							thead.setAttribute('class','table-dark table-sm');
							
							tr = document.createElement('tr');
							
							//cabeçalhos da tabela
							
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('#'));
							tr.appendChild(linhaId);
							//cria um check box para selecionar todos ou não
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							var checkAll = document.createElement('input');
							checkAll.setAttribute('class','form-check-input');
							checkAll.setAttribute('type','checkbox');
							checkAll.setAttribute('id','selectAll');
							checkAll.setAttribute('checked','true');
							linhaId.appendChild(checkAll);
							tr.appendChild(linhaId);
							
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('SKU'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Descrição'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('PCU Sage s/IVA'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('PCU Sage c/IVA'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Taxa de IVA'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Margem aplicada'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('PVP c/IVA'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Lucro'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('PVP campanha'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Stock'));
							linhaId.setAttribute('class','class_stock');
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Última venda'));
							linhaId.setAttribute('class','class_vendas');
							tr.appendChild(linhaId);
							//validades
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							
							linhaId.appendChild(document.createTextNode('Validade 1'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							
							linhaId.appendChild(document.createTextNode('Validade 2'));
							tr.appendChild(linhaId);
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');

							linhaId.appendChild(document.createTextNode('Validade 3'));
							tr.appendChild(linhaId);
							
							//botões de gravar preço
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							
							var botaoGravarSelecionados = document.createElement('button');
							botaoGravarSelecionados.setAttribute('class','btn btn-danger');
							botaoGravarSelecionados.setAttribute('id','btnGravarMassa');
							botaoGravarSelecionados.innerHTML = "Gravar PVP selecionados";
							linhaId.appendChild(botaoGravarSelecionados);
							tr.appendChild(linhaId);
							
							thead.appendChild(tr);
							tabela.appendChild(thead);
							
							tabelaLinha.appendChild(tabela);
							
							var tbody = document.createElement('tbody');	
							
							//ler patamares de margem
								var p1 = document.getElementById('p1').value;
								var p2 = document.getElementById('p2').value;
								var p3 = document.getElementById('p3').value;
								var p4 = document.getElementById('p4').value;
								var p5 = document.getElementById('p5').value;
								var p6 = document.getElementById('p6').value;
								var p7 = document.getElementById('p7').value;
								var p8 = document.getElementById('p8').value;
								var p9 = document.getElementById('p9').value;
								var p10 = document.getElementById('p10').value;
								var p11 = document.getElementById('p11').value;
								var p12 = document.getElementById('p12').value;
								var p13 = document.getElementById('p13').value;
								var p14 = document.getElementById('p14').value;
								var p15 = document.getElementById('p15').value;
								var p16 = document.getElementById('p16').value;
								var p17 = document.getElementById('p17').value;
								var p18 = document.getElementById('p18').value;
							
							for(let temp=0;temp<listaFamilia.length;temp++){
								
								tr = document.createElement('tr');
								
								//id da linha
								linhaId = document.createElement('td');
								linhaId.appendChild(document.createTextNode(temp+1));
								tr.appendChild(linhaId);
								//checkboxes
								//cria um check box para selecionar todos ou não
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','center');
								var checkItem = document.createElement('input');
								checkItem.setAttribute('class','form-check-input');
								checkItem.setAttribute('type','checkbox');
								checkItem.setAttribute('name','checkThid');
								checkItem.setAttribute('checked','true');
								checkItem.setAttribute('id','selectItem'+(temp+1));
								linhaId.appendChild(checkItem);
								tr.appendChild(linhaId);
								
								//cnp sage - clicar em cima cnp para chamar a função de ver preços da concorrência. ao fazer mouse hover aparecer o balao-"clicar para ver preços outras lojas"
								linhaId = document.createElement('td');
								linhaId.setAttribute('data-bs-toggle','tooltip');
								linhaId.setAttribute('data-bs-placement','top');
								linhaId.setAttribute('title','Clique para ver as outras lojas');
								
								var linkCnp = document.createElement('a');
								linkCnp.style.cursor = 'pointer';
								linkCnp.style.color = 'blue';
								//linkCnp.href = listaFamilia[temp].cnpSage; // Set the URL for the link
								linkCnp.textContent = listaFamilia[temp].cnpSage; // Set the link text

								linhaId.appendChild(linkCnp);
								
								linkCnp.addEventListener('click', function(event) {
								  event.preventDefault(); // Prevent the default behavior of navigating to the URL
								  var cnpPesquisa = listaFamilia[temp].cnpSage;
								  precosConcorrencia(cnpPesquisa,listaFamilia[temp].nomeSage);
								});
										
								//linhaId.appendChild(document.createTextNode(listaFamilia[temp].cnpSage));
								tr.appendChild(linhaId);
							
								
								//nome sage
								linhaId = document.createElement('td');
								linhaId.appendChild(document.createTextNode(listaFamilia[temp].nomeSage));
								tr.appendChild(linhaId);
								//pcu sage sem iva
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.appendChild(document.createTextNode(listaFamilia[temp].pcuSage));
								tr.appendChild(linhaId);
								
								//IVA
								taxaIvaSage = listaFamilia[temp].taxaIvaSage;
								
								if(taxaIvaSage==1){
									taxaIvaSage=23;
									iva=23;
								}
								else if(taxaIvaSage==3){
									taxaIvaSage=6;
									iva=6;
								}
								else{
									taxaIvaSage=23;
									iva=23;
								}
								
								//pcu sage com iva
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.appendChild(document.createTextNode(((listaFamilia[temp].pcuSage)*((taxaIvaSage/100)+1)).toFixed(2)));
								tr.appendChild(linhaId);
								
								//iva
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								
								//escreve a taxa do iva
								linhaId.appendChild(document.createTextNode(taxaIvaSage));
								tr.appendChild(linhaId);
								
								//margem aplicada
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								
								var margemAplicar = 25;
								
								//preço custo
								var pcuExportar = listaFamilia[temp].pcuSage;
								var tempboxMargin=0;
								//definir qual margem a aplicar consoante patamar de pcu
								if (pcuExportar>=0.01 && pcuExportar<=1){
									margemAplicar = p1;
									tempboxMargin = "margemP1"
								}
								else if (pcuExportar>=1.01 && pcuExportar<=2){
									margemAplicar = p2;
									tempboxMargin = "margemP2"
								}
								else if (pcuExportar>=2.01 && pcuExportar<=3){
									margemAplicar = p3;
									tempboxMargin = "margemP3"
								}
								else if (pcuExportar>=3.01 && pcuExportar<=4){
									margemAplicar = p4;
									tempboxMargin = "margemP4"
								}
								else if (pcuExportar>=4.01 && pcuExportar<=5){
									margemAplicar = p5;
									tempboxMargin = "margemP5"
								}
								else if (pcuExportar>=5.01 && pcuExportar<=10){
									margemAplicar = p6;
									tempboxMargin = "margemP6"
								}
								else if (pcuExportar>=10.01 && pcuExportar<=15){
									margemAplicar = p7;
									tempboxMargin = "margemP7"
								}
								else if (pcuExportar>=15.01 && pcuExportar<=20){
									margemAplicar = p8;
									tempboxMargin = "margemP8"
								}
								else if (pcuExportar>=20.01 && pcuExportar<=25){
									margemAplicar = p9;
									tempboxMargin = "margemP9"
								}
								else if (pcuExportar>=25.01 && pcuExportar<=30){
									margemAplicar = p10;
									tempboxMargin = "margemP10"
								}
								else if (pcuExportar>=30.01 && pcuExportar<=35){
									margemAplicar = p11;
									tempboxMargin = "margemP11"
								}
								else if (pcuExportar>=35.01 && pcuExportar<=40){
									margemAplicar = p12;
									tempboxMargin = "margemP12"
								}
								else if (pcuExportar>=40.01 && pcuExportar<=45){
									margemAplicar = p13;
									tempboxMargin = "margemP13"
								}
								else if (pcuExportar>=45.01 && pcuExportar<=50){
									margemAplicar = p14;
									tempboxMargin = "margemP14"
								}
								else if (pcuExportar>=50.01 && pcuExportar<=100){
									margemAplicar = p15;
									tempboxMargin = "margemP15"
								}
								else if (pcuExportar>=100.01 && pcuExportar<=150){
									margemAplicar = p16;
									tempboxMargin = "margemP16"
								}
								else if (pcuExportar>=150.01 && pcuExportar<=200){
									margemAplicar = p17;
									tempboxMargin = "margemP17"
								}
								else if (pcuExportar>=200.01){
									margemAplicar = p18;
									tempboxMargin = "margemP18"
								}
								else {
									margemAplicar = 25;
									tempboxMargin = "margem25"
								}
								
								//escreve margem aplicada
								caixaMargem = document.createElement('input');
								caixaMargem.setAttribute('type','text');
								caixaMargem.setAttribute('class','cxMg');
								caixaMargem.setAttribute('name',tempboxMargin);
								caixaMargem.setAttribute('id',"tempboxMargin"+(temp+1));
								caixaMargem.value = margemAplicar;
								
								caixaMargem.addEventListener("change", updatePvp);
								linhaId.appendChild(caixaMargem);
								tr.appendChild(linhaId);
								
									//media margem
									var tempValue = caixaMargem.value;
									mediaMargem = mediaMargem+parseFloat(tempValue);
								
								
								//pvp venda com iva e margem
								
									//verificar se é para utilizar a tabela por defeito ou ler diretamente o pvp atual e calcular as margens
								
									if(pvp_xml_select.checked){
										
										//debug
										//console.log(listaFamilia[temp].skuXML[0] + " - "+ listaFamilia[temp].pvpReal[0] + "\n");
									
										var string_pvp_xml = listaFamilia[temp].pvpReal[0];
										pvpVenda = parseFloat(string_pvp_xml.replace(" EUR",""));
										pvpVenda = pvpVenda.toFixed(2);
										
										if (pvpVenda!=0){}
										else{
											pvpVenda=0.0;
										}
									
									}
									else{
										pvpVenda = (listaFamilia[temp].pcuSage/(1-(margemAplicar/100)))*(1+(iva/100));
										pvpVenda = pvpVenda.toFixed(2);
									}
								
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								
								caixaPvp = document.createElement('input');
								caixaPvp.setAttribute('type','text');
								caixaPvp.setAttribute('class','cxMg');
								caixaPvp.setAttribute('name',"pvpVenda"+(temp+1));
								caixaPvp.setAttribute('id',"pvpVenda"+(temp+1));
								caixaPvp.value = pvpVenda;
								
								linhaId.appendChild(caixaPvp);
								tr.appendChild(linhaId);
								
								
								caixaPvp.addEventListener("change", updateMargin);
								
								//margem de lucro
								mgLucro = pvpVenda-(pcuExportar+(pvpVenda-(pvpVenda/((taxaIvaSage/100)+1))));
								
								mgLucro = mgLucro.toFixed(2);
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.appendChild(document.createTextNode(mgLucro));
								tr.appendChild(linhaId);
								
								
								//valor por defeito de campanha =0
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.setAttribute('id','campanha'+(temp+1));
								linhaId.appendChild(document.createTextNode("0"));
								tr.appendChild(linhaId);
								
								//stock em loja e farmacia
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.innerHTML="Loja: "+listaFamilia[temp].stockSageLoja[0]+"<br>Farmácia: "+listaFamilia[temp].stockSageFarmacia[0];
								tr.appendChild(linhaId);
								
								var itemDate = listaFamilia[temp].lastDateSage;
								
								var sales="";
								
								if(itemDate != null){

									var dataUltimaVenda = (itemDate.date).split(' ',1);
									
									var sales = (dataUltimaVenda[0]);
								}
								else{
									sales = "Sem vendas.";
								}
								
								//data da ultima venda
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.appendChild(document.createTextNode(sales));
								tr.appendChild(linhaId);
								
								//validades
							
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.setAttribute('class','validade1Cor');
								linhaId.appendChild(document.createTextNode(listaFamilia[temp].validade1));
								tr.appendChild(linhaId);
								
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.setAttribute('class','validade2Cor');
								linhaId.appendChild(document.createTextNode(listaFamilia[temp].validade2));
								tr.appendChild(linhaId);
								
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','right');
								linhaId.setAttribute('class','validade3Cor');
								linhaId.appendChild(document.createTextNode(listaFamilia[temp].validade3));
								tr.appendChild(linhaId);
								
								//botões de gravar preço
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','center');
								
								var botaoGravar = document.createElement('button');
								botaoGravar.setAttribute('class','btn btn-primary botaoGravaPVP');
								botaoGravar.setAttribute('id',listaFamilia[temp].cnpSage);
								botaoGravar.innerHTML = "Gravar PVP";
								
								linhaId.appendChild(botaoGravar);
								
								tr.appendChild(linhaId);
						
								//media lucro		
								var tempProfit = mgLucro;
								mediaLucro = mediaLucro+parseFloat(tempProfit);
								
								//insere linha
								tbody.appendChild(tr);
								
								//encontrou artigos sem pvp final?
								if(pvpVenda == 0 || pvpVenda ==0.0 || pvpVenda == 0.00){
									contadorNulos++;
									stringcontadorPvpFinal = stringcontadorPvpFinal+listaFamilia[temp].cnpSage+", ";
								}
								//encontrou artigos sem pvp sage?
								if(listaFamilia[temp].pvpSage == 0 || listaFamilia[temp].pvpSage == 0.0 || listaFamilia[temp].pvpSage == 0.000){
									contadorPvpSageNulo++;
									stringContadorPvpSage = stringContadorPvpSage+listaFamilia[temp].cnpSage+", ";
								}
								
								//encontrou artigos sem pcu?
								if(pcuExportar == 0 || pcuExportar == 0.0 || pcuExportar == 0.000){
									contadorPcuNulos++;
									stringContadorPcu = stringContadorPcu+listaFamilia[temp].cnpSage+", ";
								}
			
							}
								
							//insere body total de linhas
							tabela.appendChild(tbody);
							
							btnListar.disabled = false;
							btnExportar.disabled = false;
							btnaplicarGlobal.disabled = false;
							
							var mensagemUtilizador = document.getElementById("mensagens");
							var mensagemUtilizador2 = document.getElementById("mensagens2");
							var mensagemUtilizador3 = document.getElementById("mensagens3");
							
							if(contadorNulos!=0){
								mensagemUtilizador.innerHTML="<div class=\"alert alert-danger d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-exclamation-triangle\"></i><div> "+contadorNulos+" produto(s) sem PVP final para exportar.</div></div>";
							}
							
							if(contadorPcuNulos!=0){
								mensagemUtilizador2.innerHTML="<div class=\"alert alert-danger d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-exclamation-triangle\"></i><div> "+contadorPcuNulos+" produto(s) sem preço de custo no SAGE.</div></div>";
							}
							if(contadorPvpSageNulo!=0){
								mensagemUtilizador3.innerHTML="<div class=\"alert alert-danger d-flex align-items-center\" role=\"alert\"><i class=\"bi bi-exclamation-triangle\"></i><div> "+contadorPvpSageNulo+" produto(s) sem PVP no SAGE.</div></div>";
							}
							
							checkAllClick = document.getElementById('checkAll');
							checkAll.addEventListener('click',allCheck);
							
							//tabela resumo+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
							var tabelaLinhaMedias =  document.getElementById('tabelaMedias');
							var tabelaMedias = document.createElement('table');
							tabelaMedias.setAttribute('class','table table-light table-striped table-sm align-middle');
							tabelaMedias.setAttribute('id','tabelaMedias');
							tabelaLinhaMedias.innerHTML = "";
							
							var theadMedias = document.createElement('thead');
							theadMedias.setAttribute('class','table-dark table-sm');
							
							tr = document.createElement('tr');
							
							//cabeçalhos da tabela
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Média da margem aplicada - %'));
							tr.appendChild(linhaId);
							
							linhaId = document.createElement('td');
							linhaId.setAttribute('align','center');
							linhaId.appendChild(document.createTextNode('Média da margem de lucro - €'));
							tr.appendChild(linhaId);
							
							theadMedias.appendChild(tr);
							tabelaMedias.appendChild(theadMedias);
							
							tabelaLinhaMedias.appendChild(tabelaMedias);
							
							var tbodyMedias = document.createElement('tbody');	
							var minhaTabela2 = document.getElementById('tabelaMedias');
							
							var minhaTabelaCompleta = document.getElementById('tabelaPcu');
							var linhasTabelaCompleta = minhaTabelaCompleta.rows.length;
							
							var linhasNumber = parseFloat(linhasTabelaCompleta)-1;
							
							mediaLucro = mediaLucro/linhasNumber;
							
							mediaMargem = mediaMargem/linhasNumber;
							
							//body da tabela
							
							tr = document.createElement('tr');
								
								//media lucro
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','center');
								linhaId.setAttribute('id','mediaMargemCell');
								linhaId.appendChild(document.createTextNode(mediaMargem.toFixed(2)));
								tr.appendChild(linhaId);
								//media margem
								linhaId = document.createElement('td');
								linhaId.setAttribute('align','center');
								linhaId.setAttribute('id','mediaLucroCell');
								linhaId.appendChild(document.createTextNode(mediaLucro.toFixed(2)));
								tr.appendChild(linhaId);
								
								//insere linha
								tbodyMedias.appendChild(tr);
								//insere body total de linhas
							tabelaMedias.appendChild(tbodyMedias);
							
							btnAplicarCampanha.disabled = false;
							
							//atualiza os campos da margem-necessário caso os pvp's sejam os reais
							updateMargin();
							
							//escutar o botao de gravar em massa
							var btnGravarMassa = document.getElementById('btnGravarMassa');
							btnGravarMassa.addEventListener("click", gravaPvpMassa);
							
							
							//escutar se algum botao de gravar foi pressionado
							document.getElementById('tabelaPcu').addEventListener('click', function (event) {
							// Verifique se o clique ocorreu em um botão com a classe 'botaoAcao'
								if (event.target.classList.contains('botaoGravaPVP')) {
								  
								  // o id do botão corresponde ao cnp do produto
								  var idBotao = event.target.getAttribute('id'); 
								
								//lê o pvp qu vai ser gravado na bd do SAGE
								var novoPrecoComIva = event.target.closest('tr').querySelector('td:nth-child(9) input').value;
								
								//lê o iva aplicado ao produto para enviar o PVP sem iva para gravar no SAGE
								var ivaNovoPrecoString = event.target.closest('tr').querySelector('td:nth-child(7)').textContent;
								 
								  if (ivaNovoPrecoString == "23"){
									  ivaNovoPreco = 1.23;
								  }
								  else if (ivaNovoPrecoString == "6"){
									  ivaNovoPreco = 1.06;
								  }
								  else{
									  ivaNovoPreco = 1.23;
								  }
								  
								//preço sem Iva
								var novoPrecoSemIva = (novoPrecoComIva / ivaNovoPreco).toFixed(5);
								
								//ler a margem nova
								var margemNova = event.target.closest('tr').querySelector('td:nth-child(8) input').value;
								
								//debug
								//console.log("cnp:" + idBotao + "  PVP com iva:" + novoPrecoComIva + " PVP sem iva:" + novoPrecoSemIva + " Iva:" + ivaNovoPreco + " Margem:" + margemNova);
								
									//verifica os campos antes de gravar.
									if((novoPrecoSemIva <0 ) || (novoPrecoSemIva == '') || (novoPrecoSemIva == 0) || (margemNova < 0) || (margemNova == 0) || (margemNova == '') || (margemNova =='-Infinity')){
										
										mostrarMensagem("Verifique os campos MARGEM APLICADA e PVP c/IVA", "#FF6961");
										
									}
									else{
										
										//grava o novo pvp								
										gravaPVP(novoPrecoComIva,novoPrecoSemIva,margemNova,idBotao);
									}
						
								}
							});
						})
						
						.catch(listaFamilia => {
							$("#exampleModal").modal('hide');
							//console.log("ERRO!");
							console.log(listaFamilia);
						})
					
		}
		
	}
	
	function allCheck(){
		var minhaTabela = document.getElementById('tabelaPcu');
		var linhasTabela = minhaTabela.rows.length;
		
		
			for(var t = 1; t<linhasTabela; t++){
				allCheckBoxes = document.getElementById('selectItem'+t);
				if(allCheckBoxes.checked == true){
				allCheckBoxes.checked = false;
				}
				else if(allCheckBoxes.checked == false){
					allCheckBoxes.checked = true;
				}
				else{}
			}
			
	}
	
	
	function updateMargin(){
		//ler dados tabela para fazer update das margens Mesmo alterando apenas um dos pvp final, vai recalcular a tabela total.
		var minhaTabela = document.getElementById('tabelaPcu');
		var linhasTabela = minhaTabela.rows.length;
		var valorNovoMargem = 0;
		var valorNovoLucro = 0;
		
		//loop pelas linhas todas para "pegar" no pvp final, preço de custo e atualizar margem e lucro
		for(var i =1;i<linhasTabela;i++){
			
			var celulas = minhaTabela.rows.item(i).cells;
			var pcuUpdate = celulas.item(4).innerHTML;
			var pvpUpdate =0;
			var mgLucroUpdate = 0;
			
			//teste com iva da celula
			var ivaCelula = celulas.item(6).innerHTML;
		
			var margemUpdate;// = document.getElementById("tempboxMargin"+i).value;
			pvpUpdate = document.getElementById("pvpVenda"+i).value;
			//pvpUpdate = celulas.item(5).innerHTML;
			//var ivaUpdate=iva;
			
			//verifica se os valores são 0
			if(pvpUpdate != "0"){
				
			}
			else{
				pvpUpdate = "0";
			}
			
			if(pcuUpdate != "0"){
				
			}
			else{
				pcuUpdate = "0";
			}
			
			//update da margem aplicada
			margemUpdate = ((pvpUpdate/((ivaCelula/100)+1))-pcuUpdate)/((pvpUpdate/((ivaCelula/100)+1)))*100;
			
			margemUpdate = margemUpdate.toFixed(2);
			var margemUpdateBox = document.getElementById("tempboxMargin"+i)
			margemUpdateBox.value = margemUpdate;
			//celulas.item(7).innerHTML = margemUpdate;
			//update da margem lucro
			mgLucroUpdate = parseFloat(pvpUpdate)-(parseFloat(pcuUpdate)+(parseFloat(pvpUpdate)-(parseFloat(pvpUpdate)/((ivaCelula/100)+1))));

			mgLucroUpdate =mgLucroUpdate.toFixed(2) ;
			
			celulas.item(9).innerHTML = mgLucroUpdate;
			celulas.item(10).innerHTML = "0";
			celulas.item(10).style.backgroundColor="";
			
			//atualiza as médias
				
				var margemNovaFloat = parseFloat(margemUpdate);
				valorNovoMargem =valorNovoMargem+margemNovaFloat;
				
				var lucroNovoFloat = parseFloat(mgLucroUpdate);
				valorNovoLucro =valorNovoLucro+lucroNovoFloat;
				
		}
				var celulaMargem = document.getElementById("mediaMargemCell");
				var celulaLucro = document.getElementById("mediaLucroCell");
				celulaMargem.innerHTML = (valorNovoMargem.toFixed(2)/(linhasTabela-1)).toFixed(2);
				celulaLucro.innerHTML = (valorNovoLucro.toFixed(2)/(linhasTabela-1)).toFixed(2);
	
	}
		
	function updatePvp(){
		//ler dados tabela para fazer update dos PVP's. Mesmo alterando apenas uma das margens, vai recalcular a tabela total.
		var minhaTabela = document.getElementById('tabelaPcu');
		var linhasTabela = minhaTabela.rows.length;
		
		var valorNovoMargem2 = 0;
		var valorNovoLucro2 = 0;
		
		//loop pelas linhas todas para "pegar" na margem, preço de custo e atualizar pvp de venda e lucro
		for(var i =1;i<linhasTabela;i++){
			
			var celulas = minhaTabela.rows.item(i).cells;
			var pcuUpdate = celulas.item(4).innerHTML;
			var pvpUpdate =0;
			var mgLucroUpdate = 0;
			var margemUpdate = document.getElementById("tempboxMargin"+i).value;
			
			//teste com iva da celula
			var ivaCelula = celulas.item(6).innerHTML;
			
			//update do pvp
			pvpVendaUpdate = (pcuUpdate/(1-(margemUpdate/100)))*(1+(ivaCelula/100));
		
			pvpVendaUpdate = pvpVendaUpdate.toFixed(2);
			var pvpUpdateNew = document.getElementById("pvpVenda"+i);
			pvpUpdateNew.value = pvpVendaUpdate;
			//celulas.item(8).innerHTML = pvpVendaUpdate;
			//update da margem lucro
			mgLucroUpdate = parseFloat(pvpVendaUpdate)-(parseFloat(pcuUpdate)+(parseFloat(pvpVendaUpdate)-(parseFloat(pvpVendaUpdate)/((ivaCelula/100)+1)))); // ((ivaCelula/100)+1)
			mgLucroUpdate =mgLucroUpdate.toFixed(2) ;
			
			celulas.item(9).innerHTML = mgLucroUpdate;
			celulas.item(10).innerHTML = "0";
			celulas.item(10).style.backgroundColor="";
			
			//atualiza as médias
				
				var margemNovaFloat2 = parseFloat(margemUpdate);
				valorNovoMargem2 =valorNovoMargem2+margemNovaFloat2;
				
				var lucroNovoFloat2 = parseFloat(mgLucroUpdate);
				valorNovoLucro2 =valorNovoLucro2+lucroNovoFloat2;
			
		}
		
				var celulaMargem = document.getElementById("mediaMargemCell");
				var celulaLucro = document.getElementById("mediaLucroCell");
				celulaMargem.innerHTML = (valorNovoMargem2.toFixed(2)/(linhasTabela-1)).toFixed(2);
				celulaLucro.innerHTML = (valorNovoLucro2.toFixed(2)/(linhasTabela-1)).toFixed(2);
	}

		function aplicaMargemGlobal(){
			//ler dados tabela para fazer update dos PVP's. Mesmo alterando apenas uma das margens, vai recalcular a tabela total.
			var minhaTabela = document.getElementById('tabelaPcu');
			var linhasTabela = minhaTabela.rows.length;
			
			var valorNovoMargem3 = 0;
			var valorNovoLucro3 = 0;
		
			//loop pelas linhas todas para "pegar" na margem, preço de custo e atualizar pvp de venda e lucro
			for(var i =1;i<linhasTabela;i++){
				
				var celulas = minhaTabela.rows.item(i).cells;
				var pcuUpdate = celulas.item(4).innerHTML;
				var pvpUpdate =0;
				var mgLucroUpdate = 0;
				var margemUpdate = document.getElementById("margemGlobal").value;
				var ivaUpdate=iva;
				document.getElementById("tempboxMargin"+i).value = margemUpdate;
				
				//teste com iva da celula
				var ivaCelula = celulas.item(6).innerHTML;
			
				//update do pvp
				pvpVendaUpdate = (pcuUpdate/(1-(margemUpdate/100)))*(1+(ivaCelula/100));
			
				pvpVendaUpdate = pvpVendaUpdate.toFixed(2);
				var objPvpVendaUpdate = document.getElementById("pvpVenda"+i);
				objPvpVendaUpdate.value = pvpVendaUpdate;
				//celulas.item(8).innerHTML = pvpVendaUpdate;
				//update da margem lucro
				mgLucroUpdate = parseFloat(pvpVendaUpdate)-(parseFloat(pcuUpdate)+(parseFloat(pvpVendaUpdate)-(parseFloat(pvpVendaUpdate)/((ivaCelula/100)+1))));
				mgLucroUpdate =mgLucroUpdate.toFixed(2) ;
				
				celulas.item(9).innerHTML = mgLucroUpdate;
				celulas.item(10).innerHTML = "0";
				celulas.item(10).style.backgroundColor="";
				
				//atualiza as médias
				
				var margemNovaFloat3 = parseFloat(margemUpdate);
				valorNovoMargem3 =valorNovoMargem3+margemNovaFloat3;
				
				var lucroNovoFloat3 = parseFloat(mgLucroUpdate);
				valorNovoLucro3 =valorNovoLucro3+lucroNovoFloat3;
			
			}
			
				var celulaMargem = document.getElementById("mediaMargemCell");
				var celulaLucro = document.getElementById("mediaLucroCell");
				celulaMargem.innerHTML = (valorNovoMargem3.toFixed(2)/(linhasTabela-1)).toFixed(2);
				celulaLucro.innerHTML = (valorNovoLucro3.toFixed(2)/(linhasTabela-1)).toFixed(2);
			
		}
		
		function escrevePcuIva(){
		var pcuValor = document.getElementById('pcuSemIva').value;
		 var ivaValor = document.getElementById('txIva').value;
		var pcuValorIva = (pcuValor*((ivaValor/100)+1)).toFixed(2);
		document.getElementById('pcuComIva').value = pcuValorIva;
	}
	
	function simulaPvp(){
		  var pcuValor = document.getElementById('pcuSemIva').value;
		  var pcuValorIva = document.getElementById('pcuComIva').value;
		  var ivaValor = document.getElementById('txIva').value;
		  var margemValor = document.getElementById('mgAplicada').value;
		  var pvpValor = document.getElementById('pvpIva').value;
		  var lucroValor = document.getElementById('lucro').value;
		  
		  //PVP vazio
		  if (pvpValor=="" && pcuValor!="" && ivaValor!="" && margemValor!=""){
			   
			   //calcula o PVP
			   var pvpVendaTemp = (pcuValor/(1-(margemValor/100)))*(1+(ivaValor/100));
			   pvpVendaTemp = pvpVendaTemp.toFixed(2);
			   document.getElementById('pvpIva').value = pvpVendaTemp;
			 
			   //calcula o lucro
			  var mgLucroTemp = parseFloat(pvpVendaTemp)-(parseFloat(pcuValor)+(parseFloat(pvpVendaTemp)-(parseFloat(pvpVendaTemp)/((ivaValor/100)+1))));
			   mgLucroTemp = mgLucroTemp.toFixed(2);
			   document.getElementById('lucro').value = mgLucroTemp;
		  }
		  
		  //margem vazia
		  else if (pvpValor!="" && pcuValor!="" && ivaValor!="" && margemValor==""){
			   
			   //calcula a margem de lucro em %
			   var margemNova = ((pvpValor/((ivaValor/100)+1))-pcuValor)/((pvpValor/((ivaValor/100)+1)))*100;
			   margemNova = margemNova.toFixed(2);
			   document.getElementById('mgAplicada').value = margemNova;
			   
			   //calcula o lucro
			   var mgLucroTemp = parseFloat(pvpValor)-(parseFloat(pcuValor)+(parseFloat(pvpValor)-(parseFloat(pvpValor)/((ivaValor/100)+1))));
			   mgLucroTemp = mgLucroTemp.toFixed(2);
			   document.getElementById('lucro').value = mgLucroTemp;
			   
		  }
		  
		  else {}
			  
		  
	}
	
		function listagemEventos(){
			
			if(document.getElementById("flexRadioDefault1").checked && document.getElementById("listaMarcas").value == "Selecionar família..." || document.getElementById("selectMercado").value =="Selecionar mercado..."){
			btnListar.disabled = true;
			btnExportar.disabled = true;
			btnaplicarGlobal.disabled = true;
			btnAplicarCampanha.disabled = true;
			document.getElementById("selectMercado").disabled=false;
			}
			else if(document.getElementById("flexRadioDefault2").checked && document.getElementById("listaMarcas").value != "Selecionar família..."){
			btnListar.disabled = false;
			btnExportar.disabled = true;
			btnaplicarGlobal.disabled = true;
			btnAplicarCampanha.disabled = true;
			document.getElementById("selectMercado").disabled=true;
			}
			else if(document.getElementById("flexRadioDefault2").checked && document.getElementById("listaMarcas").value == "Selecionar família..."){
			btnListar.disabled = true;
			btnExportar.disabled = true;
			btnaplicarGlobal.disabled = true;
			btnAplicarCampanha.disabled = true;
			document.getElementById("selectMercado").disabled=true;
			}
			else if(document.getElementById("listaMarcas").value != "Selecionar família..." && document.getElementById("flexRadioDefault2").checked){
			btnListar.disabled = false;
			btnExportar.disabled = true;
			btnaplicarGlobal.disabled = true;
			btnAplicarCampanha.disabled = true;
			}
			else if(document.getElementById("listaMarcas").value != "Selecionar família..." && document.getElementById("selectMercado").value !="Selecionar mercado..."){
				btnListar.disabled = false;

			}
			else if(document.getElementById("listaMarcas").value != "Selecionar família..." || document.getElementById("selectMercado").value =="Selecionar mercado..."){
			btnListar.disabled = true;
			btnExportar.disabled = true;
			btnaplicarGlobal.disabled = true;
			btnAplicarCampanha.disabled = true;
			}
			
			else{
				btnListar.disabled = true;
			}
		}
		

  


	function filtrarTabela() {
	
	  // valor do filtro de stock
	  let filtroStock;
	  for (let i = 0; i < stockRadios.length; i++) {
		if (stockRadios[i].checked) {
		  filtroStock = stockRadios[i].value;
		  break;
		}
	  }

	  // valor do filtro de vendas
	  let filtroVendas;
	  for (let i = 0; i < vendasRadios.length; i++) {
		if (vendasRadios[i].checked) {
		  filtroVendas = vendasRadios[i].value;
		  break;
		}
	  }

	  // Percorre todas as linhas da tabela
	  const tabela = document.getElementById('tabelaPcu');
	  const linhas = tabela.getElementsByTagName('tr');

	  for (let i = 0; i < linhas.length; i++) {
		const linha = linhas[i];
		const colunaEstoque = linha.getElementsByClassName('class_stock')[0]; 
		const colunaVendas = linha.getElementsByClassName('class_vendas')[0]; 

		// Verifique os valores nas colunas de estoque e vendas
		let exibirLinha = true;
		if (filtroStock !== '3') {
		  if (filtroStock === '1' && (colunaEstoque.textContent.trim() === '' || colunaEstoque.textContent.trim() === '0')) {
			exibirLinha = false;
		  } else if (filtroStock === '2' && (colunaEstoque.textContent.trim() !== '' && colunaEstoque.textContent.trim() !== '0')) {
			exibirLinha = false;
		  }
		}
		if (filtroVendas !== '3') {
		  if (filtroVendas === '1' && (colunaVendas.textContent.trim() === '' || colunaVendas.textContent.trim() === '0')) {
			exibirLinha = false;
		  } else if (filtroVendas === '2' && (colunaVendas.textContent.trim() !== '' && colunaVendas.textContent.trim() !== '0')) {
			exibirLinha = false;
		  }
		}

		// Oculte ou exiba as linhas com base nos filtros selecionados
		if (exibirLinha) {
	linha.style.visibility = 'visible';
		} else {
	 linha.style.visibility = 'hidden';
		}
	  }
	}
	

	
function precosConcorrencia(cnpPesquisa,nomeSage){
	
	
	var codigoCnp={"codigoCnp":cnpPesquisa};
	
	var divProgresso = document.getElementById("progresso");
		divProgresso.innerHTML = "A procurar o produto noutras lojas... <div class=\"spinner-border\" role=\"status\"><span class=\"visually-hidden\">A procurar o produto noutras lojas...</span></div>";
		$("#exampleModal").modal('show');
		
	
				fetch("fetchSearchCurlKK.php",{
					method:'POST',
					headers:{
						'Content-Type':'application/json',
					},
					body:JSON.stringify(codigoCnp),
				})
		.then((response) => response.text())

		.then(data => {
			
			//debug
			console.log(data);
			
			var notFound ="De momento não temos produtos que coincidam com a tua pesquisa."; // - frase para verificar que nao encontrou no kuantokusta
			var stringRetornadaPesquisa = data; // data.contents;
			
			//console.log(data);
			
			if(!stringRetornadaPesquisa.includes(notFound)){
				
				
				//var indexDadosInicioPesquisa = stringRetornadaPesquisa.indexOf("<div class=\"product-item-inner\"> <a href=");
				//indexDadosInicioPesquisa = indexDadosInicioPesquisa + 42;
				//var indexDadosFimPesquisa = stringRetornadaPesquisa.indexOf("\" class=\"product-item-image\" > <meta itemprop=\"image\"");
				//var StringPesquisa = stringRetornadaPesquisa.substring(indexDadosInicioPesquisa,indexDadosFimPesquisa);
				
				//var indexDadosInicioPesquisa = stringRetornadaPesquisa.indexOf('<div class=\"product-item-inner\"> <a href=');
				
				var indexDadosInicioPesquisa = stringRetornadaPesquisa.indexOf('data-analytics-products-lists=');
				
				//indexDadosInicioPesquisa = indexDadosInicioPesquisa + 42;
				
				indexDadosInicioPesquisa = indexDadosInicioPesquisa + 63;
				
				//var indexDadosFimPesquisa = stringRetornadaPesquisa.indexOf('" class=\"product-item-image\" > <meta itemprop=\"image\"');
				
				var indexDadosFimPesquisa = stringRetornadaPesquisa.indexOf('"><div class=\"c-AYTeD\"><div class=\"c-btjDhR card-header\">');
				
				var StringPesquisa = stringRetornadaPesquisa.substring(indexDadosInicioPesquisa,indexDadosFimPesquisa);
				
				var searchString={"searchString":StringPesquisa};
				
				//debug
				console.log("Produto encontrado...a obter lista de lojas...\n\n");
				
				divProgresso.innerHTML = "A obter a lista das lojas... <div class=\"spinner-border\" role=\"status\"><span class=\"visually-hidden\">A obter a lista das lojas...</span></div>";
				$("#exampleModal").modal('show');
				
					//ler informações das lojas
					
					console.log(searchString);
						
					fetch("fetchResultsCurlKK.php",{
					method:'POST',
					headers:{
						'Content-Type':'application/json',
					},
					body:JSON.stringify(searchString),
							})
					.then((response) => response.text())
						
					//.then((response) => response.json())

					.then(data => {
						
						
						
						var linhaId2;
						var stringRetornada = data; //.contents;
						console.log(stringRetornada);
						
						var indexDadosInicio = stringRetornada.indexOf("{\"props\":");
						var indexDadosFim = stringRetornada.indexOf("scriptLoader\":[]}");
						indexDadosFim = indexDadosFim+17;

						var jsonString = stringRetornada.substring(indexDadosInicio,indexDadosFim);
						
					
						var jsonParsed = JSON.parse(jsonString);
						
						
						
						var totalLojasArray = jsonParsed.props.pageProps.productPage.product.offers;
						var totalLojas = Object.keys(totalLojasArray).length;
						
						var divCnpProduto = document.getElementById("divCnpProduto");
						
						//limpa a div
						divCnpProduto.innerHTML="";
						
						var linhaCnpNome = document.createElement('p');
						linhaCnpNome.appendChild(document.createTextNode(cnpPesquisa+' - '+nomeSage));
						divCnpProduto.appendChild(linhaCnpNome);
						
						//criar tabela com as lojas
							var tabelaLinhaConcorrencia =  document.getElementById('divConcorrencia');
							
							var tabelaConcorrencia = document.createElement('table');
							tabelaConcorrencia.setAttribute('class','table table-dark align-middle'); 
							tabelaConcorrencia.setAttribute('id','tabelaConcorrencia');
							tabelaLinhaConcorrencia.innerHTML = "";
							
							var theadConcorrencia = document.createElement('thead');
							theadConcorrencia.setAttribute('class','table-dark table-sm');
							
							trConcorrencia = document.createElement('tr');
							
							//cabeçalhos da tabela
							linhaId2 = document.createElement('td');
							linhaId2.setAttribute('align','center');
							linhaId2.appendChild(document.createTextNode('Loja'));
							trConcorrencia.appendChild(linhaId2);
							linhaId2 = document.createElement('td');
							linhaId2.setAttribute('align','center');
							linhaId2.appendChild(document.createTextNode('Preço'));
							trConcorrencia.appendChild(linhaId2);
							linhaId2 = document.createElement('td');
							linhaId2.setAttribute('align','center');
							linhaId2.appendChild(document.createTextNode('Portes'));
							trConcorrencia.appendChild(linhaId2);
							linhaId2 = document.createElement('td');
							linhaId2.setAttribute('align','center');
							linhaId2.appendChild(document.createTextNode('Preço total'));
							trConcorrencia.appendChild(linhaId2);
							theadConcorrencia.appendChild(trConcorrencia);
							tabelaConcorrencia.appendChild(theadConcorrencia);
							
							tabelaLinhaConcorrencia.appendChild(tabelaConcorrencia);
							
							var tbodyConcorrencia = document.createElement('tbody');

								for(var i=0; i<totalLojas;i++){
								
								var nomeLoja = jsonParsed.props.pageProps.productPage.product.offers[i]?.storeName;
								var preco = jsonParsed.props.pageProps.productPage.product.offers[i]?.price;
								var portes = jsonParsed.props.pageProps.productPage.product.offers[i]?.shipping.minimumPrice;
								var precoTotal = jsonParsed.props.pageProps.productPage.product.offers[i]?.totalPrice;
								
								if(nomeLoja==null){
									nomeLoja="Não disponível";
								}
								if(preco==null){
									preco="Não disponível";
								}
								if(portes==null){
									portes="Não disponível";
								}
								if(precoTotal==null){
									precoTotal="Não disponível";
								}
								
								trConcorrencia = document.createElement('tr');
								
								//Insere os valores na tabela linha por linha
						
								//nome da loja
								linhaId2 = document.createElement('td');
								linhaId2.appendChild(document.createTextNode(nomeLoja));
								trConcorrencia.appendChild(linhaId2);
							
								
								//preço
								linhaId2 = document.createElement('td');
								linhaId2.appendChild(document.createTextNode(preco));
								trConcorrencia.appendChild(linhaId2);
								
								//portes de envio
								linhaId2 = document.createElement('td');
								linhaId2.setAttribute('align','right');
								linhaId2.appendChild(document.createTextNode(portes));
								trConcorrencia.appendChild(linhaId2);
								
								//preço total
								linhaId2 = document.createElement('td');
								linhaId2.setAttribute('align','right');
								linhaId2.appendChild(document.createTextNode(precoTotal));
								trConcorrencia.appendChild(linhaId2);
								
								tbodyConcorrencia.appendChild(trConcorrencia);
								//debug
								//console.log("Loja: "+nomeLoja+" - Preço: "+preco+" - Portes de envio: "+portes+" - Preço total: "+precoTotal+"\n");
								
								}
								
								//insere body total de linhas e no offcanvas
								tabelaConcorrencia.appendChild(tbodyConcorrencia);
								
								tabelaLinhaConcorrencia.appendChild(tabelaConcorrencia);
								
								//esconde o modal de estado
								$("#exampleModal").modal('hide');
								
								//ordena a tabela por preço total
								
								var table = document.getElementById('tabelaConcorrencia'); 
								var columnIndex = 3; 

								sortTable(table, columnIndex);
								
								columnIndex = 0; 
								var searchString = 'ZonPharma'; // Replace 'Your search string' with the string you want to search for in the column
								var highlightColor = '#0d6efd'; // Replace 'yellow' with the desired highlight color

								highlightRow(table, columnIndex, searchString, highlightColor);

								//mostra o offcanva da tabela
								var offcanvasElement = document.getElementById('offcanvasConcorrencia'); 
								var offcanvas = new bootstrap.Offcanvas(offcanvasElement);
								offcanvas.show();
								//esconde o modal de estado
								$("#exampleModal").modal('hide');
					})
					.catch(data => {
					divProgresso.innerHTML = "Ocorreu um erro inesperado a procurar o produto.<br>Tente novamente mais tarde...";
					$("#exampleModal").modal('show');			
			
		})
			}
			else{
				divProgresso.innerHTML = "Produto não encontrado em outras lojas.";
				$("#exampleModal").modal('show');
				
				console.log("Produto não encontrado");
			}

		})
		.catch(data => {
				divProgresso.innerHTML = "Ocorreu um erro inesperado a obter a lista das lojas.<br>Tente novamente mais tarde...";
				$("#exampleModal").modal('show');			
			
		})


		/*
		//teste com um produto escrito direto no endereço. o endereço também é "scrapped" através de um fetch anteriormente feito antes deste fetch.
		fetch("https://api.allorigins.win/get?url=https://www.kuantokusta.pt/p/3362074/eludril-classic-colutorio-500ml") 

		.then((response) => response.json())

		.then(data => {


			var stringRetornada = data.contents;

			var indexDadosInicio = stringRetornada.indexOf("{\"props\":");
			var indexDadosFim = stringRetornada.indexOf("scriptLoader\":[]}");
			indexDadosFim = indexDadosFim+17;

			var jsonString = stringRetornada.substring(indexDadosInicio,indexDadosFim);

			var jsonParsed = JSON.parse(jsonString);

			//debug
			//console.log(jsonParsed);

			for(var i=0; i<60;i++){
				console.log("Loja: "+jsonParsed.props.pageProps.productPage.product.offers[i].storeName+" - Preço: "+jsonParsed.props.pageProps.productPage.product.offers[i].price+
				" - Portes de envio: "+jsonParsed.props.pageProps.productPage.product.offers[i].shipping.minimumPrice+" - Preço total: "+jsonParsed.props.pageProps.productPage.product.offers[i].totalPrice+"\n");
			}

		})
		
		*/
	
	}
	
	function sortTable(table, columnIndex) {
	  var tbody = table.querySelector('tbody');
	  var rows = Array.from(tbody.querySelectorAll('tr'));

	  rows.sort(function(a, b) {
		var aValue = a.cells[columnIndex].textContent.trim();
		var bValue = b.cells[columnIndex].textContent.trim();
		return aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
	  });

	  rows.forEach(function(row) {
		tbody.appendChild(row);
	  });
	}
	
	function highlightRow(table, columnIndex, searchString, highlightColor) {
		  var tbody = table.querySelector('tbody');
		  var rows = tbody.querySelectorAll('tr');

		  rows.forEach(function(row) {
			var cell = row.cells[columnIndex];
			var cellText = cell.textContent.trim();
			
			if (cellText == searchString) {
			 cell.style.setProperty('background-color', highlightColor, 'important');

			} else {
			  row.style.backgroundColor = '';
			}
		  });
		}

// Função gravaPVP
  function gravaPVP(novoPrecoComIva,novoPrecoSemIva,margemNova,cnp) {
   
   //debug
   //console.log('id obtido = cnp: ' + cnp);
    
	//dados para pedir info a base de dados
		var Produto={"cnp":cnp,"novoPrecoComIva":novoPrecoComIva,"novoPrecoSemIva":novoPrecoSemIva,"margemNova":margemNova};		
		
	//grava pvp no Sage
	fetch ('updatePvp.php', {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json',
				
			},
			body:JSON.stringify(Produto),
			
			
		})

		.then(respostaGravaPvp => respostaGravaPvp.json())
			 
		.then(respostaGravaPvp => {	
		
			var resposta = respostaGravaPvp[0].codigoEstado;
			
			if(resposta = 1){
				console.log("PVP alterado com sucesso!");
				mostrarMensagem("PVP alterado com sucesso!", "#C1F2B0");
			}
			else{
				//console.log("ERRO A GRAVAR PVP");
				mostrarMensagem("Não foi possível gravar o PVP", "#FF6961");
			}
			
		
		})
		
		.catch(respostaGravaPvp => {

			//console.log(respostaGravaPvp);
			mostrarMensagem("Não foi possível gravar o PVP", "#FF6961");
		})

  }
  
function gravaPvpMassa(){
	
	//debug
	//console.log('teste botao gravar pvp em massa');
	
	var tabela = document.getElementById('tabelaPcu');
    var linhas = tabela.getElementsByTagName('tr');
    var dadosJson = [];
	
    // Iterar sobre as linhas da tabela (começando da segunda linha, índice 1)
    for (var i = 1; i < linhas.length; i++) {
      
	  var colunas = linhas[i].getElementsByTagName('td');

      // Extrair dados das colunas específicas
      var cnp = colunas[2].textContent;
      var taxaIva = colunas[6].textContent;
	  var caixaPvpComIva = document.getElementById('pvpVenda'+i);
	  var pvpComIva =caixaPvpComIva.value;
	  var caixaMargem = document.getElementById('tempboxMargin'+i);
	  var margemNova =caixaMargem.value;
	  var caixaSeleccao = document.getElementById('selectItem'+i);

		if (taxaIva == "23"){
			taxaIva = 1.23;
		}
		else if (taxaIva == "6"){
			taxaIva = 1.06;
		}
		else{
			taxaIva = 1.23;
		}
		  	
			//preço sem Iva
			var pvpSemIva = (pvpComIva / taxaIva).toFixed(5);
		    
			//verifica os campos antes de gravar.
			if((pvpSemIva <0 ) || (pvpSemIva == '') || (pvpSemIva == 0) || (margemNova < 0) || (margemNova == 0) || (margemNova == '') || (margemNova =='-Infinity')){
				
				//mostrarMensagem("Verifique os campos MARGEM APLICADA e PVP c/IVA", "#FF6961");
				
			}
			else{
				
				if (caixaSeleccao.checked){
					 
					 // Criar objeto JSON com os dados
					   var dados = {
						cnp: cnp,
						taxaIva: taxaIva,
						novoPrecoComIva: pvpComIva,
						novoPrecoSemIva: pvpSemIva,
						margemNova:margemNova
					   };

					  // Adicionar objeto ao array de dadosJson
					  dadosJson.push(dados);
				}
				else
				{
					
				}
			  
			}
	  
    }

    // debug Exibir o array de dadosJson
    console.log(dadosJson);
	console.log(dadosJson.length);
	
	
	//grava pvp no Sage
	fetch ('updatePvpMassa.php', {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json',
				
			},
			body:JSON.stringify({ dadosJson: dadosJson }),
		})

		.then(respostaGravaPvp => respostaGravaPvp.json())
			 
		.then(respostaGravaPvp => {	
		
			var resposta = respostaGravaPvp[0].codigoEstado;
			
			if(resposta = 1){
				console.log("PVP alterado com sucesso!");
				mostrarMensagem("PVP alterado com sucesso!", "#C1F2B0");
			}
			else{
				console.log("ERRO A GRAVAR PVP");
				mostrarMensagem("Não foi possível gravar o PVP", "#FF6961");
			}
			
		
		})
		
		.catch(respostaGravaPvp => {

			console.log(respostaGravaPvp);
			//mostrarMensagem("Não foi possível gravar o PVP", "#FF6961");
		})
		
}
  
function mostrarMensagem(mensagem, corFundo) {
    // Obter elemento de corpo do offcanvas
    var offcanvasBody = document.getElementById('offcanvasCorpo');
	
    // Definir cor de fundo e mensagem
    offcanvasBody.style.backgroundColor = corFundo;
    offcanvasBody.innerHTML = "<h2>"+mensagem+"</h2>";

    // Mostrar offcanvas
    var offcanvasInstance = new bootstrap.Offcanvas(document.getElementById('offCanvasMensagem'));
    offcanvasInstance.show();

    // Fechar offcanvas após 2 segundos (opcional)
    setTimeout(function() {
      offcanvasInstance.hide();
    }, 2000); // 2000 milissegundos (2 segundos)
  }
  
}


