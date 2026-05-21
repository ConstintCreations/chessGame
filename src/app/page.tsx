"use client";
import { Board, PieceColor, PieceType, SquareColor, Square } from "./components/types";
import { useState } from "react";

export default function Home() {

  const [board, setBoard] = useState<Board>(new Board);

  function handleSquareClick(e:any, index:number) {
    console.log("click: ", board.getSquareByIndexBackwards(index));
    if (board.selectedSquare) {
      if (board.selectedSquare == board.getSquareByIndexBackwards(index)) {
        board.clearSelectedSquare();
        setBoard(Object.assign(new Board(), board));
        return;
      }
      const wasMoved = board.movePieceFromSelectedSquareTo(board.getSquareByIndexBackwards(index));
      if (wasMoved) {
        console.log("Selected: ", board.selectedSquare);
        console.log("Current: ", board.getSquareByIndexBackwards(index));
        board.clearSelectedSquare();
        console.log("Selected: ", board.selectedSquare);
        setBoard(Object.assign(new Board(), board)); // Trigger re-render
        return;
      }
    }

    const targetSquare = board.getSquareByIndexBackwards(index);
    if (targetSquare) {
      board.selectSquare(targetSquare);
      setBoard(Object.assign(new Board(), board));
      console.log("Selected: ", board.selectedSquare);
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
          <button key={index} onClick={(e) => {handleSquareClick(e, index)}} className={`w-[60px] h-[60px] grid place-items-center font-bold ${board.selectedSquare && board.getSquareByIndexBackwards(index) && board.selectedSquare == board.getSquareByIndexBackwards(index) ? "bg-orange-400" : isSquareInValidSquares(board.getSquareByIndexBackwards(index)!) ? "bg-blue-400" : board.getSquareByIndexBackwards(index)?.color == SquareColor.Light ? "bg-white text-black" : "bg-green-700 text-white" }`}>
            {!board.getSquareByIndexBackwards(index)?.piece ? "" : <img src={`./${board.getSquareByIndexBackwards(index)?.piece?.pieceType.toLowerCase()}-${board.getSquareByIndexBackwards(index)?.piece?.pieceColor.toLowerCase()}.png`}></img>}
          </button>
        ))}
        
      </div>
      {/*
      <div className="absolute bg-green-700/60 flex-row flex gap-2 border-green-600 border-[5px] rounded-xl p-2">
          <button className="w-[60px] h-[60px]"><img src="./queen-light.png"></img></button>
          <button className="w-[60px] h-[60px]"><img src="./knight-light.png"></img></button>
          <button className="w-[60px] h-[60px]"><img src="./bishop-light.png"></img></button>
          <button className="w-[60px] h-[60px]"><img src="./rook-light.png"></img></button>

          
          <button className="w-[60px] h-[60px]"><img src="./queen-dark.png"></img></button>
          <button className="w-[60px] h-[60px]"><img src="./knight-dark.png"></img></button>
          <button className="w-[60px] h-[60px]"><img src="./bishop-dark.png"></img></button>
          <button className="w-[60px] h-[60px]"><img src="./rook-dark.png"></img></button>
          
      </div>
      */}
    </div>
  );
}
