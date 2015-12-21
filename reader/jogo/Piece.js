function Piece(id, player, posX, posY, inGame) {
    this.id = id;
	this.player = player;
	this.posX = posX;
	this.posY = posY;
	this.inGame = inGame;
};

Piece.prototype = Object.create(Object.prototype);
Piece.prototype.constructor = Piece;
