/********************************************************************************************
*										tafl_1												*
*									Bruno Gonçalves											*
*									Ivo Lima da Silva										*
*********************************************************************************************/

:- use_module(library(lists)).
:- use_module(library(random)).

/********************************************************************************************
* Declaração do jogadores, de quem pertence as peças e das peças.							*
*********************************************************************************************/

player1_soldier(b).
player2_soldier(w).

player(player1).
player(player2).

piece_owner(1,b).
piece_owner(2,w).
piece_owner(2,k).

column_row(1).
column_row(2).
column_row(3).
column_row(4).
column_row(5).
column_row(6).
column_row(7).
column_row(8).
column_row(9).
column_row(10).
column_row(11).

/********************************************************************************************
* Criação do tabuleiro de jogo e tabuleiros de teste.										*
*********************************************************************************************/

board([
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
]).

board2([
	[	'x',	'e',	'e',	'b',	'b',	'b',	'b',	'b',	'e',	'b',	'x'	],
	[	'e',	'e',	'e',	'w',	'e',	'b',	'e',	'e',	'e',	'e',	'e'	],
	[	'e',	'e', 	'e', 	'e', 	'b', 	'k',	'b',	'e',	'b',	'e',	'e'	],
	[	'e',	'e',	'b',	'w',	'e',	'e',	'e',	'e',	'e',	'e',	'e'	],
	[	'e',	'e', 	'w', 	'e', 	'b', 	'b',	'b',	'e',	'b',	'e',	'e'	],
	[	'b', 	'w', 	'e', 	'w', 	'b', 	'e', 	'w', 	'w',	'e',	'b',	'b'	],
	[	'b', 	'e', 	'b', 	'b', 	'w', 	'w', 	'w', 	'e', 	'e',	'e',	'b'	],
	[	'b', 	'e',	'e', 	'e', 	'e', 	'w', 	'e', 	'e', 	'e',	'e',	'b'	],
	[	'e', 	'b', 	'w', 	'e',	'e', 	'e', 	'e', 	'b', 	'e',	'e',	'e'	],
	[	'e', 	'e', 	'e', 	'e',	'e', 	'b', 	'e', 	'e', 	'e',	'e',	'e'	],
	[	'x', 	'e', 	'e', 	'b',	'b', 	'b', 	'b', 	'b', 	'e',	'e',	'x'	]
]).

/********************************************************************************************
* Começo do jogo.																			*
*********************************************************************************************/

play:-	board(X),
		print_welcome,
		gameM(Game_mode, X).

print_welcome:-	nl,
				write(' ---------------------------------------------- '), nl,
				write('|---------------------TAFL---------------------|'), nl,
				write(' ---------------------------------------------- '), nl.


/********************************************************************************************
* Impressão do tabuleiro.																	*
*********************************************************************************************/

print_board(Board):-	print_header,
						printlists(Board, 1),
						nl.

print_header:-	nl,
				write('     1   2   3   4   5   6   7   8   9   10  11 '), nl,
				write('    ___________________________________________'), nl.

printlists([],_).

printlists([FirstList|OtherLists], Count) :-	((Count < 10,
													write(Count),
													write('  | '));
												(Count > 9,
													write(Count),
													write(' | '))),
												printlist(FirstList),
												Count1 is Count+1,
												printlists(OtherLists, Count1).

printlist([]):-	nl,
				write('    ___________________________________________'), nl.

printlist([FirstElem|OtherElems]):-	write(FirstElem),
									write(' | '),
									printlist(OtherElems).


/********************************************************************************************
* Escolha do modo de jogo																	*
*********************************************************************************************/

gameM(Game_mode, Board):-	write('\nEscolha o modo de jogo que pretende:\n'),
							write('1. Jogador vs Jogador\n'),
							write('2. Jogador vs Computador\n'),
							write('3. Computador vs Computador\n'),
							write('Opcao escolhida: '),
							read(Game_mode),
							integer(Game_mode),
							nl,
							((Game_mode == 1);
							(Game_mode == 2);
							(Game_mode == 3)),
							game_play(1, Board, Game_mode), !.

gameM(Game_mode, Board):-	write('\nEscolha uma opcao valida (1, 2 ou 3)...\n'),
							gameM(NGame_mode, Board).

/********************************************************************************************
* Início da jogada.																			*
*********************************************************************************************/

game_play(Player, Board, Game_mode):-	print_board(Board),
										write('\nJogador '),
										write(Player),
										write(' a jogar...\n'),
										sleep_like(0),
										read_move(Player, Board, Game_mode).

/********************************************************************************************
* Verificar a posição actual, ou seja, se está a jogar uma peça das suas.					*
*********************************************************************************************/

read_move(Player, Board, Game_mode):-	read_move_C_OLD(Player, C_OLD, R_OLD, Board, Game_mode).

read_move_C_OLD(Player, C_OLD, R_OLD, Board, Game_mode):-	(((Game_mode == 1; (Game_mode == 2, Player == 1)),
																write('Coluna da peca que deseja mover|:'),
																read(C_OLD),
																column_row(C_OLD),
																integer(C_OLD));

															(random(1, 11, C_OLD))), !,
															read_move_R_OLD(Player, C_OLD, R_OLD, Board, Game_mode).

read_move_C_OLD(Player, C_OLD, R_OLD, Board, Game_mode):-	(((Game_mode == 1; (Game_mode == 2, Player == 1)),
																write('Erro, insira um valor valido para a coluna (entre 1 e 11)'),
																nl, nl);
															(Game_mode == 3; (Game_mode == 2, Player == 2))),
															read_move_C_OLD(Player, NC_OLD, R_OLD, Board, Game_mode).

read_move_R_OLD(Player, C_OLD, R_OLD, Board, Game_mode):-	(((Game_mode == 1; (Game_mode == 2, Player == 1)),
																write('Linha da peca que deseja mover'),
																read(R_OLD),
																column_row(R_OLD),
																integer(R_OLD));
															(random(1, 11, R_OLD))), !,
															verify_OLD(Player, C_OLD, R_OLD, Board, Game_mode).

read_move_R_OLD(Player, C_OLD, R_OLD, Board, Game_mode):-	(((Game_mode == 1; (Game_mode == 2, Player == 1)),
																write('Erro, insira um valor valido para a linha (entre 1 e 11)'),
																nl, nl);
															(Game_mode == 3; (Game_mode == 2, Player == 2))),
															read_move_R_OLD(Player, C_OLD, NR_OLD, Board, Game_mode).

verify_OLD(Player, C_OLD, R_OLD, Board, Game_mode):-	nth(R_OLD, Board, R_LIST),
														nth(C_OLD, R_LIST, Piece),
														piece_owner(Player, Piece),
														!,
														read_move_C_NEW(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode).

verify_OLD(Player, C_OLD, R_OLD, Board, Game_mode):-	(((Game_mode == 1; (Game_mode == 2, Player == 1)),
															write('Nao pode mover essa peca. Escolha uma peca da sua equipa para mover'),
														nl, nl);
														(Game_mode == 3; (Game_mode == 2, Player == 2))),
														read_move(Player, Board, Game_mode).


/********************************************************************************************
* Verificar a nova posição, ou seja, se está livre.											*
*********************************************************************************************/

read_move_C_NEW(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode):-
	((
		(Game_mode == 1; (Game_mode == 2, Player == 1)),
		write('Coluna para onde deseja mover a peca'),
		read(C_NEW),
		column_row(C_NEW),
		integer(C_NEW));
		(random(1, 11, C_NEW)
	)),
	!,
	read_move_R_NEW(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode).

read_move_C_NEW(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode):-
	((
		(Game_mode == 1; (Game_mode == 2, Player == 1)),
		write('Erro, insira um valor valido para a coluna (entre 1 e 11)'),
		nl, nl);
		(Game_mode == 3; (Game_mode == 2, Player == 2)
	)),
	read_move_C_NEW(Player, NC_OLD, R_OLD, NC_NEW, R_NEW, Board, Piece, Game_mode).

read_move_R_NEW(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode):-
	((
		(Game_mode == 1; (Game_mode == 2, Player == 1)),
		write('Linha para onde deseja mover a peca'),
		read(R_NEW),
		column_row(R_NEW),
		integer(R_NEW));
		(random(1, 11, R_NEW)
	)),
	!,
	verify_NEW(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode).

read_move_R_NEW(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode):-
	((
		(Game_mode == 1; (Game_mode == 2, Player == 1)),
		write('Erro, insira um valor valido para a linha (entre 1 e 11)'),
		nl, nl);
		(Game_mode == 3; (Game_mode == 2, Player == 2))
	),
	read_move_R_NEW(Player, C_OLD, R_OLD, C_NEW, NR_NEW, Board, Piece, Game_mode).

verify_NEW(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode):-
	nth(R_NEW, Board, R_LIST),
	nth(C_NEW, R_LIST, Elem),
	((Piece == 'k',
		Elem == 'T');
	(Elem == 'e')),
	(
		(
			C_OLD == C_NEW, %Vertical
			%get_Row(Board, C_OLD, R_OLD, C_NEW, R_NEW, 1, RowList, RowFinal),
			get_Row(Board, C_OLD, 1, 11, RowFinal, AuxRow),
			(
				(R_OLD > R_NEW,
				Final is R_OLD-1,
				very_path(RowFinal, R_NEW, Final))
				;
				(R_OLD < R_NEW,
				Final is R_NEW-1,
				very_path(RowFinal, R_OLD, Final))
			)
		)
		;
		(
			R_OLD == R_NEW, %Horizontal
			nth(R_OLD, Board, Row),
			(
				(
					C_OLD > C_NEW,
					Final is C_OLD-1,
					very_path(Row, C_NEW, Final)
				)
				;
				(
					C_OLD < C_NEW,
					Final is C_NEW-1,
					very_path(Row, C_OLD, C_NEW)
				)
			)
		)
	),
	!,
	move_Piece(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode, NewBoard).

verify_NEW(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode):-
	((
		(Game_mode == 1; (Game_mode == 2, Player == 1)),
		write('Nao pode mover para esse sitio. Escolha local valido para mover a peca'),
		nl, nl);
		(Game_mode == 3; (Game_mode == 2, Player == 2))
	),
	read_move_C_OLD(Player, NC_OLD, NR_OLD, Board, Game_mode).

/********************************************************************************************
* Verificar se o caminho até à nova posição desejada está livre.							*
*********************************************************************************************/

get_Row(Board, Col, IndexRow, 0, FinalList, FinalAux):- FinalList = FinalAux.

get_Row(Board, Col, IndexRow, FinalRow, FinalList, FinalAux):-
	nth(FinalRow, Board, R_LIST),
	nth(Col, R_LIST, Piece),
	add(Piece, FinalAux, AuxList),
	AuxRow is FinalRow-1,
	get_Row(Board, Col, IndexRow, AuxRow, FinalList, AuxList).

very_path(Row, FinalCol, FinalCol).

very_path(Row, InitialCol, FinalCol):-
									AuxIndex is InitialCol+1,
									nth(AuxIndex, Row, Piece),
									Piece == 'e',
									!,
									very_path(Row, AuxIndex, FinalCol).

very_path(Row, InitialCol, InitialCol).


/********************************************************************************************
* Mover a peças																				*
*********************************************************************************************/

move_Piece(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, 'k', Game_mode, OBoard):-
	(C_NEW == 11;
	C_NEW == 1;
	R_NEW == 1;
	R_NEW == 11),
	!,
	search_row(Board, 'e', C_OLD, R_OLD, 1, OB),
	search_row(OB, 'k', C_NEW, R_NEW, 1, OBoard),
	print_board(OBoard),
	write('Acabou o jogo! Ganhou o jogador 2!\n').

move_Piece(1, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode, NewBoard):-
	search_row(Board, 'e', C_OLD, R_OLD, 1, OB),
	search_row(OB, Piece, C_NEW, R_NEW, 1, OBoard),
	verify_king_eaten(OBoard, NewBoard),
	write('Acabou o jogo! Ganhou o jogador 1!\n'), !.


move_Piece(Player, C_OLD, R_OLD, C_NEW, R_NEW, Board, Piece, Game_mode, FFBoard):-
	(
		(
			Piece == 'k',
			C_OLD == 6,
			R_OLD == 6,
			search_row(Board, 'T', C_OLD, R_OLD, 1, OB)
		);
		(search_row(Board, 'e', C_OLD, R_OLD, 1, OB))
	),
	search_row(OB, Piece, C_NEW, R_NEW, 1, OBoard),
	(
		verify_up(Player, C_NEW, R_NEW, OBoard, AuxBoard1),
		verify_down(Player, C_NEW, R_NEW, AuxBoard1, AuxBoard2),
		verify_left(Player, C_NEW, R_NEW, AuxBoard2, AuxBoard3),
		verify_right(Player, C_NEW, R_NEW, AuxBoard3, AuxBoard4),
		FFBoard = AuxBoard4
	)
	/*,
	((Player == 1,
		game_play(2, FFBoard, Game_mode));
	(Player == 2,
		game_play(1, FFBoard, Game_mode)))*/
		.

/********************************************************************************************
* Verificar a peça que foi movida na última jogada, remove alguma peça inimiga.				*
*********************************************************************************************/

verify_up(Player, C_NEW, R_NEW, Board, FBoard):-
	R_NEW > 2,
	X is R_NEW-1,
	Y is C_NEW,
	get_Row(Board, Y, 1, 11, RowFinal, AuxRow),
	verify_v(Player, X, Y, RowFinal, Board, FBoard),
	!.

verify_up(Player, C_NEW, R_NEW, Board, FBoard):-
	FBoard = Board.

verify_down(Player, C_NEW, R_NEW, Board, FBoard):-
	R_NEW < 10,
	X is R_NEW+1,
	Y is C_NEW,
	get_Row(Board, Y, 1, 11, RowFinal, AuxRow),
	verify_v(Player, X, Y, RowFinal, Board, FBoard),
	!.

verify_down(Player, C_NEW, R_NEW, Board, FBoard):-
	FBoard = Board.

verify_left(Player, C_NEW, R_NEW, Board, FBoard):-
	C_NEW > 2,
	X is R_NEW,
	Y is C_NEW-1,
	nth(R_NEW, Board, RowFinal),
	verify_h(Player, Y, X, RowFinal, Board, FBoard),
	!.

verify_left(Player, C_NEW, R_NEW, Board, FBoard):-
	FBoard = Board.

verify_right(Player, C_NEW, R_NEW, Board, FBoard):-
	C_NEW < 10,
	X is R_NEW,
	Y is C_NEW+1,
	nth(R_NEW, Board, RowFinal),
	verify_h(Player, Y, X, RowFinal, Board, FBoard),
	!.

verify_right(Player, C_NEW, R_NEW, Board, FBoard):-
	FBoard = Board.

verify_v(Player, X, Y, List, Board, OBoard):-
	nth(X, List, Piece),
	Piece \= 'k',
	Left is X-1,
	nth(Left, List, Left_Piece),
	Right is X+1,
	nth(Right, List, Right_Piece),
	\+ piece_owner(Player, Piece),
	piece_owner(Player, Left_Piece),
	piece_owner(Player, Right_Piece),
	search_row(Board, 'e', Y, X, 1, OBoard).

verify_h(Player, X, Y, List, Board, OBoard):-
	nth(X, List, Piece),
	Piece \= 'k',
	Left is X-1,
	nth(Left, List, Left_Piece),
	Right is X+1,
	nth(Right, List, Right_Piece),
	\+ piece_owner(Player, Piece),
	piece_owner(Player, Left_Piece),
	piece_owner(Player, Right_Piece),
	search_row(Board, 'e', X, Y, 1, OBoard).

/********************************************************************************************
* Verificar se o rei está em posição de ser removido.										*
*********************************************************************************************/

verify_king_eaten(Board, NewBoard):-
	find_king(Board, 1, ROW, COL),
	nth(ROW, Board, R_LIST),
	get_Row(Board, COL, 1, 11, C_LIST, AuxRow),

	Left is COL-1,
	nth(Left, R_LIST, Left_Piece),

	Right is COL+1,
	nth(Right, R_LIST, Right_Piece),

	Upper is ROW-1,
	nth(Upper, C_LIST, Upper_Piece),

	Down is ROW+1,
	nth(Down, C_LIST, Down_Piece),

	piece_owner(1, Left_Piece),
	piece_owner(1, Right_Piece),
	piece_owner(1, Upper_Piece),
	piece_owner(1, Down_Piece),
	search_row(Board, 'e', COL, ROW, 1, OB),
	print_board(OB).

/********************************************************************************************
* Encontra a posição actual do rei.															*
*********************************************************************************************/

find_king(Board, RowIndex, ROW, COL):-	nth(RowIndex, Board, Row),
										find_king_aux(Row, RowIndex, 1, ROW, COL),
										!.

find_king(Board, RowIndex, ROW, COL):-	NRowIndex is RowIndex+1,
										NRowIndex < 12,
										find_king(Board, NRowIndex, ROW, COL).


find_king_aux(Row, RowIndex, ColIndex, ROW, COL):-		nth(ColIndex, Row, Piece),
														Piece == 'k',
														ROW = RowIndex,
														COL = ColIndex,
														!.

find_king_aux(Row, RowIndex, ColIndex, ROW, COL):-		NewColIndex is ColIndex+1,
														NewColIndex < 12,
														find_king_aux(Row, RowIndex, NewColIndex, ROW, COL).

/********************************************************************************************
* Funções auxiliares.																		*
*********************************************************************************************/

add(X,L,[X|L]).

nth(1, [Board_Header|_], Board_Header):-	!.

nth(X, [_|Out_Header], Out):-	PX is X-1,
								nth(PX, Out_Header, Out).

search_row([IH|IT], Piece, Col, Row,  Row, [OH|IT]):-	search_col(IH, Piece, Col, 1, OH), !.

search_row([IH|IT], Piece, Col, Row,  RowInc, [IH|OT]):-	NRow is RowInc+1,
															search_row(IT, Piece, Col, Row, NRow, OT).

search_col([_|IT], Piece, Col, Col, [Piece|IT]):-	!.
search_col([IH|IT], Piece, Col, ColInc, [IH|OT]):-	NCol is ColInc+1,
													search_col(IT, Piece, Col, NCol, OT).

sleep_like(1000000).
sleep_like(Count):- NewCount is Count+1,
					sleep_like(NewCount).
