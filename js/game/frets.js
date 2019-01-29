var fretType = [
	{	// 0 : nothing
		color: false,
		string: false,
		vibrato: false,
		before : []
	},
	{	// 1 : just a tap
		color: true,
		string: true,
		vibrato: false,
		before : []
	},
	{	// 2 : follows a tap if needed
		color: true,
		string: false,
		vibrato: false,
		before : [1]
	},
	{	// 3 : follows with vibrato if wanted
		color: true,
		string: false,
		vibrato: true,
		before : [1,2]
	}
]

var fretModels = [
	new THREE.BoxBufferGeometry(0, 0),
	new THREE.CylinderBufferGeometry(0.13,.2,.175,48),
	new THREE.BoxBufferGeometry(0.125, 0.125, 0.5),
	new THREE.BoxBufferGeometry(0.1,  0.125, 0.5),
];

var measureModel = new THREE.Mesh(new THREE.BoxBufferGeometry(3,0.01,.01), materials.white.clone());

var buildTrack = function(song, track){

	var fulltrack = new THREE.Group();
	
	for(var i = 0, l = song.tracks[track].length; i < l; i+=1){
		// Treat each measure
		var _measure = song.tracks[track][i];
		
		var _sep = measureModel.clone();
		_sep.position.z = -(i*4);
		_sep.position.y = -0.125;
		_sep.userData = null;
		fulltrack.add(_sep);
		
		// Treat each submember
		var _measureTime = _measure.length;		
		for(var j = 0, m = _measure.length; j < m; j+=1){
			var _submember = _measure[j];
			for(var k = 0, n = _submember.length; k < n; k+=1){
				if(_submember[k] === 0) continue;
				var _fret = new THREE.Mesh(fretModels[_submember[k]], materials[colorsOrder[k]].clone());
				_fret.userData = fretType[_submember[k]];
				_fret.position.z = -(i*4 + (j * (4/_measureTime)));
				_fret.position.x = (k - 2)*.5;
				
				fulltrack.add(_fret);	
			}
		}
	}
	
	return fulltrack;
	
};





