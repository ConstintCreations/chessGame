"use client";
import { Board, PieceType, SquareColor } from "./components/types";

export default function Home() {

  const board = new Board();

  return (
    <div className ="bg-zinc-600 w-[100svw] h-[100svh] overflow-none grid place-items-center">
      <div className="grid gap-0" style={{ gridTemplateColumns: "repeat(8, 60px)", gridTemplateRows: "repeat(8, 60px)" }}>

        {Array.from({ length: 64 }).map((_, index) => (
          <button key={index} onClick={(e) => {console.log(board.getSquareByIndexBackwards(index))}} className={`w-[60px] h-[60px] grid place-items-center font-bold ${board.getSquareByIndexBackwards(index)?.color == SquareColor.Light ? "bg-white text-black" : "bg-green-700 text-white" }`}>{board.getSquareByIndexBackwards(index)?.piece?.pieceType || null}</button>
        ))}
        
      </div>
    </div>
  );
}
