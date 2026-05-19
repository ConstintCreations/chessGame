export enum PieceType {
    Pawn = "Pawn",
    Rook = "Rook",
    Knight = "Knight",
    Bishop = "Bishop",
    King = "King", 
    Queen = "Queen"
}

export enum SquareColor {
    Light = "Light",
    Dark = "Dark"
}

export enum PieceColor {
    Light = "Light",
    Dark = "Dark"
}

export class Piece {
    constructor (public pieceType: PieceType, public pieceColor: PieceColor) {}
}

export class Square {
    constructor(public x: number, public y: number, public piece: Piece | null, public color: SquareColor) {}
}

export class Board {
    board: Square[];

    constructor() {
        this.board = [];

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                
                let piece = null;

                let pieceType = null;
                let pieceColor = PieceColor.Dark;
                if (y < 3) {
                    pieceColor = PieceColor.Light;
                }

                if (y == 1 || y == 6) {
                    pieceType = PieceType.Pawn;
                }

                if (y == 0 || y == 7) {
                    if (x == 0 || x == 7) {
                        pieceType = PieceType.Rook;
                    } else if (x == 1 || x == 6) {
                        pieceType = PieceType.Knight;
                    } else if (x == 2 || x == 5) {
                        pieceType = PieceType.Bishop;
                    } else if (x == 3) {
                        if (y == 0) {
                            pieceType = PieceType.Queen;
                        } else if (y == 7) {
                            pieceType = PieceType.King;
                        }
                    } else if (x == 4) {
                        if (y == 0) {
                            pieceType = PieceType.King;
                        } else if (y == 7) {
                            pieceType = PieceType.Queen;
                        }
                    }
                }

                if (pieceType && pieceColor) {
                    piece = new Piece(pieceType, pieceColor);
                }

                this.board.push(new Square(x, y, piece, (x+y)%2 == 1 ? SquareColor.Light : SquareColor.Dark));
            }
        }

        console.log(this.board);
    }

    getSquareByIndex(index:number): Square | null {
        index = Math.round(index);
        if (index >= 64) return null;
        return this.board[index];
    }
}