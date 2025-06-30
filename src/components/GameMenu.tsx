"use client";

import { useState } from "react";
import { GameVariant } from "./TicTacToeApp";
import {
  Grid3X3,
  Grid2X2,
  Layers,
  Infinity,
  AlertTriangle,
  Shuffle,
  Dice6,
  Grid3x3,
  Copy,
  Users,
  Shield,
  Clock,
  Zap,
  RotateCw,
  Minus,
  Hash,
  Circle,
  EyeOff,
  Trash2,
  Filter,
  X,
} from "lucide-react";

interface GameMenuProps {
  onSelectGame: (game: GameVariant) => void;
}

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard" | "Expert";

export default function GameMenu({ onSelectGame }: GameMenuProps) {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyFilter>("All");
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
      difficulty: "Expert",
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
    {
      id: "misere" as GameVariant,
      title: "Misère Tic-Tac-Toe",
      description:
        "Reverse rules! Try to avoid making 3 in a row. First to get 3 loses!",
      icon: AlertTriangle,
      difficulty: "Easy",
      players: "2 Players",
    },
    {
      id: "wild" as GameVariant,
      title: "Wild Tic-Tac-Toe",
      description:
        "Place either X or O on your turn. Strategic bluffing is key!",
      icon: Shuffle,
      difficulty: "Hard",
      players: "2 Players",
    },
    {
      id: "randomized" as GameVariant,
      title: "Randomized Start",
      description: "First few moves are randomly placed. Adapt your strategy!",
      icon: Dice6,
      difficulty: "Medium",
      players: "2 Players",
    },
    {
      id: "ultimate" as GameVariant,
      title: "Ultimate Tic-Tac-Toe",
      description:
        "9 mini boards in a 3x3 grid. Your move determines where opponent plays next!",
      icon: Grid3x3,
      difficulty: "Expert",
      players: "2 Players",
    },
    {
      id: "tictactwo" as GameVariant,
      title: "Tic-Tac-Two",
      description: "Two parallel boards. Win both boards to claim victory!",
      icon: Copy,
      difficulty: "Hard",
      players: "2 Players",
    },
    {
      id: "threeplayer" as GameVariant,
      title: "Three-Player Tic-Tac-Toe",
      description:
        "3 players on a 5x5 grid with X, O, and Δ. Alliances and strategy!",
      icon: Users,
      difficulty: "Hard",
      players: "3 Players",
    },
    {
      id: "obstacle" as GameVariant,
      title: "Tic-Tac-Toe with Obstacles",
      description: "Navigate around blocked cells and dangerous traps!",
      icon: Shield,
      difficulty: "Medium",
      players: "2 Players",
    },
    {
      id: "timecontrolled" as GameVariant,
      title: "Time-Controlled Tic-Tac-Toe",
      description: "Chess clock rules - make your moves before time runs out!",
      icon: Clock,
      difficulty: "Medium",
      players: "2 Players",
    },
    {
      id: "powerup" as GameVariant,
      title: "Tic-Tac-Toe with Power-Ups",
      description: "Collect special abilities to gain the upper hand!",
      icon: Zap,
      difficulty: "Expert",
      players: "2 Players",
    },
    {
      id: "moverotation" as GameVariant,
      title: "Move Rotation",
      description:
        "Limited memory! Old moves disappear when you exceed the limit.",
      icon: RotateCw,
      difficulty: "Expert",
      players: "2 Players",
    },
    {
      id: "onedimensional" as GameVariant,
      title: "One-Dimensional",
      description: "Pure linear strategy on a single row. Deceptively complex!",
      icon: Minus,
      difficulty: "Easy",
      players: "2 Players",
    },
    {
      id: "numerical" as GameVariant,
      title: "Numerical Tic-Tac-Toe",
      description: "Use numbers 1-9 to sum lines to 15. Math meets strategy!",
      icon: Hash,
      difficulty: "Hard",
      players: "2 Players",
    },
    {
      id: "circular" as GameVariant,
      title: "Circular Board",
      description:
        "Clock-like circular board. Get 3 consecutive around the circle!",
      icon: Circle,
      difficulty: "Medium",
      players: "2 Players",
    },
    {
      id: "dice" as GameVariant,
      title: "Dice Tic-Tac-Toe",
      description:
        "Roll dice to determine your move coordinates. Luck meets strategy!",
      icon: Dice6,
      difficulty: "Easy",
      players: "2 Players",
    },
    {
      id: "blind" as GameVariant,
      title: "Blind Tic-Tac-Toe",
      description:
        "Memory challenge! Make moves without seeing the board state.",
      icon: EyeOff,
      difficulty: "Expert",
      players: "2 Players",
    },
    {
      id: "erasereplace" as GameVariant,
      title: "Erase & Replace",
      description:
        "Capture opponent&apos;s pieces after turn 3. Adds mild capture mechanics!",
      icon: Trash2,
      difficulty: "Medium",
      players: "2 Players",
    },
  ];

  const difficultyOptions: DifficultyFilter[] = [
    "All",
    "Easy",
    "Medium",
    "Hard",
    "Expert",
  ];

  const filteredGames =
    selectedDifficulty === "All"
      ? games
      : games.filter((game) => game.difficulty === selectedDifficulty);

  const getDifficultyCount = (difficulty: DifficultyFilter) => {
    if (difficulty === "All") return games.length;
    return games.filter((game) => game.difficulty === difficulty).length;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 dark:text-slate-100">
          Choose Your Game
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Select from our collection of tic-tac-toe variants
        </p>

        {/* Animated symbols around the title */}
        <div className="relative mt-6 mb-8">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 text-4xl">
            <span className="inline-block text-blue-500/40 dark:text-blue-400/30 wiggle-animation mr-4">
              X
            </span>
            <span className="inline-block text-red-500/40 dark:text-red-400/30 float-animation">
              O
            </span>
            <span className="inline-block text-green-500/40 dark:text-green-400/30 glitch-animation ml-4">
              Δ
            </span>
          </div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Filter size={20} className="text-slate-600 dark:text-slate-400" />
          <span className="text-lg font-medium text-slate-800 dark:text-slate-200">
            Filter by Difficulty:
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {difficultyOptions.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                selectedDifficulty === difficulty
                  ? difficulty === "Easy"
                    ? "bg-green-500 text-white shadow-lg"
                    : difficulty === "Medium"
                    ? "bg-yellow-500 text-white shadow-lg"
                    : difficulty === "Hard"
                    ? "bg-orange-500 text-white shadow-lg"
                    : difficulty === "Expert"
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-blue-500 text-white shadow-lg"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {difficulty}
              <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                {getDifficultyCount(difficulty)}
              </span>
              {selectedDifficulty === difficulty &&
                selectedDifficulty !== "All" && (
                  <X
                    size={14}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  />
                )}
            </button>
          ))}
        </div>

        {selectedDifficulty !== "All" && (
          <div className="text-center mt-4">
            <button
              onClick={() => setSelectedDifficulty("All")}
              className="text-sm text-blue-600 dark:text-emerald-400 hover:underline"
            >
              Clear filter and show all {games.length} variants
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-center mb-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing {filteredGames.length} of {games.length} variants
          {selectedDifficulty !== "All" && (
            <span className="ml-2">
              •{" "}
              <span
                className={`font-medium ${
                  selectedDifficulty === "Easy"
                    ? "text-green-600 dark:text-green-400"
                    : selectedDifficulty === "Medium"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : selectedDifficulty === "Hard"
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {selectedDifficulty}
              </span>{" "}
              difficulty
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
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
                  <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
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
