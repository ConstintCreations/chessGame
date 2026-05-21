export enum PieceType {
    Pawn = "Pawn",
    Rook = "Rook",
    Knight = "Knight",
    Bishop = "Bishop",
    King = "King", 
    Queen = "Queen"
}

export interface Position {
    x: number,
    y: number
}

export enum Direction {
    Up = "Up",
    UpLeft = "UpLeft",
    Left = "Left",
    DownLeft = "DownLeft",
    Down = "Down",
    DownRight = "DownRight",
    Right = "Right",
    UpRight = "UpRight"
}

export const AllDirections: Direction[] = [
    Direction.Up,
    Direction.Down,
    Direction.Left,
    Direction.Right,
    Direction.DownLeft,
    Direction.DownRight,
    Direction.UpLeft,
    Direction.UpRight
]

export const DirectionVector: Record<Direction, Position> = {
    [Direction.Up]: {x:0, y:-1},
    [Direction.UpLeft]: {x:-1, y:-1},
    [Direction.UpRight]: {x:1, y:-1},
    [Direction.Left]: {x:-1, y:0},
    [Direction.Right]: {x:1, y:0},
    [Direction.Down]: {x:0, y:1},
    [Direction.DownLeft]: {x:-1, y:1},
    [Direction.DownRight]: {x:1, y:1},
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
    constructor (public pieceType: PieceType, public pieceColor: PieceColor, public validSquares: Square[] | null, public hasMoved: boolean) {
        if (validSquares == null && pieceType) {
            validSquares = [];
        }
    }
}

export class Square {
    constructor(public x: number, public y: number, public piece: Piece | null, public color: SquareColor) {}
}

export class Board {
    squares: Square[];
    selectedSquare: Square | null;

    constructor() {
        this.squares = [];
        this.selectedSquare = null;

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
                        pieceType = PieceType.Queen;
                    } else if (x == 4) {
                        pieceType = PieceType.King;
                    }
                }

                if (pieceType && pieceColor) {
                    piece = new Piece(pieceType, pieceColor, null, false);
                }

                this.squares.push(new Square(x, y, piece, (x+y)%2 == 1 ? SquareColor.Light : SquareColor.Dark));
            }
        }
    }

    getSquareByIndex(index:number): Square | null {
        index = Math.round(index);
        if (index >= 64) return null;
        return this.squares[index];
    }

    getSquare(x:number, y:number):Square | null {
        if (x >= 0 || x < 8 || y >= 0 || y < 8) return this.getSquareByIndex(8*y + x);
        return null;
    }

    getSquareByIndexBackwards(index:number): Square | null {
        index = Math.round(index);
        if (index >= 64) return null;
        const x = index%8;
        const y = (64-(8*Math.floor(index/8)))-8;
        return this.squares[x+y];
    }

    selectSquare(square: Square) {
        if (square.piece) {
            square.piece.validSquares = this.getValidSquares(square);
        }
        this.selectedSquare = square;
    }

    clearSelectedSquare() {
        this.selectedSquare = null;
    }

    movePieceFromSelectedSquareTo(targetSquare: Square | null, validateMovement: boolean = true):boolean {
        if (!targetSquare) return false;
        if (this.selectedSquare?.piece && this.selectedSquare?.piece.pieceColor == targetSquare?.piece?.pieceColor) {
            return false;
        }

        const selectedPiece = this.selectedSquare?.piece;
        
        if (!this.selectedSquare || !selectedPiece) return false;

        if (validateMovement) {
            if (selectedPiece.validSquares) {
                let foundTargetSquare = false;
                for (const square of selectedPiece.validSquares) {
                    if (targetSquare == square) {
                        foundTargetSquare = true;
                    }
                }
                if (!foundTargetSquare) return false;
            } else {
                return false;
            }
        }
        targetSquare.piece = selectedPiece;
        this.selectedSquare.piece = null;

        targetSquare.piece.hasMoved = true;

        return true;
    }

    getSquareInDirection(fromSquare: Square, direction: Direction): Square | null {
        const targetSquare = this.getSquare(fromSquare.x + DirectionVector[direction].x, fromSquare.y + DirectionVector[direction].y);

        if (!targetSquare) return null;

        return targetSquare;
    }

    getSquaresInDirectionUntilSameColor(fromSquare: Square, direction: Direction): Square[] | null {
        if (!fromSquare.piece) return null;
        let squares:Square[] = [];
        let targetSquare = this.getSquare(fromSquare.x + DirectionVector[direction].x, fromSquare.y + DirectionVector[direction].y);
        while(targetSquare && (!targetSquare.piece || targetSquare.piece.pieceType != fromSquare.piece.pieceType)) {
            
            squares.push(targetSquare);

            console.log(targetSquare);
            
            if (targetSquare.piece) {
                
                return squares;
            }

            targetSquare = this.getSquare(targetSquare.x + DirectionVector[direction].x, targetSquare.y + DirectionVector[direction].y);
        }

        if (squares.length > 0) {
            return squares;
        } else {
            return null;
        }
    }

    getValidSquares(targetSquare: Square): Square[] | null { 
        if (!targetSquare || !targetSquare.piece) return null;
        const validSquares:Square[] = [];

        if (targetSquare.piece.pieceType == PieceType.Pawn) {
             const frontSquare = targetSquare.piece.pieceColor == PieceColor.Dark ? this.getSquare(targetSquare.x + DirectionVector[Direction.Up].x, targetSquare.y + DirectionVector[Direction.Up].y) : this.getSquare(targetSquare.x + DirectionVector[Direction.Down].x, targetSquare.y + DirectionVector[Direction.Down].y);
             if (frontSquare && frontSquare.piece == null) {
                validSquares.push(frontSquare);
                const doubleFrontSquare = targetSquare.piece.pieceColor == PieceColor.Dark ? this.getSquare(frontSquare.x + DirectionVector[Direction.Up].x, frontSquare.y + DirectionVector[Direction.Up].y) : this.getSquare(frontSquare.x + DirectionVector[Direction.Down].x, frontSquare.y + DirectionVector[Direction.Down].y);
                if (targetSquare.piece.hasMoved == false && doubleFrontSquare && doubleFrontSquare.piece == null) validSquares.push(doubleFrontSquare);
            }
             const frontLeftSquare = targetSquare.piece.pieceColor == PieceColor.Dark ? this.getSquare(targetSquare.x + DirectionVector[Direction.UpLeft].x, targetSquare.y + DirectionVector[Direction.UpLeft].y) : this.getSquare(targetSquare.x + DirectionVector[Direction.DownLeft].x, targetSquare.y + DirectionVector[Direction.DownLeft].y);
             if (frontLeftSquare && frontLeftSquare.piece && frontLeftSquare.piece.pieceColor != targetSquare.piece.pieceColor) validSquares.push(frontLeftSquare);
             const frontRightSquare = targetSquare.piece.pieceColor == PieceColor.Dark ? this.getSquare(targetSquare.x + DirectionVector[Direction.UpRight].x, targetSquare.y + DirectionVector[Direction.UpRight].y) : this.getSquare(targetSquare.x + DirectionVector[Direction.DownRight].x, targetSquare.y + DirectionVector[Direction.DownRight].y);
             if (frontRightSquare && frontRightSquare.piece && frontRightSquare.piece.pieceColor != targetSquare.piece.pieceColor) validSquares.push(frontRightSquare);

            //Todo: En Passant

        } else if (targetSquare.piece.pieceType == PieceType.King) {
            for (const direction of AllDirections) {
                const squareInDirection = this.getSquareInDirection(targetSquare, direction);
                if (!squareInDirection || (squareInDirection?.piece && squareInDirection.piece.pieceColor == targetSquare.piece.pieceColor)) continue;
                validSquares.push(squareInDirection);
            }
        } else if (targetSquare.piece.pieceType == PieceType.Queen) {
            for (const direction of AllDirections) {
                const squaresInDirections = this.getSquaresInDirectionUntilSameColor(targetSquare, direction);
                if (squaresInDirections) {
                    for (const square of squaresInDirections) {
                        validSquares.push(square);
                    }
                }
            }
        } else {
            for (const square of this.squares) {
                validSquares.push(square);
            }
        }

        // Todo: Check Checking

        return validSquares;
    }
}