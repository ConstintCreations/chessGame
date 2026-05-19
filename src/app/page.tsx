import Image from "next/image";
import { Board } from "./components/types";

export default function Home() {

  const board = new Board(8);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-600 font-sans dark:bg-zinc-600">
      <div className="flex flex-row">
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
      </div>
      <div className="flex flex-row">
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
      </div>
      <div className="flex flex-row">
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
      </div>
      <div className="flex flex-row">
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
      </div>
      <div className="flex flex-row">
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
      </div>
      <div className="flex flex-row">
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
      </div>
      <div className="flex flex-row">
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
      </div>
      <div className="flex flex-row">
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
        <div className="w-8 h-8 bg-green-700"></div>
        <div className="w-8 h-8 bg-white"></div>
      </div>
    </div>
  );
}
