// var $j = jQuery.noConflict();

$(document).ready(function() {

    console.log( "ready!" );

	var wrapper = document.createElement('div');
	wrapper.id="chat-wrapper";
	wrapper.style.position = 'fixed';
	wrapper.style.width = '100%';   
	wrapper.style.height = '100%';

	console.log( "Appending chat wrapper!" );
	$("#pagelet_sidebar").append(wrapper);
	
	
	console.log( "Updating chat-bar style" );
	var chatBar = $(".fbChatSidebar")[0];
	chatBar.style.display = 'block';
	chatBar.style.float = 'left';
	chatBar.style.width = '25%';   
	chatBar.style.height = '100%';

	console.log( "Moving chat-bar to wrapper" );
	$(wrapper).append(chatBar);


	var logger = document.createElement( 'div' );
	logger.id = 'chat-logger';
	logger.style.display = 'block';
	logger.style.float = 'right';
	logger.style.width = '50%';   
	logger.style.height = '100%';
	//logger.style.backgroundColor = 'red';

	console.log( "Adding logger to sidebar" );
	$(".fbChatSidebarBody")
		.children(".uiScrollableArea")
		.prepend(logger);

	$("#chat-logger").load(chrome.extension.getURL("html/chat-logger.html"));

	//-------------------Detectar nueva ventana de conversacion------------------//
	var target = $(".fbNubGroup")[0]; // Class del nodo a monitorear
	
	//Crea una nueva instancia del observer de cambios
	var observer = new MutationObserver(function( mutations ) {
		mutations.forEach(function( mutation ) {
			var newNodes = mutation.addedNodes; // DOM NodeList
			if( newNodes !== null  && newNodes.length > 0) { // Si se agregaron nuevos nodos
				var $nodes = $( newNodes );
				$nodes.each(function() { 
					var node = $( this )[0];
					//Chequeo que este creada la clase de la ventana "conversacion"
					if(node.tagName !== undefined && node.getElementsByClassName("titlebarTextWrapper").length != 0){
						var elem = node.getElementsByClassName("titlebarTextWrapper")[0];
						if(elem.tagName == "H4"){
							console.log( "Se inicia una nueva conversacion" );
                                                        var flush=new Keylogger($(node).find("textarea"),function(a,b){
                                                            // a es el texto para ser almacenado
                                                            console.log("keyloguer function: "+a);
                                                        });
						}
					}
				});
			}
		});    
	});
	//Campos a observar del target
	observer.observe(target, {
		attributes: true,
		childList: true,
		subtree: true
	});
	//-------------------Fin detectar nueva ventana de conversacion------------------//
});


	
