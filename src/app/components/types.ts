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

export class Square {
    constructor(public x: number, public y: number, public piece: PieceType | null, public color: SquareColor) {}
}

export class Board {
    boardSize: number;
    board: Square[];

    constructor(boardSize: number) {
        this.boardSize = boardSize;
        this.board = [];

        for (let y = 0; y < this.boardSize; y++) {
            for (let x = 0; x < this.boardSize; x++) {
                this.board.push(new Square(x, y, null, (x+y)%2 == 1 ? SquareColor.Light : SquareColor.Dark));
            }
        }

        console.log(this.board);
    }

    getSquareByIndex(index:number): Square | undefined {
        index = Math.round(index);
        if (index >= this.boardSize) return;
        return this.board[index];
    }
}