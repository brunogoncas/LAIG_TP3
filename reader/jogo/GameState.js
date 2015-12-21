function GameState() {
    
	this.board = [
		[	'x',	' ',	' ',	'b',	'b',	'b',	'b',	'b',	' ',	' ',	'x'	],
		[	' ',	' ',	' ',	' ',	' ',	'b',	' ',	' ',	' ',	' ',	' '	],
		[	' ',	' ', 	' ', 	' ', 	' ', 	' ',	' ',	' ',	' ',	' ',	' '	],
		[	'b',	' ',	' ', 	' ', 	' ', 	'w', 	' ', 	' ', 	' ',	' ', 	'b'	],
		[	'b',	' ',	' ', 	' ', 	'w', 	'w', 	'w', 	' ', 	' ', 	' ',	'b'	],
		[	'b', 	'b', 	' ', 	'w', 	'w', 	'k', 	'w', 	'w',	' ',	'b',	'b'	],
		[	'b', 	' ', 	' ', 	' ', 	'w', 	'w', 	'w', 	' ', 	' ',	' ',	'b'	],
		[	'b', 	' ',	' ', 	' ', 	' ', 	'w', 	' ', 	' ', 	' ',	' ',	'b'	],
		[	' ', 	' ', 	' ', 	' ',	' ', 	' ', 	' ', 	' ', 	' ',	' ',	' '	],
		[	' ', 	' ', 	' ', 	' ',	' ', 	'b', 	' ', 	' ', 	' ',	' ',	' '	],
		[	'x', 	' ', 	' ', 	'b',	'b', 	'b', 	'b', 	'b', 	' ',	' ',	'x'	]
	];
	
	this.pieces = [];

};

GameState.prototype = Object.create(Object.prototype);
GameState.prototype.constructor = GameState;