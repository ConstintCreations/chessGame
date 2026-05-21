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

export const KnightDirectionVector: Record<Direction, Position> = {
    [Direction.Up]: {x:1, y:-2},
    [Direction.UpLeft]: {x:-1, y:-2},
    [Direction.UpRight]: {x:2, y:-1},
    [Direction.Left]: {x:-2, y:-1},
    [Direction.Right]: {x:2, y:1},
    [Direction.Down]: {x:-2, y:1},
    [Direction.DownLeft]: {x:-1, y:2},
    [Direction.DownRight]: {x:1, y:2},
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
    constructor (public pieceType: PieceType, public pieceColor: PieceColor, public validSquares: Square[] | null, public hasMoved: boolean, public canEnPassant: boolean) {
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
    promoting: Square | null;
    turn: PieceColor;
    gameOver: boolean;

    constructor() {
        this.squares = [];
        this.selectedSquare = null;
        this.promoting = null;
        this.turn = PieceColor.Light;
        this.gameOver = false;

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
                    piece = new Piece(pieceType, pieceColor, null, false, false);
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
        if (x >= 0 && x < 8 && y >= 0 && y < 8) return this.getSquareByIndex(8*y + x);
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
        this.clearAllValidSquares();
        if (this.gameOver) return;
        if (square.piece && square.piece.pieceColor == this.turn) {
            square.piece.validSquares = this.getValidSquares(square);
        }
        this.selectedSquare = square;
    }

    clearSelectedSquare() {
        this.selectedSquare = null;
    }

    movePieceFromSelectedSquareTo(targetSquare: Square | null, validateMovement: boolean = true):boolean {
        if (this.gameOver) return false;
        if (!targetSquare) return false;
        if (this.selectedSquare?.piece && this.selectedSquare?.piece.pieceColor == targetSquare?.piece?.pieceColor) {
            return false;
        }

        const selectedPiece = this.selectedSquare?.piece;
        
        if (!this.selectedSquare || !selectedPiece) return false;

        if (selectedPiece.pieceColor != this.turn) return false;

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

        if (this.turn == PieceColor.Light) {
            this.turn = PieceColor.Dark;
        } else {
            this.turn = PieceColor.Light;
        }

        if (targetSquare.piece.pieceType == PieceType.Pawn) {
            const behindSquare = targetSquare.piece.pieceColor == PieceColor.Dark ? this.getSquare(targetSquare.x + DirectionVector[Direction.Down].x, targetSquare.y + DirectionVector[Direction.Down].y) : this.getSquare(targetSquare.x + DirectionVector[Direction.Up].x, targetSquare.y + DirectionVector[Direction.Up].y);
            console.log("BEHINDSQUARE", behindSquare);
            if (behindSquare && behindSquare.piece && behindSquare.piece.pieceColor != targetSquare.piece.pieceColor && behindSquare.piece.pieceType == PieceType.Pawn && behindSquare.piece.canEnPassant) behindSquare.piece = null;
        }

        this.updateCanEnPassant();

        if (!targetSquare.piece.hasMoved) {
            if (targetSquare.y == 3 && targetSquare.piece.pieceColor == PieceColor.Light) {
                targetSquare.piece.canEnPassant = true;
            } else if (targetSquare.y == 4 && targetSquare.piece.pieceColor == PieceColor.Dark) {
                targetSquare.piece.canEnPassant = true;
            }
        }

        targetSquare.piece.hasMoved = true;
        targetSquare.piece.validSquares = null;

        if (validateMovement) this.simulateAllPossibleMoves();

        if (!this.gameOver) this.checkIfPromoting(targetSquare);

        return true;
    }

    updateCanEnPassant() {
        for (const square of this.squares) {
            if (!square.piece) continue;
            if (square.piece.pieceColor == this.turn) square.piece.canEnPassant = false;
        }
    }

    clearAllValidSquares() {
        for (const square of this.squares) {
            if (!square.piece) continue;
            square.piece.validSquares = null;
        }
    }

    checkIfPromoting(square: Square) {
        if (square.y == 0 || square.y == 7) {
                const piece = square.piece!
            if (piece.pieceType == PieceType.Pawn) {
                if (piece.pieceColor == PieceColor.Dark) {
                    if (square.y == 0) {
                        this.promoting = square;
                    }
                } else if (square.y == 7) {
                    this.promoting = square;
                }
            }
        }
    }

    promoteToPiece(pieceType: PieceType) {
        if (!this.promoting) return;
        this.promoting.piece!.pieceType = pieceType;
        this.promoting = null;
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
        while(targetSquare && (!targetSquare.piece || targetSquare.piece.pieceColor != fromSquare.piece.pieceColor)) {
            
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

    getValidSquares(targetSquare: Square, filterKing: boolean = true, simulateMoves: boolean = true): Square[] | null { 
        if (!targetSquare || !targetSquare.piece) return null;
        let validSquares:Square[] = [];

        if (targetSquare.piece.pieceType == PieceType.Pawn) {
             const frontSquare = targetSquare.piece.pieceColor == PieceColor.Dark ? this.getSquare(targetSquare.x + DirectionVector[Direction.Up].x, targetSquare.y + DirectionVector[Direction.Up].y) : this.getSquare(targetSquare.x + DirectionVector[Direction.Down].x, targetSquare.y + DirectionVector[Direction.Down].y);
             if (frontSquare && frontSquare.piece == null) {
                validSquares.push(frontSquare);
                const doubleFrontSquare = targetSquare.piece.pieceColor == PieceColor.Dark ? this.getSquare(frontSquare.x + DirectionVector[Direction.Up].x, frontSquare.y + DirectionVector[Direction.Up].y) : this.getSquare(frontSquare.x + DirectionVector[Direction.Down].x, frontSquare.y + DirectionVector[Direction.Down].y);
                if (targetSquare.piece.hasMoved == false && doubleFrontSquare && doubleFrontSquare.piece == null) validSquares.push(doubleFrontSquare);
            }
             const frontLeftSquare = targetSquare.piece.pieceColor == PieceColor.Dark ? this.getSquare(targetSquare.x + DirectionVector[Direction.UpLeft].x, targetSquare.y + DirectionVector[Direction.UpLeft].y) : this.getSquare(targetSquare.x + DirectionVector[Direction.DownLeft].x, targetSquare.y + DirectionVector[Direction.DownLeft].y);
             if (frontLeftSquare && frontLeftSquare.piece && frontLeftSquare.piece.pieceColor != targetSquare.piece.pieceColor) {validSquares.push(frontLeftSquare)};
             const frontRightSquare = targetSquare.piece.pieceColor == PieceColor.Dark ? this.getSquare(targetSquare.x + DirectionVector[Direction.UpRight].x, targetSquare.y + DirectionVector[Direction.UpRight].y) : this.getSquare(targetSquare.x + DirectionVector[Direction.DownRight].x, targetSquare.y + DirectionVector[Direction.DownRight].y);
             if (frontRightSquare && frontRightSquare.piece && frontRightSquare.piece.pieceColor != targetSquare.piece.pieceColor) validSquares.push(frontRightSquare);

            const leftSquare = this.getSquare(targetSquare.x + DirectionVector[Direction.Left].x, targetSquare.y + DirectionVector[Direction.Left].y);
            if (leftSquare && leftSquare.piece && leftSquare.piece.pieceColor != targetSquare.piece.pieceColor && leftSquare.piece.canEnPassant && frontLeftSquare) validSquares.push(frontLeftSquare);
            const rightSquare = this.getSquare(targetSquare.x + DirectionVector[Direction.Right].x, targetSquare.y + DirectionVector[Direction.Right].y);
            if (rightSquare && rightSquare.piece && rightSquare.piece.pieceColor != targetSquare.piece.pieceColor && rightSquare.piece.canEnPassant && frontRightSquare) validSquares.push(frontRightSquare);

        } else if (targetSquare.piece.pieceType == PieceType.King) {
            for (const direction of AllDirections) {
                const squareInDirection = this.getSquareInDirection(targetSquare, direction);
                if (!squareInDirection || (squareInDirection?.piece && squareInDirection.piece.pieceColor == targetSquare.piece.pieceColor)) continue;
                let kingInRange = false;
                for (const secondDirection of AllDirections) {
                    const squareInSecondDirection = this.getSquareInDirection(squareInDirection, secondDirection);
                    if (squareInSecondDirection?.piece?.pieceType == PieceType.King && squareInSecondDirection?.piece?.pieceColor != targetSquare.piece.pieceColor) {
                        kingInRange = true;
                    }
                }
                if (!kingInRange) validSquares.push(squareInDirection);
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
        } else if (targetSquare.piece.pieceType == PieceType.Bishop) {
            for (const direction of [Direction.DownLeft, Direction.DownRight, Direction.UpLeft, Direction.UpRight]) {
                const squaresInDirections = this.getSquaresInDirectionUntilSameColor(targetSquare, direction);
                if (squaresInDirections) {
                    for (const square of squaresInDirections) {
                        validSquares.push(square);
                    }
                }
            }
        } else if (targetSquare.piece.pieceType == PieceType.Rook) {
            for (const direction of [Direction.Up, Direction.Down, Direction.Left, Direction.Right]) {
                const squaresInDirections = this.getSquaresInDirectionUntilSameColor(targetSquare, direction);
                if (squaresInDirections) {
                    for (const square of squaresInDirections) {
                        validSquares.push(square);
                    }
                }
            }
        }else if (targetSquare.piece.pieceType == PieceType.Knight) {
            for (const direction of AllDirections) {
                const toSquare = this.getSquare(targetSquare.x + KnightDirectionVector[direction].x, targetSquare.y + KnightDirectionVector[direction].y);
                console.log(toSquare);
                if (!toSquare || (toSquare?.piece && toSquare.piece.pieceColor == targetSquare.piece.pieceColor)) continue;
                validSquares.push(toSquare);
            }
        } else {
            for (const square of this.squares) {
                validSquares.push(square);
            }
        }

        if (filterKing) {
            validSquares = validSquares.filter(square => square.piece?.pieceType != PieceType.King);
        }

        if (simulateMoves) {
            const possibleMovesMap = this.simulateAllPossibleMoves();
            const possibleMoves = possibleMovesMap?.get(targetSquare);
            if (!possibleMoves) {
                return null;
            } else {
                return possibleMoves;
            }
        }

        return validSquares;
    }

    getKing(color: PieceColor) {
        for (const square of this.squares) {
            if (square.piece?.pieceType == PieceType.King && square.piece.pieceColor == color) return square;
        }
    }

    simulateAllPossibleMoves(): Map<Square, Square[] | null> | null {
        const possibleMoves = new Map<Square, Square[] | null>();

        let hasAMove = false;

        for (const square of this.squares) {
            const possibleSquares:Square[] = [];
            if (square.piece?.pieceColor == this.turn) {
                const validSquares = this.getValidSquares(square, true, false);
                if (validSquares) {
                    for (const validSquare of validSquares) {
                        const clonedBoard = this.cloneBoard();
                        clonedBoard.selectedSquare = clonedBoard.getSquare(square.x, square.y);
                        const toSquare = clonedBoard.getSquare(validSquare.x, validSquare.y);
                        clonedBoard.movePieceFromSelectedSquareTo(toSquare, false);
                        const wasChecked = clonedBoard.isKingInCheck(this.turn);
                        if (!wasChecked) {
                            possibleSquares.push(validSquare)
                            hasAMove = true;
                        }
                    }
                }
            }
            if (possibleSquares.length > 0) {
                possibleMoves.set(square, possibleSquares);
            }
        }

        if (!hasAMove) {
            this.gameOver = true;
            return null;
        } else {
            return possibleMoves;
        }        
    }

    isKingInCheck(color: PieceColor, board: Board = this) {
        const kingSquare = board.getKing(color);
        for (const square of board.squares) {
            if (!square.piece || square.piece.pieceColor == color) continue;
            
            const validSquares = board.getValidSquares(square, false, false);

            if (!validSquares) continue;

            for (const validSquare of validSquares) {
                if (validSquare == kingSquare) {
                    return true;
                }
            }
        }

        return false;
    }

    cloneBoard(): Board {
        const clonedBoard = new Board();

        for (let i = 0; i < 64; i++) {
            const oldSquare = this.squares[i];
            const newSquare = clonedBoard.squares[i];

            if (oldSquare.piece) {
                newSquare.piece = new Piece(oldSquare.piece.pieceType, oldSquare.piece.pieceColor, null, oldSquare.piece.hasMoved, oldSquare.piece.canEnPassant)
            } else {
                newSquare.piece = null;
            }

        }

        clonedBoard.turn = this.turn;
        return clonedBoard;
    }
}