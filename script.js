var newRecord = false;

$(document).ready(function() {
	// parar cronometro
	Example1.Timer.toggle();

	/*this function native to theme get in bootsniip*/
    $(document).mousemove(function(event) {
        TweenLite.to($("body"), 
        .5, {
            css: {
                backgroundPosition: "" + parseInt(event.pageX / 8) + "px " + parseInt(event.pageY / '12') + "px, " + parseInt(event.pageX / '15') + "px " + parseInt(event.pageY / '15') + "px, " + parseInt(event.pageX / '30') + "px " + parseInt(event.pageY / '30') + "px",
            	"background-position": parseInt(event.pageX / 8) + "px " + parseInt(event.pageY / 12) + "px, " + parseInt(event.pageX / 15) + "px " + parseInt(event.pageY / 15) + "px, " + parseInt(event.pageX / 30) + "px " + parseInt(event.pageY / 30) + "px"
            }
        })
    })

 	montarHtmlInicial();

	eventoCliqueCarta();
	
});

function eventoCliqueCarta(){
	var rel_oldClick = 0;
	var id_oldClick = -1;
	var tempoDaPartida = '';
	var qtdeCliquesCronometro = 0;
	var qtdeCliques = 0;
	var imagemRecemClicada;
	var qtdeCliquesGeral = 0;
	$( ".spanCarta" ).click(function() {
		qtdeCliquesGeral++;
		
		// testes de borda (descomentar para testar)
		/*
		if(qtdeCliquesGeral == 5 || qtdeCliquesGeral == 10){
			tempoDaPartida = '00:00:20';
			ordenarTempos(tempoDaPartida);
		}else if(qtdeCliquesGeral > 1){
			tempoDaPartida = $('#stopwatch').text();
			ordenarTempos(tempoDaPartida);
		}
		*/
		//
	
		qtdeCliquesCronometro++;
		if(qtdeCliquesCronometro == 1){
			Example1.Timer.toggle();
		}
		
		qtdeCliques++;
		if(qtdeCliques <= 2){
			if(rel_oldClick == 0){
				$( this ).find( "img" ).attr("src", "miMeSweet-img/"+$(this).attr("rell")+".png");
				imagemRecemClicada = $( this ).find( "img" );
				rel_oldClick = $(this).attr("rell");
				id_oldClick = $(this).attr("id");
			}else{
				if(rel_oldClick == $(this).attr("rell")){				
					$( this ).find( "img" ).attr("src", "miMeSweet-img/"+$(this).attr("rell")+".png");
					rel_oldClick = -1;
					qtdeCliques = 0;
					
					if(getQtdeCartasFechadas() == 0){
						// zerar cronometro
						qtdeCliques = 0;
						qtdeCliquesCronometro = 0;
						Example1.resetStopwatch();
						
						// guardar tempo em variável
						tempoDaPartida = $('#stopwatch').text();
						
						var msg = 'Parabéns! \nVocê terminou a partida em: ' + tempoDaPartida;
						msg += '\nPara recomeçar o jogo clique sobre qualquer carta.'
						alert(msg);
						
						//var tempoTable = $('#tempoTable').html();
						//alert('tempoTable: \n\n' + tempoTable);
						
						// recomeça o jogo
						$('#label').empty(); // limpa o jogo atual
						montarHtmlInicial(); // monta o html do jogo inicial
						eventoCliqueCarta(); // adiciona o evento de clique novamente
						ordenarTempos(tempoDaPartida);
					}
				}else{
					var imagemAtualClicada = $( this ).find( "img" );
					imagemAtualClicada.attr("src", "miMeSweet-img/"+$(this).attr("rell")+".png");
					
					setTimeout(function(){
						imagemRecemClicada.attr("src", "miMeSweet-img/back.png");
						imagemAtualClicada.attr("src", "miMeSweet-img/back.png");
						qtdeCliques = 0;
					}, 1000);
					
					$("#"+id_oldClick+" ").show();
					$("#"+id_oldClick+" ").show();
					id_oldClick = -1;
				}
				rel_oldClick = 0;
			}
		}else{
			//alert('ops, qtdeCliques is: ' + qtdeCliques);
		}
	});
}

function montarHtmlInicial(){
	var level = 1;
 	var lblLevel = "<b>"+level+"</b>";
	$('#level').append(lblLevel);

 	var cods = getCartasAleatorias();
	//var cods = getCartasAleatorias_old();

	/*Esbi na tela os resultados*/
	var html = "";
	var htmlTempos = "";
	var qbr_linha = 1; //Controlar as linhas
	html += "<tr>";
	$('#label').append(html);

 	for( i=0 ; i < 16 ; i++ ) {
		if(qbr_linha < 4){
	 		html +="<td style='cursor:pointer;'>";
	 		html +="<span class='spanCarta' rell='"+cods[i]+"' id='"+i+"' style='height: 128px !important; width: 128px !important;'>";
			html +="<img src='miMeSweet-img/back.png' height='128px' width='128px' style='padding:1px;'>";
			html +="</span>";
			html +="</td>";
			
			qbr_linha++;
		}else{
	 		html +="<td style='cursor:pointer;'>";
	 		html +="<span class='spanCarta' rell='"+cods[i]+"' id='"+i+"' style='height: 128px !important; width: 128px !important;'>";
			html +="<img src='miMeSweet-img/back.png' height='128px' width='128px' style='padding:1px;'>";
			html +="</span>";
			html +="</td>";
			html +="</tr><tr>";
			qbr_linha = 1;
		}
 	}
	
	
	html += htmlTempos;
	
 	html += "</tr>";
 	$('#label').append(html);
}

var tempoNovoColocado = false;
function ordenarTempos(tempoDaPartida){
	var arrayTempos = [];
	$('#tempoTable tr').each(function (){
		arrayTempos.push($(this).text());
	});
	
	if(arrayTempos.length == 0){
		$('#tempoTable').append(getLinhaDeTempo(tempoDaPartida));
	}else {
		arrayTempos = arrayTempos.sort();
		$('#tempoTable').html(''); // limpar tempos
		for(i = 0; i < arrayTempos.length; i++){
			if(tempoDaPartida < arrayTempos[i] && !tempoNovoColocado && tempoDaPartida < arrayTempos[0]){
				$('.divTemposGreenBorder').attr('class', 'divTempos'); // remove o efeitos de bordas existentes
				$('#tempoTable').append(getLinhaDeTempoGreen(tempoDaPartida)).hide().fadeIn( 1000 ); // dá o efeito de verde ao bater o record
				tempoNovoColocado = true;
			}
			$('#tempoTable').append(getLinhaDeTempo(arrayTempos[i]));
		}
		if(!tempoNovoColocado){
			$('#tempoTable').append(getLinhaDeTempo(tempoDaPartida));
		}
	}
	
	// chama os metodos de controle de borda
	setTimeout(addBordaAoMelhorTempo, 1000);
	manterBordaAoPrimeiroItem();
}

function addBordaAoMelhorTempo(){
	$('.divTemposGreen').attr('class', 'divTemposGreenBorder');
	if(tempoNovoColocado){
		newRecord = true;
	}
	setTimeout(manterBordaAoPrimeiroItem, 2000);
}

function manterBordaAoPrimeiroItem(){
	if(newRecord){
		$('.divTemposGreenBorder').attr('class', 'divTempos'); // remove o efeitos de bordas existentes
		$('.divTempos').first().addClass('divTemposGreenBorder'); // sempre manter o primeiro com a borda verde
	}
}

function getQtdeCartasFechadas(){
	var qtdeCartasRestantes = 0;
	$('.spanCarta ').each(function(){
		if($(this).find('img').attr('src').indexOf('back.png') != -1){
			qtdeCartasRestantes++;
		}
	});
	return qtdeCartasRestantes;
}

function getLinhaDeTempo(tempo){
	var str = '';
	str += '<tr>';
	str += '<td>';
	str += '<div class="divTempos">' + tempo + '</div>';
	str += '</td>';
	str += '</tr>';
	return str;
}

function getLinhaDeTempoGreen(tempo){
	var str = '';
	str += '<tr>';
	str += '<td>';
	str += '<div class="divTemposGreen">' + tempo + '</div>';
	str += '</td>';
	str += '</tr>';
	return str;
}

function getCartasAleatorias(){
	var array = [];
	while(true){
		var numRandom = Math.floor((Math.random() * 17) + 1);
		if(array.length == 0){
			array.push(numRandom);
		}else{
			if(!containsInArray(numRandom, array)){
				array.push(numRandom);
			}
		}
		if(array.length == 8){return shuffle(array.concat(array))}
	}
}

function containsInArray(numRandom, array){
	for(i = 0; i < array.length; i++){
		if(array[i] == numRandom){
			return true;
		}
	}
	return false;
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function getCartasAleatorias_old(){
	var level = 2;
	var semente = 2;
 	var pr_linha = (level+semente);
 	var total = pr_linha*pr_linha;
	var i = 0, j = 0; //base de loop
	var rand = pr_linha+(level*level);
	var cods = [];
	for (i = 0; i < parseInt(total/2); ++i) {
		do{
			var cod = Math.floor((Math.random() * rand) + 1);
			cods[i] = cod;
			var status = true;
			for(j = 0; j < i; j++){
				if(cods[i] == cods[j]){
					status = false;
				}
			}
		}while(status == false);
	}
	cods = cods.concat(cods);
	//alert('cods: ' + cods);
	//alert('meu random: ' + getCartasAleatorias());
	return cods;
	alert(cods);
}