"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw, Trophy, Circle, Clock } from "lucide-react";

interface CircularGameProps {
  onBack: () => void;
}

type Cell = "X" | "O" | null;
type Player = "X" | "O";

export default function CircularGame({ onBack }: CircularGameProps) {
  const [board, setBoard] = useState<Cell[]>(Array(8).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [boardSize, setBoardSize] = useState(8);
  const [winningPositions, setWinningPositions] = useState<number[]>([]);

  const checkWinner = (squares: Cell[], size: number) => {
    // Check for 3 consecutive positions in the circle
    for (let i = 0; i < size; i++) {
      const pos1 = i;
      const pos2 = (i + 1) % size;
      const pos3 = (i + 2) % size;

      if (
        squares[pos1] &&
        squares[pos1] === squares[pos2] &&
        squares[pos1] === squares[pos3]
      ) {
        setWinningPositions([pos1, pos2, pos3]);
        return squares[pos1];
      }
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameEnded) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard, boardSize);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      setScores((prev) => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
      return;
    }

    if (newBoard.every((cell) => cell !== null)) {
      setGameEnded(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const resetGame = () => {
    setBoard(Array(boardSize).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    setWinningPositions([]);
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const changeBoardSize = (newSize: number) => {
    setBoardSize(newSize);
    setBoard(Array(newSize).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    setWinningPositions([]);
  };

  // Calculate position on circle
  const getPositionStyle = (index: number, total: number) => {
    const angle = (index * 360) / total - 90; // Start from top (12 o'clock)
    const radius = 120; // Distance from center
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return {
      transform: `translate(${x}px, ${y}px)`,
      position: "absolute" as const,
      left: "50%",
      top: "50%",
      marginLeft: "-24px", // Half of button width
      marginTop: "-24px", // Half of button height
    };
  };

  const getClockPosition = (index: number, total: number) => {
    if (total === 8) {
      const positions = ["12", "1:30", "3", "4:30", "6", "7:30", "9", "10:30"];
      return positions[index];
    } else if (total === 9) {
      const positions = [
        "12",
        "1:20",
        "2:40",
        "4",
        "5:20",
        "6:40",
        "8",
        "9:20",
        "10:40",
      ];
      return positions[index];
    } else {
      const hour = Math.round((index * 12) / total);
      return `${hour === 0 ? 12 : hour}`;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Circular Tic-Tac-Toe</h2>
        <Circle className="text-cyan-500" size={24} />
      </div>

      {/* Rules */}
      <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Circle className="text-cyan-600 dark:text-cyan-400" size={16} />
          <h3 className="font-semibold text-cyan-800 dark:text-cyan-300">
            Circular Rules!
          </h3>
        </div>
        <div className="text-sm text-cyan-700 dark:text-cyan-400 space-y-1">
          <p>
            • Board arranged in a circle like a clock face ({boardSize}{" "}
            positions)
          </p>
          <p>
            • Get <strong>3 consecutive adjacent positions</strong> to win
          </p>
          <p>
            • The circle wraps around - position 1 is adjacent to the last
            position!
          </p>
          <p>• No diagonals, only consecutive circular sequences</p>
          <p>• Perfect for sketching in sand, on plates, or anywhere round!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Game Configuration */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-cyan-600 dark:text-cyan-400" size={16} />
              <h4 className="font-semibold">Circle Configuration</h4>
            </div>

            <div className="space-y-3">
              <div className="text-center p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <div className="text-sm font-medium text-cyan-800 dark:text-cyan-300">
                  Current: {boardSize} positions
                </div>
                <div className="text-xs text-cyan-600 dark:text-cyan-400">
                  {boardSize === 8
                    ? "Classic Clock"
                    : boardSize === 9
                    ? "Extended Circle"
                    : "Custom Size"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Circle Size:
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => changeBoardSize(8)}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      boardSize === 8
                        ? "bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200"
                        : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    <div className="font-medium">8 Positions</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Classic clock layout
                    </div>
                  </button>
                  <button
                    onClick={() => changeBoardSize(9)}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      boardSize === 9
                        ? "bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200"
                        : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    <div className="font-medium">9 Positions</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Extended circle
                    </div>
                  </button>
                  <button
                    onClick={() => changeBoardSize(6)}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      boardSize === 6
                        ? "bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200"
                        : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    <div className="font-medium">6 Positions</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Compact circle
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Game Statistics */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold mb-3 text-center">Game Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Circle Size:</span>
                <span className="font-medium">{boardSize} positions</span>
              </div>
              <div className="flex justify-between">
                <span>Win Condition:</span>
                <span className="font-medium">3 consecutive</span>
              </div>
              <div className="flex justify-between">
                <span>Filled Positions:</span>
                <span className="font-medium">
                  {board.filter((cell) => cell !== null).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Empty Positions:</span>
                <span className="font-medium">
                  {board.filter((cell) => cell === null).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="lg:col-span-3">
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
                  <span className="text-lg font-semibold">
                    It&apos;s a Draw!
                  </span>
                )}
              </div>
            ) : (
              <div className="space-y-2">
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
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Get 3 consecutive positions around the circle to win!
                </div>
              </div>
            )}
          </div>

          {/* Circular Game Board */}
          <div className="flex justify-center mb-8">
            <div className="relative w-80 h-80 bg-slate-100 dark:bg-slate-800 rounded-full border-4 border-slate-300 dark:border-slate-600 flex items-center justify-center">
              {/* Center circle decoration */}
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <Circle className="text-slate-400" size={24} />
              </div>

              {/* Clock hour markers */}
              {Array.from({ length: 12 }, (_, i) => {
                const angle = i * 30 - 90;
                const x = Math.cos((angle * Math.PI) / 180) * 140;
                const y = Math.sin((angle * Math.PI) / 180) * 140;
                return (
                  <div
                    key={i}
                    className="absolute text-xs text-slate-400 dark:text-slate-500 font-mono"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                    }}
                  >
                    {i === 0 ? 12 : i}
                  </div>
                );
              })}

              {/* Game positions */}
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  className={`w-12 h-12 rounded-full text-lg font-bold transition-all border-2 ${
                    winningPositions.includes(index)
                      ? "border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 shadow-lg"
                      : cell
                      ? `${
                          cell === "X"
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                            : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                        } cursor-not-allowed`
                      : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500"
                  }`}
                  style={getPositionStyle(index, boardSize)}
                  disabled={cell !== null || gameEnded}
                >
                  {cell}
                </button>
              ))}
            </div>
          </div>

          {/* Position Reference */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
              <Clock size={16} className="text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium">
                Positions like clock hours:{" "}
                {board.map((_, i) => getClockPosition(i, boardSize)).join(", ")}
              </span>
            </div>
          </div>

          {/* Winning Sequences Preview */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2 text-center">
              Possible Winning Sequences
            </h4>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p className="text-center mb-2">
                <strong>Total possible wins:</strong> {boardSize} different
                3-position sequences
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {Array.from({ length: boardSize }, (_, i) => {
                  const pos1 = i + 1;
                  const pos2 = ((i + 1) % boardSize) + 1;
                  const pos3 = ((i + 2) % boardSize) + 1;
                  return (
                    <div
                      key={i}
                      className="text-center p-1 bg-white dark:bg-slate-700 rounded"
                    >
                      {pos1}-{pos2}-{pos3}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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
          🌀 <strong>Circular Strategy:</strong> Think like a clock - control
          key hour positions and remember the circle wraps around!
        </p>
      </div>
    </div>
  );
}
