const bottom = document.getElementById('bottom');
const board = document.getElementById('board');

const WHITE = 0;
const BLACK = 1;
const blackHex = '#502020';
const whiteHex = '#eeddaa';
const PAWN = 'pawn';
const ROOK = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const QUEEN = 'queen';
const KING = 'king';
let turn = WHITE;
let selectedPiece;
let whitePawns = [];
let blackPawns = [];
let x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let currentColor = whiteHex;

function Piece(type, rank, file, color){
	this.type = type,
	this.rank = rank,
	this.file = file,
	this.color = color,
	this.firstMove = true,
	this.allowedMoves = []
};

for(let i = 0; i < 8; i++){
	whitePawns[i] = new Piece(PAWN, 1, i, WHITE);
	blackPawns[i] = new Piece(PAWN, 6, i, BLACK);
}

const boardState = [
	[
		new Piece(ROOK, 0, 0, WHITE),
		new Piece(KNIGHT, 0, 1, WHITE),
		new Piece(BISHOP, 0, 2, WHITE),
		new Piece(KING, 0, 3, WHITE),
		new Piece(QUEEN, 0, 4, WHITE),
		new Piece(BISHOP, 0, 5, WHITE),
		new Piece(KNIGHT, 0, 6, WHITE),
		new Piece(ROOK, 0, 7, WHITE)
	],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[
		new Piece(ROOK, 7, 0, BLACK),
		new Piece(KNIGHT, 7, 1, BLACK),
		new Piece(BISHOP, 7, 2, BLACK),
		new Piece(KING, 7, 3, BLACK),
		new Piece(QUEEN, 7, 4, BLACK),
		new Piece(BISHOP, 7, 5, BLACK),
		new Piece(KNIGHT, 7, 6, BLACK),
		new Piece(ROOK, 7, 7, BLACK)
	]
];

whitePawns.forEach(p => boardState[p.rank][p.file] = p);
blackPawns.forEach(p => boardState[p.rank][p.file] = p);

const movePiece = (piece, destRank, destFile) =>{
	if(piece !== 0){
		boardState[destRank][destFile] = piece;
		boardState[piece.rank][piece.file] = 0;
		piece.rank = destRank;
		piece.file = destFile;
	}
};

const getValidKingMoves = (piece) =>{
	let moves = [];
	if(piece.rank > 0)						moves.push({rank: piece.rank - 1, file: piece.file});
	if(piece.rank < 7)						moves.push({rank: piece.rank + 1, file: piece.file});
	if(piece.file > 0)						moves.push({rank: piece.rank, file: piece.file - 1});
	if(piece.file < 7)						moves.push({rank: piece.rank, file: piece.file + 1});
	if(piece.rank > 0 && piece.file > 0)	moves.push({rank: piece.rank - 1, file: piece.file - 1});
	if(piece.rank < 7 && piece.file < 7)	moves.push({rank: piece.rank + 1, file: piece.file + 1});
	if(piece.rank > 0 && piece.file < 7)	moves.push({rank: piece.rank - 1, file: piece.file + 1});
	if(piece.rank < 7 && piece.file > 0)	moves.push({rank: piece.rank + 1, file: piece.file - 1});

	moves = moves.filter(x => boardState[x.rank][x.file] === 0 || boardState[x.rank][x.file].color !== turn);
	return moves;
};

const getValidPawnMoves = (piece) =>{
	let moves = [];
	if(piece.color === BLACK){
		if(piece.firstMove){
			moves.push({rank: piece.rank - 2, file: piece.file})
		}
		if(piece.rank > 0)						moves.push({rank: piece.rank - 1, file: piece.file});
		if(piece.rank > 0 && piece.file > 0)	moves.push({rank: piece.rank - 1, file: piece.file - 1});
		if(piece.rank > 0 && piece.file < 7)	moves.push({rank: piece.rank - 1, file: piece.file + 1});
	}else{
		if(piece.firstMove){
			moves.push({rank: piece.rank + 2, file: piece.file})
		}
		if(piece.rank < 7)						moves.push({rank: piece.rank + 1, file: piece.file});
		if(piece.rank < 7 && piece.file > 0)	moves.push({rank: piece.rank + 1, file: piece.file - 1});
		if(piece.rank < 7 && piece.file < 7)	moves.push({rank: piece.rank + 1, file: piece.file + 1});
	}
	console.log('Moves:', moves);
	return moves;
};

const highlightValidMoves = (moves) =>{
	const tiles = Array.of(board.childNodes)[0];
	const moveIds = moves.map(x => `${x.rank}${x.file}`);

	tiles.forEach(x => {
		if(moveIds.includes(x.id)){
			const mark = document.createElement('div');
			mark.setAttribute('class', 'mark');
			x.appendChild(mark);
			console.log(x);
		}
	});
};

const getValidMoves = (piece) =>{
	let moves = [];

	switch(piece.type){
		case PAWN:
			moves = getValidPawnMoves(piece);
			break;
		case KING:
			moves = getValidKingMoves(piece);
			break;
		default:
			console.log('Moves for this piece type not yet implemented');
	}
	highlightValidMoves(moves);
	return moves;
};

const highlightTile = (element, color) =>{
	element.style.backgroundColor = color;
};

const markTile = (element, color) =>{
	element.style.boxShadow = '4px 4px 4px black';
	element.style.border = `4px solid ${color}`;
	element.style.borderRadius = '3px';
};

const unmarkPiece = (piece) =>{
	piece.style.boxShadow = '';
	piece.style.border = '';
	piece.style.borderRadius = '';
};

const configPiece = (htmlElement, piece) =>{
	const img = document.createElement('img');
	htmlElement.addEventListener('mouseenter', () => {
		markTile(img, '#308080');
	});
	htmlElement.addEventListener('mouseleave', () => {
		unmarkPiece(img);
	});
	htmlElement.appendChild(img);
	if(piece.color === 0){
		img.src = `./assets/${piece.type}_white.png`
	}else{
		img.src = `./assets/${piece.type}_black.png`

	}
	return htmlElement;
};

const clearBoard = () =>{
	board.innerHTML = '';
};

const validClick = (piece) =>{
	return piece.color === turn
};

const swapTurn = () =>{
	if(turn === WHITE){
		turn = BLACK;
	}else{
		turn = WHITE;
	}
};

const arrayContainsPosition = (array, positionObject) =>{
	for(const p of array){
		if(p.rank === positionObject.rank && p.file === positionObject.file){
			return true;
		}
	}
	return false;
};

const tileClick = (tile) =>{
	const rank = parseInt(tile.id[0]);
	const file = parseInt(tile.id[1]);

	if(selectedPiece !== undefined){
		console.log(selectedPiece.allowedMoves);
	}

	if(selectedPiece === undefined){
		selectedPiece = boardState[rank][file];
		console.log('Clicked piece:', selectedPiece);
		if(!validClick(selectedPiece)){
			selectedPiece = undefined;
		}else{
			tile.style.backgroundColor = '#54AC63';
			selectedPiece.allowedMoves = getValidMoves(selectedPiece);
		}
	}
	else if(arrayContainsPosition(selectedPiece.allowedMoves, {rank: rank, file: file})){
		movePiece(selectedPiece, rank, file);
		selectedPiece.firstMove = false;
		swapTurn();
		selectedPiece = undefined;
		clearBoard();
		renderBoard();
	}else{
		selectedPiece = undefined;
		clearBoard();
		renderBoard();
	}
};

const renderBoard = () =>{
	console.log('BOARD_RENDER');
	for(let i = 0; i < 8; i++){
		for(let j = 0; j < 8; j++){
			let tile = document.createElement('div');
			tile.className = 'tile';
			tile.id = `${i}${j}`;
			if(boardState[i][j] !== 0){
				tile = configPiece(tile, boardState[i][j]);
			}

			tile.style.backgroundColor = currentColor;
			if(currentColor === blackHex){
				currentColor = whiteHex;
			}else{
				currentColor = blackHex;
			}

			tile.addEventListener('click', () => {
				tileClick(tile);
			});
			board.appendChild(tile);
		}
		if(currentColor === blackHex){
			currentColor = whiteHex;
		}else{
			currentColor = blackHex;
		}
	}
};

renderBoard();