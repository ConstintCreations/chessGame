import Image from "next/image";
import { Board, PieceType, SquareColor } from "./components/types";

export default function Home() {

  const board = new Board();

  return (
    <div className ="bg-zinc-600 w-[100svw] h-[100svh] overflow-none grid place-items-center">
      <div className="grid gap-0" style={{ gridTemplateColumns: "repeat(8, 60px)", gridTemplateRows: "repeat(8, 60px)" }}>

        {Array.from({ length: 64 }).map((_, index) => (
          <div key={index} className={`w-[60px] h-[60px] grid place-items-center font-bold ${board.getSquareByIndex(index)?.color == SquareColor.Light ? "bg-white text-black" : "bg-green-700 text-white" }`}>{board.getSquareByIndex(index)?.piece?.pieceType || null}</div>
        ))}
        
      </div>
    </div>
  );
}
