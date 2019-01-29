RAW_INPUTS = {
	gamepads : navigator.getGamepads(),
	keyboard : [],
	
	_lastButtons : '',
	_lastAxes : '',
	
	Loop : function(){
		RAW_INPUTS.gamepads = navigator.getGamepads();
			
		var _inputs = RAW_INPUTS.DetectPressedButtons().concat(RAW_INPUTS.keyboard);
		var _axes 	= RAW_INPUTS.GetAxisValues();
		
		if(JSON.stringify(_inputs) !== RAW_INPUTS._lastButtons){
			var _evt = new CustomEvent('inputs-raw',{
				detail: {
					buttons : _inputs,
					axes	: _axes
				}
			});
			document.dispatchEvent(_evt);	
			RAW_INPUTS._lastButtons = JSON.stringify(_inputs);
		}
		/*
		var _evt = new CustomEvent('inputs',{
			detail: {
				buttons : _inputs,
				axes	: _axes
			}
		});
		document.dispatchEvent(_evt);
		*/
	},
	DetectPressedButtons : function(){
		var output = [];
		
		for(var i = 0, l = RAW_INPUTS.gamepads.length; i < l; i += 1){
			var _gmpd = RAW_INPUTS.gamepads[i];
			if(_gmpd === null) continue;
			for(var j = 0, m = _gmpd.buttons.length; j < m; j+= 1){
				var _btn = _gmpd.buttons[j];
				if(_btn.pressed || Math.abs(_btn.value) === 1){
					output.push('gamepad.' + i + '.' + j);
				}
			}
		}
		
		return output;
	},
	GetAxisValues : function(){
		
		var output = {};
		for(var i = 0, l = RAW_INPUTS.gamepads.length; i < l; i += 1){
			var _gmpd = RAW_INPUTS.gamepads[i];
			if(_gmpd === null) continue;
			for(var j = 0, m = _gmpd.axes.length; j < m; j+= 1){
				output['gamepad.' + i + '.'+ j] = _gmpd.axes[j];
			}
		}
		return output;
	}
};

GAME.AddSuscriber(RAW_INPUTS.Loop);

document.body.onkeydown = function(e){
	var _key = 'keyboard.' + e.keyCode.toString();
	if(RAW_INPUTS.keyboard.lastIndexOf(_key) == -1){
		RAW_INPUTS.keyboard.push(_key);
	}
}

document.body.onkeyup = function(e){
	var _key = 'keyboard.' + e.keyCode.toString();
	if(RAW_INPUTS.keyboard.lastIndexOf(_key) > -1){
		RAW_INPUTS.keyboard.splice(RAW_INPUTS.keyboard.lastIndexOf(_key),1);
	}
}



INPUTS = {
	OnRawInput : function(event){
		var _buttons = INPUTS.MapInputs(event.detail.buttons);
		
		var _evt = new CustomEvent('inputs',{
			detail: {
				buttons : _buttons,
			}
		});
		document.dispatchEvent(_evt);
	},
	MapInputs : function(inputs){
		var _pressed = [];
		if(inputs !== undefined){
			for(var i = 0, l = PLAYERS.length; i < l; i+= 1){
				for(var j in PLAYERS[i].mapping){
					if(inputs.lastIndexOf(PLAYERS[i].mapping[j]) > -1){
						_pressed.push('player.'+ i + '.' + j);
					}
				}
			}
		}
		return _pressed;
	}
};
document.addEventListener("inputs-raw", INPUTS.OnRawInput);


