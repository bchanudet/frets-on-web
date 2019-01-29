var scene 	= new THREE.Scene();
scene.fog = new THREE.Fog(0x000000,7,9);

var camera 	= new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 0.1, 10);
var currentSong = 'itsmylife';


var track 	= buildTrack(SONGS[currentSong], 'guitar');


var renderer = new THREE.WebGLRenderer({
	alpha:true,
	antialias:true,
	canvas: document.querySelector("#scene"),	
});

renderer.setSize( window.innerWidth, window.innerHeight );


scene.add(ground);

ground.rotation.x = -Math.PI/2;
ground.position.y = -0.15;
ground.position.z = -4.5;

var l = 0;
for(var i in strings){
	scene.add(strings[i]);
	strings[i].position.x = (l - 2)*.5;
	strings[i].rotation.x = -Math.PI/2;
	strings[i].position.z = -4;
	l++;
}

l=0;
for(var i in colors){
	scene.add(colors[i]);
	colors[i].position.x = (l - 2)*.5;
	colors[i].position.z = 0;
	l++;
}
l=0;
for(var i in triggers){
	scene.add(triggers[i]);
	triggers[i].position.x = (l - 2)*.5;
	triggers[i].position.z = 0;
	l++;
}

for(var i = 0, l = lights.length; i < l; i+=1){
	scene.add(lights[i]);
	if(i > 0){
		lights[i].position.x = ((i-1)*6) - 3;
		lights[i].position.y = 2;
		lights[i].position.z = 3;
	}
}


// Add track

scene.add(track);

camera.position.z = 3;
camera.position.y = 2;


inputs = navigator.getGamepads();


var time = (new Date()).valueOf();

var render = function () {
	requestAnimationFrame( render );
	
	var _nowTime = (new Date().valueOf());
	var _deltaTime = _nowTime - time;
	time = _nowTime;
	

	for(var i in triggers){
		triggers[i].position.y = 0.05;
		triggers[i].material = materials.white;
		colors[i].material = materials[i];
	}
	
	
	inputs = navigator.getGamepads();
	
	if(inputs.length > 0){
		if(inputs[0].buttons[12].pressed || inputs[0].buttons[13].pressed){
			if(inputs[0].buttons[0].pressed){
				triggers['green'].position.y = 0.018;
				triggers['green'].material = highlights['white'];
			}
			if(inputs[0].buttons[1].pressed){
				triggers['red'].position.y = 0.018;
				triggers['red'].material = highlights['white'];
			}
			if(inputs[0].buttons[2].pressed){
				triggers['blue'].position.y = 0.018;
				triggers['blue'].material = highlights['white'];
			}
			if(inputs[0].buttons[3].pressed){
				triggers['yellow'].position.y = 0.018;
				triggers['yellow'].material = highlights['white'];
			}
		}
	}
	
	track.translateZ(4*(SONGS[currentSong].tempo/120)*(_deltaTime/1000));
	for(var i = 0, l = track.children.length; i < l; i += 1){
		if(track.children[i].userData === null){ 
			continue;
		}
		var _pos = track.children[i].getWorldPosition().z;
		if(_pos > -.275){
			track.children[i].visible = false;
		}
		
	}
	

	renderer.render(scene, camera);
};

render();