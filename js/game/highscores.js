HIGHSCORES = {
	
	list : [],
	song : '',
	
	Sort : function(a,b){
		if(a.score === b.score) return 0;
		
		return (a.score < b.score ? -1 : 1);
	},
	
	Get : function(_song){
		HIGHSCORES.list = JSON.parse(localStorage.getItem("SCORES_" + _song.guid));
		if(HIGHSCORES.list === null){
			HIGHSCORES.list = [];
			for(var i = 0, l = 10; i < l; i += 1){
				HIGHSCORES.list.push({name: '---', score: 0, playing : false });
			}
		}
		HIGHSCORES.song = _song.guid;		
	},
	

	Render : function(_song, _players){
		HIGHSCORES.Get(_song);
		for( var i = 0, l = _players.length; i < l ; i+= 1){
			console.log({name: _players[i].name, score: _players[i].score, playing : true });
			HIGHSCORES.list.push({name: _players[i].name, score: _players[i].score, playing : true });
		}
		HIGHSCORES.list.sort(HIGHSCORES.Sort).reverse();
		HIGHSCORES.list = HIGHSCORES.list.slice(0, 10);
		
		var _elms = document.createElement('div');
		for(var i = 0, l = HIGHSCORES.list.length; i < l ; i += 1){
			
			var _score = HIGHSCORES.list[i];
			
			var _elm = document.createElement('div');
				_elm.setAttribute("class", "scores-item" + (_score.playing ? ' playing' : ''));
				_elm.innerHTML = [
						'<h3 class="scores-item-name">'+ (i+1) +". " + _score.name + '</h3>',
						'<h3 class="scores-item-number">' + _score.score + '</h3>'
					].join('');
			
			_elms.appendChild(_elm);
		}	
		
		return _elms;
	},
	
	Save : function(){
		localStorage.setItem("SCORES_" + HIGHSCORES.song, JSON.stringify(HIGHSCORES.list));
	}
	
};