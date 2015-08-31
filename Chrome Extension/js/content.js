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
});


	
