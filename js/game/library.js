var materials = {
	'green'	: new THREE.MeshLambertMaterial( { transparent: true, color: 0x00ff00 } ),
	'red'	: new THREE.MeshLambertMaterial( { transparent: true, color: 0xff0000 } ),
	'yellow': new THREE.MeshLambertMaterial( { transparent: true, color: 0xffff00 } ),
	'blue'	: new THREE.MeshLambertMaterial( { transparent: true, color: 0x0000ff } ),
	'orange': new THREE.MeshLambertMaterial( { transparent: true, color: 0xFF8800 } ),
	'gray'	: new THREE.MeshLambertMaterial( { transparent: true, color: 0x707070 } ), 
	'white'	: new THREE.MeshLambertMaterial( { transparent: true, color: 0xffffff } ),
	'black'	: new THREE.MeshLambertMaterial( { transparent: true, color: 0x101010 } )
};
var highlights = {
	'green'	: new THREE.MeshToonMaterial( { color: 0x00ff00 } ),
	'red'	: new THREE.MeshToonMaterial( { color: 0xff0000 } ),
	'yellow': new THREE.MeshToonMaterial( { color: 0xffff00 } ),
	'blue'	: new THREE.MeshToonMaterial( { color: 0x0000ff } ),
	'orange': new THREE.MeshToonMaterial( { color: 0xFFaa00 } ),
	'gray'	: new THREE.MeshToonMaterial( { color: 0x707070 } ), 
	'white'	: new THREE.MeshToonMaterial( { color: 0xffffff } )
};
var colorsOrder = [
	'green',
	'red',
	'yellow',
	'blue',
	'orange'
];


var box = new THREE.BoxGeometry( 1, 1, 1 );
var plane = new THREE.PlaneGeometry(3,10);
var color = new THREE.CylinderGeometry(0.235,.225,.1,48);
var trigger = new THREE.CylinderGeometry(0.175,.2,.1,48);
var string = new THREE.CylinderGeometry(0.05,0.05,10);

var ground = new THREE.Mesh(plane,materials.black);


var strings = {
	'green': new THREE.Mesh(string, materials.gray),
	'red': new THREE.Mesh(string, materials.gray),
	'yellow': new THREE.Mesh(string, materials.gray),
	'blue': new THREE.Mesh(string, materials.gray),
	'orange': new THREE.Mesh(string, materials.gray)
};

var colors = {
	'green': new THREE.Mesh(color, materials.green),
	'red': new THREE.Mesh(color, materials.red),
	'yellow': new THREE.Mesh(color, materials.yellow),
	'blue': new THREE.Mesh(color, materials.blue),
	'orange': new THREE.Mesh(color, materials.orange)
}


var triggers = {
	'green': new THREE.Mesh(trigger, materials.white),
	'red': new THREE.Mesh(trigger, materials.white),
	'yellow': new THREE.Mesh(trigger, materials.white),
	'blue': new THREE.Mesh(trigger, materials.white),
	'orange': new THREE.Mesh(trigger, materials.white)
}

var lights = [
	new THREE.AmbientLight(0x202020),
	new THREE.PointLight(0xffffff, 1, 10),
	new THREE.PointLight(0xffffff, 1, 10),
	new THREE.PointLight(0xffffff, 1, 10),
	new THREE.PointLight(0xffffff, 1, 10)
];


var SONGS = {
	
};
