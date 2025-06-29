"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import GameMenu from "./GameMenu";
import ClassicGame from "./games/ClassicGame";
import NxNGame from "./games/NxNGame";
import ThreeDGame from "./games/ThreeDGame";
import InfiniteGame from "./games/InfiniteGame";
import MisereGame from "./games/MisereGame";
import WildGame from "./games/WildGame";
import RandomizedGame from "./games/RandomizedGame";
import UltimateGame from "./games/UltimateGame";
import TicTacTwoGame from "./games/TicTacTwoGame";
import ThreePlayerGame from "./games/ThreePlayerGame";
import ObstacleGame from "./games/ObstacleGame";
import TimeControlledGame from "./games/TimeControlledGame";
import PowerUpGame from "./games/PowerUpGame";
import MoveRotationGame from "./games/MoveRotationGame";
import OneDimensionalGame from "./games/OneDimensionalGame";
import NumericalGame from "./games/NumericalGame";
import CircularGame from "./games/CircularGame";

export type GameVariant =
  | "classic"
  | "nxn"
  | "3d"
  | "infinite"
  | "misere"
  | "wild"
  | "randomized"
  | "ultimate"
  | "tictactwo"
  | "threeplayer"
  | "obstacle"
  | "timecontrolled"
  | "powerup"
  | "moverotation"
  | "onedimensional"
  | "numerical"
  | "circular";

export default function TicTacToeApp() {
  const [selectedGame, setSelectedGame] = useState<GameVariant | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const renderGame = () => {
    switch (selectedGame) {
      case "classic":
        return <ClassicGame onBack={() => setSelectedGame(null)} />;
      case "nxn":
        return <NxNGame onBack={() => setSelectedGame(null)} />;
      case "3d":
        return <ThreeDGame onBack={() => setSelectedGame(null)} />;
      case "infinite":
        return <InfiniteGame onBack={() => setSelectedGame(null)} />;
      case "misere":
        return <MisereGame onBack={() => setSelectedGame(null)} />;
      case "wild":
        return <WildGame onBack={() => setSelectedGame(null)} />;
      case "randomized":
        return <RandomizedGame onBack={() => setSelectedGame(null)} />;
      case "ultimate":
        return <UltimateGame onBack={() => setSelectedGame(null)} />;
      case "tictactwo":
        return <TicTacTwoGame onBack={() => setSelectedGame(null)} />;
      case "threeplayer":
        return <ThreePlayerGame onBack={() => setSelectedGame(null)} />;
      case "obstacle":
        return <ObstacleGame onBack={() => setSelectedGame(null)} />;
      case "timecontrolled":
        return <TimeControlledGame onBack={() => setSelectedGame(null)} />;
      case "powerup":
        return <PowerUpGame onBack={() => setSelectedGame(null)} />;
      case "moverotation":
        return <MoveRotationGame onBack={() => setSelectedGame(null)} />;
      case "onedimensional":
        return <OneDimensionalGame onBack={() => setSelectedGame(null)} />;
      case "numerical":
        return <NumericalGame onBack={() => setSelectedGame(null)} />;
      case "circular":
        return <CircularGame onBack={() => setSelectedGame(null)} />;
      default:
        return <GameMenu onSelectGame={setSelectedGame} />;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900 text-slate-100" : "bg-blue-50 text-slate-800"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Tic-Tac-Toe Variants
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-lg transition-colors duration-200 ${
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 text-emerald-400"
                : "bg-white hover:bg-gray-100 text-blue-600 shadow-sm"
            }`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        {/* Game Content */}
        <main>{renderGame()}</main>
      </div>
    </div>
  );
}
