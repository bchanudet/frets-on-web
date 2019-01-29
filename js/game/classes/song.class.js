Song = function(guid){
	this.guid = guid;
	this.artist = "";
	this.title = "";
	this.chart = "";
	
	this.signature = 4;
	this.resolution = 192;
	this.chart_offset = 0;
	
	this.bpms = [];
	this.tracks = {};
	this.events = [];
	
}
/*
Song.LoadLines = function(fullFile, key){
	
}*/

Song.prototype.loadDescription = function(description){
	
	console.log("description", description);
	this.artist = description.artist;
	this.chart = description.chart;
	this.youtube = description.youtube;
	this.title = description.title;
	this.chart_offset = description.chart_offset;
}

Song.prototype.loadChart = function(callBack){
	
	var $this = this;
	console.log("loading", $this.chart);
	fetch($this.chart)
  		.then(function(response) {
    		return response.text();
  		})
  		.then(function(chartTxt) {
			songRegexp = /\[Song\]\s+\{([^\}]+)/gmi;
    		$this.parseSong(songRegexp.exec(chartTxt)[1].split('\r\n'));
		
			timeRegexp = /\[SyncTrack\]\s+\{([^\}]+)/gmi;
    		$this.parseBpms(timeRegexp.exec(chartTxt)[1].split('\r\n'));
		
			singleEasy = /\[EasySingle\]\s+\{([^\}]+)/gmi;
    		$this.parseTrack('EasySingle',singleEasy.exec(chartTxt)[1].split('\r\n')); 
		
			$this.deduceTrackTimes('EasySingle');
		
			console.log($this);
		
			if(callBack !== undefined)
				callBack();
  		});
}

Song.prototype.parseSong = function(lines){
	
	var keyValueRegExp = /^(\w+) = (.+)$/;
	 
	for(var i=0, l=lines.length; i<l; i+= 1){
		var line = lines[i].trim();
		var matches = keyValueRegExp.exec(line);
		
		//console.log(JSON.stringify(line), matches);
		if(matches === null){
			continue;
		}
		
		switch(matches[1]){
			case 'Resolution':
				this.resolution = parseInt(matches[2]);
				break;
		}
	}
	
};

Song.prototype.parseBpms = function(lines){
	
	var keyValueRegExp = /^(\d+) = (\w+) (\d+)$/;
	 
	for(var i=0, l=lines.length; i<l; i+= 1){
		var line = lines[i].trim();
		var matches = keyValueRegExp.exec(line);
		
		//console.log(line, matches);
		if(matches === null){
			continue;
		}
				
		switch(matches[2]){
			case 'B':
				this.bpms.push(new BPM(matches[1],matches[3]));
				break;
		}
	}
	
	this.deduceBPMTimes();
}

Song.prototype.parseTrack = function(trackName, lines){
	var keyValueRegExp = /^(\d+) = (\w+) (\d+) (\d+)$/;
	
	var taps = [];
		 
	for(var i=0, l=lines.length; i<l; i+= 1){
		var line = lines[i].trim();
		var matches = keyValueRegExp.exec(line);
		
		//console.log(line, matches);
		if(matches === null){
			continue;
		}
				
		switch(matches[2]){
			case "N":
				taps.push(new Note(matches[1],matches[3],matches[4]))
				break;
		}
	}
	
	this.tracks[trackName] = taps;
}

Song.prototype.deduceBPMTimes = function(){
	
	var startTime = 0 + (this.chart_offset*1000000);
	var lastTick = 0;
	var µsPerBeat = 0;
	
	for(var i=0, l=this.bpms.length; i<l; i+= 1){
		this.bpms[i].setTime(startTime + ((this.bpms[i].tick - lastTick)*µsPerBeat)/this.resolution);
		this.bpms[i].setµsPerBeat(60000000000 / this.bpms[i].bpm);
		
		startTime = this.bpms[i].time;
		lastTick = this.bpms[i].tick;
		µsPerBeat = this.bpms[i].µsPerBeat;
	}
	
}

Song.prototype.deduceTrackTimes = function(trackName){
	
	var track = this.tracks[trackName];
	
	for(var i=0, l=track.length; i<l; i+= 1){
		
		var bpm = this.findBPMBeforeTick(track[i].startTick);
				
		if(!bpm){
			continue;
		}
		
		track[i].setStartAndDuration(
			(bpm.time + ((track[i].startTick - bpm.tick) * bpm.µsPerBeat / this.resolution)),
			((track[i].durationTicks) * bpm.µsPerBeat / this.resolution)
		);
	}
}

Song.prototype.findBPMBeforeTick = function(tick){
	
	var bpm = null;
	
	for(var i=0, l=this.bpms.length; i<l; i+= 1){
		
		if(this.bpms[i].tick > tick) {
			return bpm;
		}
			
		bpm = this.bpms[i];
	}
	
	return bpm;
}

Song.prototype.getTrack = function(trackName){
	
	console.log("getting track for", trackName);
	
	if(this.tracks[trackName] === undefined){
		
		console.error("track not found for", trackName, this.tracks);
		return [];
	}
	
	var taps = [];
	
	for(var i=0, l=this.tracks[trackName].length; i<l; i+= 1){
		var note = this.tracks[trackName][i];
		
		taps.push({
			s: note.start,
			d: note.duration,
			c: note.note
		});
	}
	
	return taps; 
}




BPM = function(tick, bpm){
	this.tick = parseInt(tick);
	this.bpm = parseInt(bpm);
	this.µsPerBeat = 0;
	this.time = 0;
}
BPM.prototype.setTime = function(time){
	this.time = parseInt(time);
}
BPM.prototype.setµsPerBeat = function(µsPerBeat){
	this.µsPerBeat = parseInt(µsPerBeat);
}


Note = function(tick, note, duration){
	this.startTick = parseInt(tick);
	this.note = parseInt(note);
	this.durationTicks = parseInt(duration);
	
	this.start = 0;
	this.duration = 0;
}
Note.prototype.setStartAndDuration = function(start, duration){
	console.log("StartAndDuration", start, duration)
	this.start = start/1000000;
	this.duration = duration/1000000;
}
