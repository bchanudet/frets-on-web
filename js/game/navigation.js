NAVIGATION = {
	
	_root : null,
	_selected: null,
	
	Enable : function(isRaw){
		if(isRaw === undefined) isRaw = false;
		
		if(!isRaw)
			document.addEventListener("inputs", NAVIGATION.OnInputReceived);
		else	
			document.addEventListener("inputs-raw", NAVIGATION.OnRawInputReceived);
	},
	
	Select : function(selector){
		console.log(selector, typeof selector,selector instanceof  Text);
		if(selector === null || typeof selector === Text || selector instanceof  Text){
			return;
		}
		if(typeof selector === 'string'){
			NAVIGATION._selected = document.querySelector(selector);
		}
		else{
			NAVIGATION._selected = selector;
		}
		
		NAVIGATION._root = NAVIGATION._selected.parentElement;
		
		for(var i = 0, l = NAVIGATION._root.children.length; i < l; i += 1){
			NAVIGATION._root.children[i].classList.remove("nav-selected");
		}
				
		NAVIGATION._selected.classList.add("nav-selected");
		
		console.log("NAVIGATION", NAVIGATION._selected);
	},
	
	Enter: function(){
		console.log("Entering on ", NAVIGATION._selected);
		if(NAVIGATION._selected.hasAttribute("nav-enter")){
			console.log("Executing", NAVIGATION._selected.getAttribute("nav-enter"));
			eval(NAVIGATION._selected.getAttribute("nav-enter"));
		}
	},
	
	OnInputReceived : function(event){
		var pressed = event.detail.buttons;
		console.log(pressed);
		
		if(NAVIGATION._selected == null){
			console.warn("NAVIGATION._selected is null");
			return;
		}
		if(pressed.length === 0){
			return;
		}
		
		if(pressed.lastIndexOf("player.0.down") > -1){
			NAVIGATION.Select(NAVIGATION._selected.nextSibling);
		}
		if(pressed.lastIndexOf("player.0.up") > -1){
			NAVIGATION.Select(NAVIGATION._selected.previousSibling);
		}
		if(pressed.lastIndexOf("player.0.enter") > -1){
			NAVIGATION.Enter();
		}
	},
	
	OnRawInputReceived : function(event){
		var pressed = event.detail.buttons;
		console.log('RAW',pressed);
		
		if(NAVIGATION._selected == null){
			console.warn("NAVIGATION._selected is null");
			return;
		}
		if(pressed.length === 0){
			return;
		}
		
		
		if((pressed.lastIndexOf("keyboard.40") > -1) || (pressed.lastIndexOf("gamepad.0.13") > -1) || (pressed.lastIndexOf("gamepad.1.13") > -1)){
			NAVIGATION.Select(NAVIGATION._selected.nextSibling);
		}
		if((pressed.lastIndexOf("keyboard.38") > -1) || (pressed.lastIndexOf("gamepad.0.12") > -1) || (pressed.lastIndexOf("gamepad.1.12") > -1)){
			NAVIGATION.Select(NAVIGATION._selected.previousSibling);
		}
		if((pressed.lastIndexOf("keyboard.13") > -1) || (pressed.lastIndexOf("gamepad.0.0") > -1) || (pressed.lastIndexOf("gamepad.1.0") > -1)){
			NAVIGATION.Enter();
		}
		
	},
	
	Disable: function(){
		console.error("DISABLED");
		document.removeEventListener("inputs", NAVIGATION.OnInputReceived);
		document.removeEventListener("inputs-raw", NAVIGATION.OnRawInputReceived);
		NAVIGATION._selected = null;
	}
}