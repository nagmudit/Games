"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw, Trophy, Minus, Settings } from "lucide-react";

interface OneDimensionalGameProps {
  onBack: () => void;
}

type Cell = "X" | "O" | null;
type Player = "X" | "O";

export default function OneDimensionalGame({
  onBack,
}: OneDimensionalGameProps) {
  const [boardSize, setBoardSize] = useState(7);
  const [winLength, setWinLength] = useState(3);
  const [board, setBoard] = useState<Cell[]>(Array(7).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [moveCount, setMoveCount] = useState(0);
  const [winningPositions, setWinningPositions] = useState<number[]>([]);

  const checkWinner = (squares: Cell[], size: number, winLen: number) => {
    // Check for consecutive sequences of winLen
    for (let i = 0; i <= size - winLen; i++) {
      const sequence = squares.slice(i, i + winLen);
      if (sequence[0] && sequence.every((cell) => cell === sequence[0])) {
        setWinningPositions(
          Array.from({ length: winLen }, (_, idx) => i + idx)
        );
        return sequence[0];
      }
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameEnded) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setMoveCount(moveCount + 1);

    const gameWinner = checkWinner(newBoard, boardSize, winLength);
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
    setMoveCount(0);
    setWinningPositions([]);
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const handleSizeChange = (newSize: number, newWinLength: number) => {
    setBoardSize(newSize);
    setWinLength(newWinLength);
    setBoard(Array(newSize).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    setMoveCount(0);
    setWinningPositions([]);
  };

  const getBoardConfigurations = () => [
    { size: 5, winLength: 3, name: "1×5 (3 to win)", difficulty: "Easy" },
    { size: 7, winLength: 3, name: "1×7 (3 to win)", difficulty: "Medium" },
    { size: 9, winLength: 3, name: "1×9 (3 to win)", difficulty: "Medium" },
    { size: 7, winLength: 4, name: "1×7 (4 to win)", difficulty: "Hard" },
    { size: 9, winLength: 4, name: "1×9 (4 to win)", difficulty: "Hard" },
    { size: 11, winLength: 4, name: "1×11 (4 to win)", difficulty: "Expert" },
    { size: 13, winLength: 5, name: "1×13 (5 to win)", difficulty: "Expert" },
  ];

  const getCurrentConfig = () => {
    const configs = getBoardConfigurations();
    return (
      configs.find(
        (config) => config.size === boardSize && config.winLength === winLength
      ) || {
        name: `1×${boardSize} (${winLength} to win)`,
        difficulty: "Custom",
      }
    );
  };

  const getOptimalStrategy = () => {
    if (boardSize === 5 && winLength === 3) {
      return "First player wins with optimal play. Control the center!";
    } else if (boardSize === 7 && winLength === 3) {
      return "First player has a strong advantage. Occupy key central positions.";
    } else if (boardSize === 9 && winLength === 3) {
      return "More balanced game. Focus on creating multiple threats.";
    } else if (winLength === 4) {
      return "Longer sequences required. Build incrementally and block opponent threats.";
    } else {
      return "Custom configuration. Adapt your strategy to the board size and win condition.";
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
        <h2 className="text-2xl font-bold">One-Dimensional Tic-Tac-Toe</h2>
        <Minus className="text-orange-500" size={24} />
      </div>

      {/* Rules */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Minus className="text-orange-600 dark:text-orange-400" size={16} />
          <h3 className="font-semibold text-orange-800 dark:text-orange-300">
            1D Rules!
          </h3>
        </div>
        <div className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
          <p>• Game played on a single row of {boardSize} cells</p>
          <p>
            • Get <strong>{winLength} consecutive symbols</strong> to win
          </p>
          <p>
            • Pure linear strategy - no diagonals, just horizontal thinking!
          </p>
          <p>
            • Despite seeming simple, optimal play requires careful positioning
          </p>
          <p>
            • <strong>Strategy:</strong> {getOptimalStrategy()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Game Configuration */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings
                className="text-orange-600 dark:text-orange-400"
                size={16}
              />
              <h4 className="font-semibold">Board Configuration</h4>
            </div>

            <div className="space-y-3">
              <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-sm font-medium text-orange-800 dark:text-orange-300">
                  Current: {getCurrentConfig().name}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  Difficulty: {getCurrentConfig().difficulty}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Preset Configurations:
                </label>
                <div className="space-y-1">
                  {getBoardConfigurations().map((config, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        handleSizeChange(config.size, config.winLength)
                      }
                      disabled={moveCount > 0}
                      className={`w-full text-left p-2 rounded text-xs transition-colors ${
                        config.size === boardSize &&
                        config.winLength === winLength
                          ? "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200"
                          : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="font-medium">{config.name}</div>
                      <div className="text-slate-600 dark:text-slate-400">
                        {config.difficulty}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {moveCount > 0 && (
                <div className="text-xs text-center text-slate-600 dark:text-slate-400">
                  Finish current game to change settings
                </div>
              )}
            </div>
          </div>

          {/* Game Statistics */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold mb-3 text-center">Game Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Board Size:</span>
                <span className="font-medium">1×{boardSize}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Condition:</span>
                <span className="font-medium">{winLength} in a row</span>
              </div>
              <div className="flex justify-between">
                <span>Moves Made:</span>
                <span className="font-medium">{moveCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Empty Cells:</span>
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
                  Get {winLength} in a row to win!
                </div>
              </div>
            )}
          </div>

          {/* 1D Game Board */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-1 p-4 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-x-auto">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  className={`w-12 h-12 border-2 rounded text-lg font-bold transition-all flex items-center justify-center ${
                    winningPositions.includes(index)
                      ? "border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 shadow-lg"
                      : cell
                      ? `${
                          cell === "X"
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                            : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                        } cursor-not-allowed`
                      : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500"
                  }`}
                  disabled={cell !== null || gameEnded}
                >
                  {cell}
                </button>
              ))}
            </div>
          </div>

          {/* Position Numbers */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-1 px-4">
              {board.map((_, index) => (
                <div
                  key={index}
                  className="w-12 text-center text-xs text-slate-500 dark:text-slate-400"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical Insight */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2 text-center">
              Mathematical Properties
            </h4>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p>
                • <strong>State Space:</strong>{" "}
                {Math.pow(3, boardSize).toLocaleString()} total possible
                positions
              </p>
              <p>
                • <strong>Game Tree Complexity:</strong> Significantly reduced
                from 2D variants
              </p>
              <p>
                • <strong>First Player Advantage:</strong>{" "}
                {boardSize <= 7 && winLength === 3
                  ? "Strong"
                  : boardSize <= 9 && winLength === 3
                  ? "Moderate"
                  : "Varies"}
              </p>
              <p>
                • <strong>Perfect Play:</strong> Many configurations are solved
                - outcome determined with optimal play
              </p>
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

      {/* Strategy Notes */}
      <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>
          ➖ <strong>1D Strategy:</strong> Linear thinking only - control key
          central positions and create multiple threats along the line!
        </p>
      </div>
    </div>
  );
}
