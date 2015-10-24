
function agregar_botones_encuesta(){
	var msgs_propios = document.getElementsByClassName('msg-mine');
	for (i=0; msgs_propios.length > i; i++){
		var div_botones = document.createElement('div');
		div_botones.innerHTML = "<div class='btns-encuesta'><button type='button' value='1'/>Menti</button>" +
								"<button type='button' value='0'/>No Menti!</button></div>"
		msgs_propios[i].appendChild(div_botones);
		var boton_rta_mentira = msgs_propios[i].getElementsByTagName('button')[0];
		var boton_rta_verdad = msgs_propios[i].getElementsByTagName('button')[1];
	}
};

agregar_botones_encuesta();
$('.btns-encuesta > button').each(function(){$(this).on('click', guardar_mentira)});

function guardar_mentira(){
	console.log("click!");
	var es_mentira = this.value;
	var div_padre = this.parentElement;
	var div_rta = document.createElement('div');
	if(es_mentira == 1){
		div_rta.innerHTML = "Mentiroso!!";
	}
	else{
		div_rta.innerHTML = "Muy Bien!";
	}
	
	while (div_padre.firstChild) {
		div_padre.removeChild(div_padre.firstChild);
	}
	div_padre.appendChild(div_rta);
};
