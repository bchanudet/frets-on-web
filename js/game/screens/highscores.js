SCREENS.highscore = {
	_suscriberID : null,
	
	Display: function(){
		document.querySelector("#highscore").classList.add("active");
		SCREENS.highscore._suscriberID = GAME.AddSuscriber(SCREENS.highscore.Render);
		
		SCREENS.highscore.Load();
	},
	Load : function(){
		
		var _song = SONGS[GAME.GetSong()];
		
		document.getElementById("scores-title").innerHTML = (_song.title + " - " + _song.artist);
		document.getElementById("scores-list").appendChild(HIGHSCORES.Render(GAME.GetSong(), PLAYERS));
		
		NAVIGATION.Select("#scores-return button");
		NAVIGATION.Enable();
	},
	Render: function(){
		
	},
	OnStateChanged : function(evt){
		
	},
	Save: function(){
		
	},
	Retry: function(){
		GAME.SetScreen('stage', GAME.GetSong());
	},
	Return: function(){
		GAME.SetScreen('song-selection');
	},
	
	
	
	Dispose : function(){
		GAME.RemoveSuscriber(SCREENS.highscore._suscriberID);
		document.querySelector("#highscore").classList.remove("active");
	}
};


// Suscribe to states loop
document.addEventListener("highscore", SCREENS.highscore.OnStateChanged);