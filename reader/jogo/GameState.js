function GameState() {

	this.board = [
	[	'x',	'e',	'e',	'b',	'b',	'b',	'b',	'b',	'e',	'e',	'x'	],
	[	'e',	'e',	'e',	'e',	'e',	'b',	'e',	'e',	'e',	'e',	'e'	],
	[	'e',	'e', 	'e', 	'e', 	'e', 	'e',	'e',	'e',	'e',	'e',	'e'	],
	[	'b',	'e',	'e', 	'e', 	'e', 	'w', 	'e', 	'e', 	'e',	'e', 	'b'	],
	[	'b',	'e',	'e', 	'e', 	'w', 	'w', 	'w', 	'e', 	'e', 	'e',	'b'	],
	[	'b', 	'b', 	'e', 	'w', 	'w', 	'k', 	'w', 	'w',	'e',	'b',	'b'	],
	[	'b', 	'e', 	'e', 	'e', 	'w', 	'w', 	'w', 	'e', 	'e',	'e',	'b'	],
	[	'b', 	'e',	'e', 	'e', 	'e', 	'w', 	'e', 	'e', 	'e',	'e',	'b'	],
	[	'e', 	'e', 	'e', 	'e',	'e', 	'e', 	'e', 	'e', 	'e',	'e',	'e'	],
	[	'e', 	'e', 	'e', 	'e',	'e', 	'b', 	'e', 	'e', 	'e',	'e',	'e'	],
	[	'x', 	'e', 	'e', 	'b',	'b', 	'b', 	'b', 	'b', 	'e',	'e',	'x'	]
];
	this.Pieces = [];
	this.whitePieces = [];
	this.whiteBlack = [];

};

GameState.prototype = Object.create(Object.prototype);
GameState.prototype.constructor = GameState;
