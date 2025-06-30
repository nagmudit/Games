"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  AlertTriangle,
  Shield,
} from "lucide-react";

interface ObstacleGameProps {
  onBack: () => void;
}

type Cell = "X" | "O" | "OBSTACLE" | "TRAP" | null;
type Player = "X" | "O";

export default function ObstacleGame({ onBack }: ObstacleGameProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  // Generate random obstacles and traps
  const generateObstacles = () => {
    const newBoard = Array(9).fill(null);
    const obstacleCount = Math.floor(Math.random() * 3) + 1; // 1-3 obstacles
    const trapCount = Math.floor(Math.random() * 2) + 1; // 1-2 traps

    const positions = new Set<number>();

    // Place obstacles
    for (let i = 0; i < obstacleCount; i++) {
      let pos;
      do {
        pos = Math.floor(Math.random() * 9);
      } while (positions.has(pos));
      positions.add(pos);
      newBoard[pos] = "OBSTACLE";
    }

    // Place traps
    for (let i = 0; i < trapCount; i++) {
      let pos;
      do {
        pos = Math.floor(Math.random() * 9);
      } while (positions.has(pos));
      positions.add(pos);
      newBoard[pos] = "TRAP";
    }

    setBoard(newBoard);
  };

  useEffect(() => {
    generateObstacles();
  }, []);

  const checkWinner = (squares: Cell[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] &&
        squares[a] !== "OBSTACLE" &&
        squares[a] !== "TRAP"
      ) {
        return squares[a] as Player;
      }
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameEnded) return;

    const newBoard = [...board];

    // Handle trap - skip next turn
    if (board[index] === "TRAP") {
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      // Skip next turn (player loses a turn)
      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);

      // Check for winner
      const gameWinner = checkWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        setGameEnded(true);
        setScores((prev) => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
      } else if (newBoard.every((cell) => cell !== null)) {
        setGameEnded(true);
        setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      }
      return;
    }

    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      setScores((prev) => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
    } else if (newBoard.every((cell) => cell !== null)) {
      setGameEnded(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    generateObstacles();
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const getCellContent = (cell: Cell) => {
    if (cell === "OBSTACLE") return "🚫";
    if (cell === "TRAP") return "🕳️";
    return cell;
  };

  const getCellClassName = (cell: Cell) => {
    const base =
      "w-16 h-16 border border-slate-300 dark:border-slate-600 rounded text-xl font-bold transition-all duration-200";

    if (cell === "OBSTACLE") {
      return `${base} bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white`;
    }
    if (cell === "TRAP") {
      return `${base} bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/50`;
    }
    if (cell) {
      return `${base} ${
        cell === "X"
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
          : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
      } cursor-not-allowed`;
    }

    return `${base} bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Tic-Tac-Toe with Obstacles</h2>
        <Shield className="text-orange-500" size={24} />
      </div>

      {/* Rules Explanation */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle
            className="text-orange-600 dark:text-orange-400"
            size={16}
          />
          <h3 className="font-semibold text-orange-800 dark:text-orange-300">
            Obstacle Rules!
          </h3>
        </div>
        <div className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
          <p>
            • <span className="font-mono">🚫</span> <strong>Obstacles:</strong>{" "}
            Blocked cells where nobody can play
          </p>
          <p>
            • <span className="font-mono">🕳️</span> <strong>Traps:</strong> You
            can play here, but you lose your next turn!
          </p>
          <p>• Navigate around obstacles and use traps strategically</p>
          <p>• New obstacles and traps are generated each game</p>
        </div>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            X
          </div>
          <div className="text-lg font-semibold">{scores.X}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Player X
          </div>
        </div>
        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <div className="text-xl font-bold text-slate-600 dark:text-slate-400">
            Draws
          </div>
          <div className="text-lg font-semibold">{scores.draws}</div>
        </div>
        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            O
          </div>
          <div className="text-lg font-semibold">{scores.O}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Player O
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="text-center mb-6">
        {gameEnded ? (
          <div className="flex items-center justify-center gap-2">
            {winner ? (
              <>
                <Trophy className="text-yellow-500" size={20} />
                <span className="text-lg font-semibold">
                  Player{" "}
                  <span
                    className={
                      winner === "X"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {winner}
                  </span>{" "}
                  Wins!
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold">It&apos;s a Draw!</span>
            )}
          </div>
        ) : (
          <div className="text-lg font-semibold">
            Current Player:{" "}
            <span
              className={
                currentPlayer === "X"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-red-600 dark:text-red-400"
              }
            >
              {currentPlayer}
            </span>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-3 gap-2 p-4 bg-slate-200 dark:bg-slate-700 rounded-lg">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={getCellClassName(cell)}
              disabled={(cell !== null && cell !== "TRAP") || gameEnded}
            >
              {getCellContent(cell)}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-6">
        <h4 className="font-semibold mb-3 text-center">Legend</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚫</span>
            <span>Obstacle (blocked)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🕳️</span>
            <span>Trap (lose next turn)</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw size={16} />
          New Game
        </button>
        <button
          onClick={resetAll}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Strategy Tips */}
      <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>
          💡 <strong>Strategy Tip:</strong> Use traps to force your opponent to
          lose turns, but be careful not to fall into them yourself!
        </p>
      </div>
    </div>
  );
}
