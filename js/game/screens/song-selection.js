SCREENS['song-selection'] = {
	_suscriberID : '',
	
	Display: function(){
		document.querySelector("#song-selection").classList.add("active");
		SCREENS['song-selection']._suscriberID = GAME.AddSuscriber(SCREENS['song-selection'].Render);
		NAVIGATION.Enable();
		for(var i in SONGS){
			SCREENS['song-selection'].AddSongElm(SONGS[i]);
		}
		NAVIGATION.Select("#song-selection-list div");
	},
	AddSongElm : function(song){
		var _songElm = document.createElement('div');
			_songElm.classList.add('song-element');
			_songElm.setAttribute('nav-enter', 'SCREENS[\'song-selection\'].SelectSong(\'' + song.guid + '\')');
			_songElm.innerHTML = ['<img src="https://i1.ytimg.com/vi/' + song.youtube + '/2.jpg"/>',
								  '<h2>' + song.title + '</h2>',
								  '<h3>' + song.artist + '</h3>',
								  '<p class="difficulty difficulty-' + song.difficulty + '"><span>🎸</span><span>🎸</span><span>🎸</span><span>🎸</span><span>🎸</span></span></p>'
								 ].join('');
		document.querySelector('#song-selection-list').appendChild(_songElm);
	},
	
	SelectSong : function(id){
		
		console.log("Selected song ", id);
		GAME.SetSong(id);
		GAME.currentSong.loadChart(function(){
			GAME.SetScreen('stage', {song: id});	
		});
	},
	
	Render: function(){
		
	},
	OnStateChanged : function(evt){
		
	},
	Dispose : function(){
		NAVIGATION.Disable();
		GAME.RemoveSuscriber(SCREENS['song-selection']._suscriberID);
		document.querySelector("#song-selection").classList.remove("active");
	}
};

// Suscribe to states loop
document.addEventListener("state", SCREENS['song-selection'].OnStateChanged);