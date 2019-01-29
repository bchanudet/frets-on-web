GAME = {
	// Constants
	C :{
		STATES:{
			// Level screen
			'LOADING': 0,
			'READY': 1,
			'PLAYING': 2,
			'PAUSED': 3,
			'FINISHED': 4,
			'COUNTDOWN': 5,
			// Other screens
			'INPUT_SELECTION': 10,
			'SONG_SELECTION': 11,
			'SCORE_DISPLAY' : 12,
			
			// False states
			'NOT_STARTED': -1
		},
		COLORS: [
			'green',
			'red',
			'yellow',
			'blue',
			'orange'
		],
		MAPPINGS : {
			"keyboard": {
				"up": "keyboard.38",
				"down": "keyboard.40",
				"enter": "keyboard.13",
				"green":"keyboard.65",
				"red":"keyboard.90",
				"yellow":"keyboard.69",
				"blue":"keyboard.82",
				"orange":"keyboard.84",
				"back":"keyboard.8",
				"start": "keyboard.32",
			},
			"xboxone": {
				"up": "keyboard.38",
				"down": "keyboard.40",
				"enter": "keyboard.13"
			},
			"guitarhero": {
				"up": "gamepad.¤.12",
				"down": "gamepad.¤.13",
				"enter": "gamepad.¤.0",
				"green":"gamepad.¤.0",
				"red":"gamepad.¤.1",
				"yellow":"gamepad.¤.3",
				"blue":"gamepad.¤.2",
				"orange":"gamepad.¤.4",
				"back":"gamepad.¤.1",
				"start":"gamepad.¤.9"
			}
		}
	},
	
	currentState : -1,
	currentScreen : '',
	currentSong : null,
	currentMode : 'EDIT',
	isStarted : false,
	
	// Main loop
	mainLoopSuscribers :{}, 
	MainLoop : function(){
		requestAnimationFrame(GAME.MainLoop);
		for(var i in GAME.mainLoopSuscribers){
			GAME.mainLoopSuscribers[i]();
		}
	},
	AddSuscriber : function(callback){
		console.log(callback);
		var _id = 'suscriber-' + (new Date()).valueOf();
		GAME.mainLoopSuscribers[_id] = callback;
		return _id;
	},
	RemoveSuscriber : function(id){
		delete GAME.mainLoopSuscribers[id];
	},
	
	
	Start : function(){
		requestAnimationFrame(GAME.MainLoop);
		console.log("GAME HAS STARTED");
		GAME.isStarted = true;
		GAME.SetScreen('inputs');
		GAME.SetState(GAME.C.STATES.INPUT_SELECTION);
		
		// Preload pool of 3D objects
		SCREENS.stage.LoadPool();
	},
	
	// State Modification
	SetState : function(state){
		var event = new CustomEvent("state", {
			detail: {
				newState : state,
				oldState : GAME.currentState
			}
		});
		document.dispatchEvent(event);
		GAME.currentState = state;
	},
	SetScreen : function(screen, parameters){
		console.info("Navigating to", screen, parameters);
		if(screen === GAME.currentScreen){
			return;
		}
		
		for(var id in SCREENS){
			SCREENS[id].Dispose();
		}
		
		SCREENS[screen].Display(parameters);
		
		var event = new CustomEvent("screen", {
			detail: {
				screen: screen,
				paramters : parameters
			}
		});
		document.dispatchEvent(event);
		GAME.currentScreen = screen;
	},
	SetSong : function(id){
		GAME.currentSong = new Song(id);
		GAME.currentSong.loadDescription(SONGS[id]);
		
	},
	GetSong : function(){
		return GAME.currentSong;
	}
};

SCREENS = {};
PLAYERS = [
	new Player(0, "BEC")
];


