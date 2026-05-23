"use client";
import { Board, PieceColor, PieceType, SquareColor, Square } from "./components/types";
import { useState } from "react";

export default function Home() {

  const [board, setBoard] = useState<Board>(new Board);

  function handleSquareClick(e:any, index:number) {
    if (board.promoting) return;
    //console.log("click: ", board.getSquareByIndexBackwards(index));
    if (board.selectedSquare) {
      if (board.selectedSquare == board.getSquareByIndexBackwards(index)) {
        board.clearSelectedSquare();
        setBoard(Object.assign(new Board(), board));
        return;
      }
      const wasMoved = board.movePieceFromSelectedSquareTo(board.getSquareByIndexBackwards(index));
      if (wasMoved) {
        //console.log("Selected: ", board.selectedSquare);
        //console.log("Current: ", board.getSquareByIndexBackwards(index));
        board.clearSelectedSquare();
        //console.log("Selected: ", board.selectedSquare);
        setBoard(Object.assign(new Board(), board)); // Trigger re-render
        return;
      }
    }

    const targetSquare = board.getSquareByIndexBackwards(index);
    if (targetSquare) {
      board.selectSquare(targetSquare);
      setBoard(Object.assign(new Board(), board));
      //console.log("Selected: ", board.selectedSquare);
    }
  }

  function isSquareInValidSquares(square: Square): boolean {
    if (!board.selectedSquare || !board.selectedSquare.piece || !board.selectedSquare.piece.validSquares) return false;
      for (const validSquare of board.selectedSquare.piece.validSquares) {
        if (square == validSquare) {    
          return true;
        }
      }
      return false;
    }

  return (
    <div className ="relative bg-zinc-600 w-[100svw] h-[100svh] overflow-none grid place-items-center">
      <div className="grid gap-0" style={{ gridTemplateColumns: "repeat(8, 60px)", gridTemplateRows: "repeat(8, 60px)" }}>

        {Array.from({ length: 64 }).map((_, index) => (
          <button key={index} onClick={(e) => {handleSquareClick(e, index)}} className={`cursor-pointer w-[60px] h-[60px] grid place-items-center font-bold ${board.selectedSquare && board.getSquareByIndexBackwards(index) && board.selectedSquare == board.getSquareByIndexBackwards(index) ? "bg-orange-400" : isSquareInValidSquares(board.getSquareByIndexBackwards(index)!) ? "bg-blue-400" : board.getSquareByIndexBackwards(index)?.color == SquareColor.Light ? "bg-white text-black" : "bg-green-700 text-white" }`}>
            {!board.getSquareByIndexBackwards(index)?.piece ? "" : <img src={`./${board.getSquareByIndexBackwards(index)?.piece?.pieceType.toLowerCase()}-${board.getSquareByIndexBackwards(index)?.piece?.pieceColor.toLowerCase()}.png`}></img>}
          </button>
        ))}
        
      </div>
      { board.promoting ? 
      <div className="absolute bg-green-700/60 flex-row flex gap-2 border-green-600 border-[5px] rounded-xl p-2">
          <button onClick={(e) => {board.promoteToPiece(PieceType.Queen); setBoard(Object.assign(new Board(), board));}} className="cursor-pointer w-[60px] h-[60px] rounded-xl hover:bg-white/50"><img src={`./queen-${board.promoting!.piece!.pieceColor.toLowerCase()}.png`}></img></button>
          <button onClick={(e) => {board.promoteToPiece(PieceType.Knight); setBoard(Object.assign(new Board(), board));}} className="cursor-pointer w-[60px] h-[60px] rounded-xl hover:bg-white/50"><img src={`./knight-${board.promoting!.piece!.pieceColor.toLowerCase()}.png`}></img></button>
          <button onClick={(e) => {board.promoteToPiece(PieceType.Bishop); setBoard(Object.assign(new Board(), board));}} className="cursor-pointer w-[60px] h-[60px] rounded-xl hover:bg-white/50"><img src={`./bishop-${board.promoting!.piece!.pieceColor.toLowerCase()}.png`}></img></button>
          <button onClick={(e) => {board.promoteToPiece(PieceType.Rook); setBoard(Object.assign(new Board(), board));}} className="cursor-pointer w-[60px] h-[60px] rounded-xl hover:bg-white/50"><img src={`./rook-${board.promoting!.piece!.pieceColor.toLowerCase()}.png`}></img></button>
      </div>
      : ""
      }

      {board.gameOver ? 
      <div className="absolute bg-green-700/60 flex-col flex gap-2 items-center border-green-600 border-[5px] rounded-xl px-6 py-3">
          <h2 className="font-bold text-white text-3xl text-center">
            {board.checkmate ? "Checkmate!" : "Stalemate!"}
          </h2>
          <button onClick={(e) => {setBoard(new Board())}} className="cursor-pointer hover:bg-green-400 bg-green-500 py-2 w-[120px] rounded-xl font-bold text-white text-xl text-center">
            Play Again
          </button>
      </div>
      : ""
      }
    </div>
  );
}
