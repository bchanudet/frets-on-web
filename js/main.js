var start;


var players = [{
	layout: 'pad-xboxone'
}];

var layouts = {
	'pad-xboxone':{
		'buttons': [
			['string-green'],
			['string-red'],
			['string-blue'],
			['string-yellow'],
			[],
			['string-orange'],
		],
		'axes': [
			'vibrato',
			'bonus'
		]
	}
}

var inputs = navigator.getGamepads();


function buttonPressed(player, button) {
	var pad = inputs[players[0].gamepad];
	
  	for(var i = 0, l = pad.buttons.length; i < l; i++){
		var input = pad.buttons[i];
		if(input.pressed || input.value >= 1){
			console.log('pressed', i, layouts[player.layout].buttons[i], input);
			if(layouts[player.layout].buttons[i].lastIndexOf(button) > -1){
				return true;
			}
		}
	}
	return false;
	
}
function axisValue(player, button) {
  	
}

function gameLoop() {
	inputs = navigator.getGamepads();
	
 
  	start = requestAnimationFrame(gameLoop);
}


window.addEventListener("gamepadconnected", function(e) {
  	var gp = navigator.getGamepads()[e.gamepad.index];
  	console.log("Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.");	
	console.log(gp);
	
	players[0].gamepad = e.gamepad.index;
	
  	gameLoop();
});

window.addEventListener("gamepaddisconnected", function(e) {
	
	
  	cancelRequestAnimationFrame(start);
});