"use client";

import { GameVariant } from "./TicTacToeApp";
import { Grid3X3, Grid2X2, Layers, Infinity } from "lucide-react";

interface GameMenuProps {
  onSelectGame: (game: GameVariant) => void;
}

export default function GameMenu({ onSelectGame }: GameMenuProps) {
  const games = [
    {
      id: "classic" as GameVariant,
      title: "Classic 3x3",
      description:
        "Traditional tic-tac-toe with 3x3 grid. Get 3 in a row to win.",
      icon: Grid3X3,
      difficulty: "Easy",
      players: "2 Players",
    },
    {
      id: "nxn" as GameVariant,
      title: "NxN Boards",
      description: "Scalable boards from 4x4 to 10x10. Get N in a row to win.",
      icon: Grid2X2,
      difficulty: "Medium",
      players: "2 Players",
    },
    {
      id: "3d" as GameVariant,
      title: "3D Tic-Tac-Toe",
      description: "Multi-layer 3D boards. Win across x, y, or z dimensions.",
      icon: Layers,
      difficulty: "Hard",
      players: "2 Players",
    },
    {
      id: "infinite" as GameVariant,
      title: "Infinite Grid",
      description: "Unlimited grid space. Get 5 in a row to win.",
      icon: Infinity,
      difficulty: "Expert",
      players: "2 Players",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 dark:text-slate-100">
          Choose Your Game
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Select from our collection of tic-tac-toe variants
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className="group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-emerald-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-emerald-900/30 text-blue-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  <game.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">
                    {game.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {game.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex gap-4 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full font-medium ${
                      game.difficulty === "Easy"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : game.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : game.difficulty === "Hard"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {game.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-medium">
                    {game.players}
                  </span>
                </div>
                <div className="text-blue-600 dark:text-emerald-400 font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                  Play →
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
