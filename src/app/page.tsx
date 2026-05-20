"use client";
import { Board, PieceColor, PieceType, SquareColor } from "./components/types";

export default function Home() {

  const board = new Board();

  return (
    <div className ="bg-zinc-600 w-[100svw] h-[100svh] overflow-none grid place-items-center">
      <div className="grid gap-0" style={{ gridTemplateColumns: "repeat(8, 60px)", gridTemplateRows: "repeat(8, 60px)" }}>

        {Array.from({ length: 64 }).map((_, index) => (
          <button key={index} onClick={(e) => {console.log(board.getSquareByIndexBackwards(index))}} className={`w-[60px] h-[60px] grid place-items-center font-bold ${board.getSquareByIndexBackwards(index)?.color == SquareColor.Light ? "bg-white text-black" : "bg-green-700 text-white" }`}>
            {!board.getSquareByIndexBackwards(index)?.piece ? "" : <img src={`./${board.getSquareByIndexBackwards(index)?.piece?.pieceType.toLowerCase()}-${board.getSquareByIndexBackwards(index)?.piece?.pieceColor.toLowerCase()}.png`}></img>}
          </button>
        ))}
        
      </div>
    </div>
  );
}
