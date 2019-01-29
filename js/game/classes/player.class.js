Player = function(guid, name){
	this.guid = guid;
	this.name = name;
	this.mapping = null;
	
	this.level = 5;
		
	this.track = 'EasySingle';
	this.score = 0;
	this.streak = 0;
	
	this._buttons = {};
	this._lights = {};
	
	this._hold = {
		'green' : false,
		'red': false,
		'yellow': false,
		'blue': false,
		'orange': false
	};
	this._stringHit = false;
}


Player.prototype.SetMapping = function(mapping, padNb){
	this.mapping = Object.assign({},mapping);
	for(var i in this.mapping){
		this.mapping[i] = (this.mapping[i].replace('¤', padNb));
	}
}

Player.prototype.CheckInputState = function(inputs){
		
	// Green
	if(inputs.lastIndexOf('player.' + this.guid + '.green') > -1){
		this._hold.green = true;
	}
	else if((inputs.lastIndexOf('player.' + this.guid + '.green') === -1)){
		this._hold.green = false;
	}
	
	// Red
	if(inputs.lastIndexOf('player.' + this.guid + '.red') > -1){
		this._hold.red = true;
	}
	else if((inputs.lastIndexOf('player.' + this.guid + '.red') === -1)){
		this._hold.red = false;
	}
	
	// Yellow
	if(inputs.lastIndexOf('player.' + this.guid + '.yellow') > -1 ){
		this._hold.yellow = true;
	}
	else if((inputs.lastIndexOf('player.' + this.guid + '.yellow') === -1)){
		this._hold.yellow = false;
	}
	
	// Blue
	if(inputs.lastIndexOf('player.' + this.guid + '.blue') > -1){
		this._hold.blue = true;
	}
	else if((inputs.lastIndexOf('player.' + this.guid + '.blue') === -1)){
		this._hold.blue = false;
	}
	
	// Orange	
	if(inputs.lastIndexOf('player.' + this.guid + '.orange') > -1){
		this._hold.orange = true;
	}
	else if((inputs.lastIndexOf('player.' + this.guid + '.orange') === -1)){
		this._hold.orange = false;
	}
	
	if(inputs.lastIndexOf('player.' + this.guid + '.up') > -1 || inputs.lastIndexOf('player.' + this.guid + '.down') > -1){
		this._stringHit = true;
	}
	else if(inputs.lastIndexOf('player.' + this.guid + '.up') === -1 && inputs.lastIndexOf('player.' + this.guid + '.down') === -1){
		this._stringHit = false;
	}
}

Player.prototype.IncrementScore = function(increment){
	this.score += increment;
}

Player.prototype.IncrementStreak = function(){
	this.streak += 1;
}

Player.prototype.ResetStreak = function(){
	this.streak = 0;
}
