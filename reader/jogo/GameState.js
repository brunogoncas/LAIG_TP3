function GameState() {

    this.board =
        [
            ['x', 'e', 'e', 'b', 'b', 'b', 'b', 'b', 'e', 'e', 'x'],
            ['e', 'e', 'e', 'e', 'e', 'b', 'e', 'e', 'e', 'e', 'e'],
            ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
            ['b', 'e', 'e', 'e', 'e', 'w', 'e', 'e', 'e', 'e', 'b'],
            ['b', 'e', 'e', 'e', 'w', 'w', 'w', 'e', 'e', 'e', 'b'],
            ['b', 'b', 'e', 'w', 'w', 'k', 'w', 'w', 'e', 'b', 'b'],
            ['b', 'e', 'e', 'e', 'w', 'w', 'w', 'e', 'e', 'e', 'b'],
            ['b', 'e', 'e', 'e', 'e', 'w', 'e', 'e', 'e', 'e', 'b'],
            ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
            ['e', 'e', 'e', 'e', 'e', 'b', 'e', 'e', 'e', 'e', 'e'],
            ['x', 'e', 'e', 'b', 'b', 'b', 'b', 'b', 'e', 'e', 'x']
        ];

    this.Pieces = [];
    this.whitePieces = [];
    this.whiteBlack = [];
    this.playersTurn = 1;

    this.selectedPiece;
    this.selectedPieceNewX;
    this.selectedPieceNewZ;

    this.undo = false;

    this.gametype = "HvsH";

    this.piecesOut = [];
    this.piecesAnimatingOut = [];

    this.animating = false;

    this.winner = 0;

    this.boards = [];
    this.boards.push(this.board);
    this.boardsFromProlog = [];

    //0 - Espera seleccao de peca de jogador, 1 - Espera seleccao de posicao para onde mover
    this.state = 0;

};

GameState.prototype = Object.create(Object.prototype);
GameState.prototype.constructor = GameState;

GameState.prototype.undoMove = function () {
    if (this.boards.length == 1) {
        return;
    }

    else {
        this.board = this.boards[this.boards.length - 1];
        this.boards.splice(this.boards.length - 1, 1);
    }

}