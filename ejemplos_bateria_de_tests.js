


{
	test:'Mentiroso mentiroso',
	applyTo:'message',
	filter:function(obj) {
		return obj.type!='other' && (obj.lie=='x' || obj.lie==undefined);
	},
	form:function() {
		return $('<select name="lie"><option value="x" selected="selected">No seleccionado</option><option value="m">Miente</option><option value="n">No Miente</option></select>')
	},
}

{
	test:'Ta buena?',
	applyTo:'profile',
	filter:function(myself,obj) {
		return myself.lookingFor!=obj.gender && obj.interest!=undefined;
	},
	form:function() {
		return $('<select name="interest"><option value="x" selected="selected">No seleccionado</option><option value="1">Fea/o</option><option value="10">WOW</option></select>')
	},
}



// Obj: target (red social o página)
{
	url: /.*facebook.com/,
	init:function($div) {
		....
		....
	}



