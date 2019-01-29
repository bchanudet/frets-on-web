SCREENS['inputs'] = {
	_suscriberID : '',
	
	Display: function(){
		document.querySelector("#inputs").classList.add("active");
		SCREENS['inputs']._suscriberID = GAME.AddSuscriber(SCREENS['inputs'].Render);
		NAVIGATION.Enable(true);
		NAVIGATION.Select("#inputs-list div");
	},
	
	
	SelectInput : function(mapping){
		PLAYERS[0].SetMapping(GAME.C.MAPPINGS[mapping], '0');
		
		GAME.SetScreen("song-selection");
		GAME.SetState(GAME.C.STATES.SONG_SELECTION);
	},
	
	Render: function(){
		
	},
	OnStateChanged : function(evt){
		
	},
	Dispose : function(){
		NAVIGATION.Disable();
		GAME.RemoveSuscriber(SCREENS['inputs']._suscriberID);
		document.querySelector("#inputs").classList.remove("active");
	}
};

// Suscribe to states loop
document.addEventListener("state", SCREENS['inputs'].OnStateChanged);