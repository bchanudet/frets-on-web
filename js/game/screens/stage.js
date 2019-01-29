SCREENS.stage = {
	_suscriberID : '',
	_scene : '',
	_camera : '',
	_renderer : '',
	_tracks : [],
	
	_pool : {},
	_poolReady : false,
	
	_countDownValue : 0,
	_countDownID : null,
	
	_playersStatesModels : {},
	_defaultStatesModels : {
		green : { light: null, button: null },
		red : { light: null, button: null },
		yellow : { light: null, button: null },
		blue : { light: null, button: null },
		orange : { light: null, button: null }
	},
	
	
	Display: function(params){
		document.querySelector("#stage").classList.add("active");
		SCREENS.stage._suscriberID = GAME.AddSuscriber(SCREENS.stage.Render);
		
		document.addEventListener("state", SCREENS.stage.OnStateChanged);
		document.addEventListener("inputs", SCREENS.stage.OnInputReceived);
		document.addEventListener("youtube", SCREENS.stage.OnYoutubeChanged);
		window.addEventListener( 'resize', SCREENS.stage.OnWindowResize, false);
		
		if(GAME.currentMode !== 'EDIT'){
			document.querySelector("#EDITOR").style.display = "none";
		}
		
		SCREENS.stage.Load(SONGS[params.song]);
	},
	Load : function(song){
		if(YOUTUBE !== undefined){
			YOUTUBE.cueVideoById(song.youtube, 0, 'hd1080');
		}
		
				
		SCREENS.stage._scene = new THREE.Scene();
		SCREENS.stage._camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 0.1, 10);
		SCREENS.stage._renderer = new THREE.WebGLRenderer({
			alpha:true,
			antialias:true,
			canvas: document.querySelector("#stage-3d"),	
		});
		
		SCREENS.stage._renderer.setSize( window.innerWidth, window.innerHeight );
		SCREENS.stage._renderer.shadowMap.enabled = true;
		SCREENS.stage._renderer.shadowMap.type = THREE.BasicShadowMap;
		
		// Camera setup
		SCREENS.stage._camera.position.z = 2.75;
		SCREENS.stage._camera.position.y = 2;
		
		// Add Fog
		SCREENS.stage._scene.fog = new THREE.Fog(0x000000,8,12);
		
		
		// Add players
		for(var i = 0, l = PLAYERS.length; i < l; i+= 1){
			
			var _player = PLAYERS[i];
			
			
			var _track = new THREE.Group();
				_track.add(SCREENS.stage.GetPlayerScene(_player));
				_track.add(SCREENS.stage.GetPlayerTrack(_player));
				_track.position.x = i;
				_track.userData = _player.guid;
			
			SCREENS.stage._tracks[i] = _track;
			
			SCREENS.stage._scene.add(_track);	
			
		}
		
		
		// Add lights
		SCREENS.stage._scene.add(SCREENS.stage.AddLightsToScene());
		
		
		// Saying to game that we are ready
		GAME.SetState(GAME.C.STATES.READY);
		
	},
	
	LoadPool : function(){
		var _tap = new THREE.OBJLoader();
			_tap.load('./obj/taps.obj', function (_object) {
				//_object.visible = false;
				SCREENS.stage._pool['tap'] = _object;
				SCREENS.stage._poolReady = true;
			});
	},
	
	GetPlayerScene : function(player){
		// Create a player group
		var _group = new THREE.Group();
		
		SCREENS.stage._playersStatesModels[player.guid] = Object.assign({}, SCREENS.stage._defaultStatesModels);
		
		
		// Add the neck
		var _neck = new THREE.OBJLoader();
		_neck.load('./obj/neck.obj', function (_object) {
			_object.traverse(function(_child){
				_child.material = STAGELIBRARY.materials.neck;
				_child.receiveShadow = true;
			});
			_object.scale.x *= player.level;
			_group.add(_object);
		});
		
		// Add the strings
		for(var i = 0, l = player.level; i < l; i+= 1){
			var _string = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.04,0.04,24), STAGELIBRARY.materials.metal);
				_string.position.x = (i - (player.level-1)/2)*.5;
				_string.rotation.x = -Math.PI/2;
				_string.position.z = -4;
				_string.castShadow = true;
			
			_group.add(_string);
		}
		
		// Try obj
		for(var i = 0, l = player.level; i < l; i+= 1){
			(function(_group, _i){
				var _color = new THREE.OBJLoader();
				_color.load('./obj/button.obj', function (_object) {
					_object.position.x = (_i - (player.level-1)/2)*.5;
					_object.traverse(function(_child){
						if(_child.name === 'COLOR') {
							_child.material = STAGELIBRARY.materials[GAME.C.COLORS[_i]];
							_child.castShadow = true;
						} 
						else if(_child.name === 'BUTTON'){
							//_child.position.y = -0.05;
							_child.material = STAGELIBRARY.materials.white;
							SCREENS.stage._playersStatesModels[player.guid][GAME.C.COLORS[_i]].button = _child;
							//player.SetColorModel(GAME.C.COLORS[_i], _child);
						}
					});
					_group.add(_object);
				});
			})(_group, i);
		}
		
		// Add specific lights for buttons power!
		for(var i = 0, l = player.level; i < l; i+= 1){
			var _spot = new THREE.PointLight(0xFFAA00, 0, 4);
				_spot.position.z = 0;
				_spot.position.x = (i - (player.level-1)/2)*.5;
				_spot.position.y = 1;
			_group.add(_spot);
			
			SCREENS.stage._playersStatesModels[player.guid][GAME.C.COLORS[i]].light = _spot;
		}
		 
		
		return _group;
	},
	
	AddLightsToScene : function(){
		var _group = new THREE.Group();
		
		var _ambient = new THREE.HemisphereLight( 0xffffff, 0x303060, 0.55 );
		_group.add(_ambient);
	
		var _spot = new THREE.PointLight(0xFFBAB2, 1.2, 15);
			_spot.position.z = 0;
			_spot.position.x = 3;
			_spot.position.y = 2;
			_spot.castShadow = true;
			_spot.shadow.camera.near = 0.1;
			_spot.shadow.camera.far = 15;
			_spot.shadow.bias = 0.01;
		
		_group.add(_spot);
		
		var _spot2 = new THREE.PointLight(0xC9ECFF, 0.75, 10);
			_spot2.position.z = -2;
			_spot2.position.x = -2;
			_spot2.position.y = 2;
		
		_group.add(_spot2);
		
		var _spot3 = new THREE.PointLight(0xA49479, 0.75, 10);
			_spot3.position.z = -5;
			_spot3.position.x = 0;
			_spot3.position.y = 1;
		
		_group.add(_spot3);
		
		return _group;
	},
	
	GetPlayerTrack : function(_player){
		var _notes = GAME.currentSong.getTrack("EasySingle");
		var _level = _player.level;
		
		var _trackGroup = new THREE.Group();
			_trackGroup.name = "trackGroup";
		
		for(var i = 0, l = _notes.length; i < l; i += 1){
			var _tap = _notes[i];			
						
			var _group = new THREE.Group();
			var _tapModel = null;
			
			// custom properties
			_group.userData = _tap;
			_group.visible = true;
			_group.name = "tap";
			_group.onUpdate = function(e){
				this.position.z = Math.max(-10, e.time - this.userData.s);
				this.position.y = (this.position.z > -10 && this.position.z < 1 ? 0 : -0.25);
				if(this.position.z > 0){
					this.traverse(function(obj) { 
						if(obj.name === "TAP_BODY"){
							obj.material = STAGELIBRARY.materials.black;
						}
					});
				}
				if(this.position.z > 2){
					this.remove();
				}
			}
			_group.getStartTime = function(){
				return this.userData.s;
			}
			//SCREENS.stage._scene.addEventListener('Update', _group.OnUpdate);
			
			if(_tap.c == 0){
				_tapModel = SCREENS.stage._pool['tap'].clone();
				_tapModel.traverse(function(obj) { 
					obj.material = (obj.name === "TAP_BODY" ? STAGELIBRARY.materials.green  : STAGELIBRARY.materials.white); 
					obj.castShadow = true;
				});
				_tapModel.position.x = (0 - (_level-1)/2)*.5;
				_group.add(_tapModel);
			}
			if(_tap.c == 1){
				_tapModel = SCREENS.stage._pool['tap'].clone();
				_tapModel.traverse(function(obj) { obj.material = (obj.name === "TAP_BODY" ? STAGELIBRARY.materials.red  : STAGELIBRARY.materials.white); obj.castShadow = true; });
				_tapModel.position.x = (1 - (_level-1)/2)*.5;
				_group.add(_tapModel);
			}			
			if(_tap.c == 2){
				_tapModel = SCREENS.stage._pool['tap'].clone();
				_tapModel.traverse(function(obj) { obj.material = (obj.name === "TAP_BODY" ? STAGELIBRARY.materials.yellow : STAGELIBRARY.materials.white); obj.castShadow = true; });
				_tapModel.position.x = (2 - (_level-1)/2)*.5;
				_group.add(_tapModel);
			}
			if(_tap.c == 3){
				_tapModel = SCREENS.stage._pool['tap'].clone();
				_tapModel.traverse(function(obj) { obj.material = (obj.name === "TAP_BODY" ? STAGELIBRARY.materials.blue  : STAGELIBRARY.materials.white);  obj.castShadow = true;});
				_tapModel.position.x = (3 - (_level-1)/2)*.5;
				_group.add(_tapModel);
			}
			if(_tap.c == 4){
				_tapModel = SCREENS.stage._pool['tap'].clone();
				_tapModel.traverse(function(obj) { obj.material = (obj.name === "TAP_BODY" ? STAGELIBRARY.materials.orange : STAGELIBRARY.materials.white); obj.castShadow = true; });
				_tapModel.position.x = (4 - (_level-1)/2)*.5;
				_group.add(_tapModel);
			}
			
			_group.position.z = -5;
			
			_trackGroup.add(_group);
		}
		
		return _trackGroup;
	},
	
	Render: function(){		
		SCREENS.stage.RenderTracks();
		
		SCREENS.stage._renderer.render(SCREENS.stage._scene, SCREENS.stage._camera);	
		
		document.querySelector("#stage-score").innerHTML = PLAYERS[0].score;
	},
	
	RenderTracks : function(){
		// current time
		if(YOUTUBE === undefined || YOUTUBE === null){ return; }
		
		var _time = YOUTUBE.getCurrentTime();
		
		for(var i = 0, l = SCREENS.stage._tracks.length; i < l; i+= 1){
			var _trackgroup = SCREENS.stage._tracks[i].getObjectByName('trackGroup');
			if(_trackgroup === undefined) continue;
			
			_trackgroup.children.filter(tap => tap.name === 'tap').forEach(tap => tap.onUpdate({time:_time}));
		}
		
	},
		
	OnStateChanged : function(evt){
		if(evt.detail.newState === GAME.C.STATES.READY){
			SCREENS.stage.ShowPauseScreen("READY TO ROCK ?", "Press [Start] to begin");
			return; 
		}
		if(evt.detail.newState === GAME.C.STATES.PLAYING && (evt.detail.oldState === GAME.C.STATES.READY || evt.detail.oldState === GAME.C.STATES.PAUSED)){
			SCREENS.stage.LaunchCountDown(3, function(){
				YOUTUBE.playVideo();
				return;	
			});
			SCREENS.stage.HidePauseScreen();
		}
		
		if(evt.detail.newState === GAME.C.STATES.PAUSED){
			SCREENS.stage.ShowPauseScreen("Game paused", "Press [START] to resume");
			YOUTUBE.pauseVideo();
			return;
		}
	},
	OnInputReceived : function(evt){
		
		var _time = (YOUTUBE === undefined || YOUTUBE === null) ? 0 :  YOUTUBE.getCurrentTime();
		
		
		for(var i = 0, l = PLAYERS.length; i < l; i+= 1){
			
			var _player = PLAYERS[i];
			
			// Reset display of inputs
			SCREENS.stage.ResetPlayerState(_player);
			
			// If one of the player press [Start] button
			if(evt.detail.buttons.lastIndexOf("player." + _player.guid + ".start") > -1){
				// Switch the state ! 
				GAME.SetState((GAME.currentState === GAME.C.STATES.PLAYING ? GAME.C.STATES.PAUSED : GAME.C.STATES.PLAYING));
				return;
			}
			
			// If we are not playing, we stop here
			if(GAME.currentState !== GAME.C.STATES.PLAYING){
				return;
			}
			
			
			var _trackgroup = SCREENS.stage._tracks[i].getObjectByName('trackGroup');
			var _keysToCheck = [];
						
			// Check for basic input detection
			_player.CheckInputState(evt.detail.buttons);
			
			// Filter on pressed input
			if(_player._hold.green){
				var _keys = _trackgroup.children.filter(tap =>  tap.name === 'tap' && tap.userData.c == 0
																&& (tap.getStartTime()*1000 - Math.round(_time*1000)) < 200 
																&& (tap.getStartTime()*1000 - Math.round(_time*1000)) > -100);
			
				_keysToCheck = _keysToCheck.concat(_keys);
				
				SCREENS.stage.SetPlayerState(SCREENS.stage._playersStatesModels[_player.guid].green, true);
			}
			if(_player._hold.red){
				var _keys = _trackgroup.children.filter(tap =>  tap.name === 'tap' && tap.userData.c == 1
																&& (tap.getStartTime()*1000 - Math.round(_time*1000)) < 200 
																&& (tap.getStartTime()*1000 - Math.round(_time*1000)) > -100);
				_keysToCheck = _keysToCheck.concat(_keys);
				
				SCREENS.stage.SetPlayerState(SCREENS.stage._playersStatesModels[_player.guid].red, true);
			}
			if(_player._hold.yellow){
				var _keys = _trackgroup.children.filter(tap =>  tap.name === 'tap' && tap.userData.c == 2
																&& (tap.getStartTime()*1000 - Math.round(_time*1000)) < 200 
																&& (tap.getStartTime()*1000 - Math.round(_time*1000)) > -100);
				_keysToCheck = _keysToCheck.concat(_keys);
				
				SCREENS.stage.SetPlayerState(SCREENS.stage._playersStatesModels[_player.guid].yellow, true);
			}
			if(_player._hold.blue){
				var _keys = _trackgroup.children.filter(tap =>  tap.name === 'tap' && tap.userData.c == 3
																&& (tap.getStartTime()*1000 - Math.round(_time*1000)) < 200 
																&& (tap.getStartTime()*1000 - Math.round(_time*1000)) > -100);
				_keysToCheck = _keysToCheck.concat(_keys);
				
				SCREENS.stage.SetPlayerState(SCREENS.stage._playersStatesModels[_player.guid].blue, true);
			}
			if(_player._hold.orange){
				var _keys = _trackgroup.children.filter(tap =>  tap.name === 'tap' && tap.userData.c == 4
																&& (tap.getStartTime()*1000 - Math.round(_time*1000)) < 200 
																&& (tap.getStartTime()*1000 - Math.round(_time*1000)) > -100);
				_keysToCheck = _keysToCheck.concat(_keys);
				
				SCREENS.stage.SetPlayerState(SCREENS.stage._playersStatesModels[_player.guid].orange, true);
			}
			
			console.log('tocheck',_time,_player._hold,_keysToCheck);
			
			if(!_player._stringHit){
				return;
			}
			
			
			// Check all keys to check
			_keysToCheck.forEach(function(_key){
				var _offset = Math.abs(_key.getStartTime()*1000 - Math.round(_time*1000));
				
				if(_offset < 25) {
					_player.IncrementScore(10);
				}
				else if(_offset < 100) {
					_player.IncrementScore(5);
				}
				else{
					_player.IncrementScore(2);
				}
				
				// We remove the key so we won't track it anymore.
				_trackgroup.remove(_key);
			});
		}
	},
	OnYoutubeChanged : function(evt){
		if(evt.detail.state === 6){
			GAME.SetState(GAME.C.STATES.FINISHED);
			GAME.SetScreen('highscore');
		}
	},	
	OnWindowResize : function(){
		SCREENS.stage._camera.aspect = window.innerWidth / window.innerHeight;
		SCREENS.stage._camera.updateProjectionMatrix();
		SCREENS.stage._renderer.setSize(window.innerWidth, window.innerHeight);
	},
	Dispose : function(){
		GAME.RemoveSuscriber(SCREENS.stage._suscriberID);
		document.querySelector("#stage").classList.remove("active");
		document.removeEventListener("state", SCREENS.stage.OnStateChanged);
		document.removeEventListener("inputs", SCREENS.stage.OnInputReceived);
	},
	
	ShowPauseScreen : function(title, subtitle){
		document.querySelector('#pause-screen').style.display = 'block';
		document.querySelector('#pause-text h1').innerHTML = title;
		document.querySelector('#pause-text h3').innerHTML = subtitle;
	},
	HidePauseScreen : function(){
		document.querySelector('#pause-screen').style.display = 'none';
	},
	
	LaunchCountDown : function(seconds, callback){
		console.log("Launch Countdown");
		window.setTimeout(callback, seconds * 1000);
		
		
		SCREENS.stage._countDownValue = seconds;
		SCREENS.stage._countDownID = window.setInterval(function(){
			SCREENS.stage._countDownValue -= 1;
			var cdElm = document.querySelector("#countdown");
			
			cdElm.classList.remove("scaling");
			cdElm.innerHTML = SCREENS.stage._countDownValue;
			cdElm.classList.add("scaling");
			
			if(SCREENS.stage._countDownValue <= 0){
				cdElm.style.display = "none";
				window.clearInterval(SCREENS.stage._countDownID);
			}
		}, 1000);
		document.querySelector("#countdown").style.display = "block";
		document.querySelector("#countdown").innerHTML = SCREENS.stage._countDownValue;
		
	},
	
	ResetPlayerState: function(player){
		for(var i = 0, l = player.level; i < l; i+= 1){
			SCREENS.stage.SetPlayerState(SCREENS.stage._playersStatesModels[player.guid][GAME.C.COLORS[i]], false);
		}
			
	},
	SetPlayerState: function(state, enabled){
		if(state.button !== null){
			state.button.position.y = (enabled ? -0.025 : 0);
			state.button.material = (enabled ? STAGELIBRARY.highlights.white : STAGELIBRARY.materials.white);
		}

		if(state.light !== null){
			state.light.intensity = (enabled ? .25 : 0);
		}
	}
};
 
STAGELIBRARY = {
	materials : {
		'green'	: new THREE.MeshPhysicalMaterial({ color: 0x00ff00, metalness: 0.85}),
		'red'	: new THREE.MeshPhysicalMaterial({ color: 0xff0000, metalness: 0.85}),
		'yellow': new THREE.MeshPhysicalMaterial({ color: 0xffff00, metalness: 0.85}),
		'blue'	: new THREE.MeshPhysicalMaterial({ color: 0x0000ff, metalness: 0.85}),
		'orange': new THREE.MeshPhysicalMaterial({ color: 0xff8800, metalness: 0.85}),
		'gray'	: new THREE.MeshLambertMaterial( { color: 0x707070 } ), 
		'white'	: new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.85}),
		'black'	: new THREE.MeshLambertMaterial( { color: 0x101010 } ),
		'metal' : new THREE.MeshPhysicalMaterial({ color: 0xFFFFFF, metalness: 1}),
		'neck' :  new THREE.MeshPhysicalMaterial({ color: 0x4E321D, metalness: 0.95, reflectivity: 1, clearCoat: 1}),
	},
	highlights : {
		'white'	: new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.85, emissive: 0x999999})
	}
};
