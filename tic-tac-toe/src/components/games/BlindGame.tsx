"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw, Trophy, Eye, EyeOff, Map } from "lucide-react";

interface BlindGameProps {
  onBack: () => void;
}

type Cell = "X" | "O" | null;
type Player = "X" | "O";

export default function BlindGame({ onBack }: BlindGameProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [showBoard, setShowBoard] = useState(false);
  const [moveHistory, setMoveHistory] = useState<
    {
      player: Player;
      position: number;
      coordinateName: string;
      result: "success" | "occupied";
    }[]
  >([]);
  const [coordinateInput, setCoordinateInput] = useState("");

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
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const getCoordinateName = (position: number) => {
    const names = [
      "Top-Left",
      "Top-Center",
      "Top-Right",
      "Middle-Left",
      "Center",
      "Middle-Right",
      "Bottom-Left",
      "Bottom-Center",
      "Bottom-Right",
    ];
    return names[position];
  };

  const getGridCoordinate = (position: number) => {
    const row = Math.floor(position / 3) + 1;
    const col = (position % 3) + 1;
    return `${row},${col}`;
  };

  const parseCoordinate = (input: string): number | null => {
    const cleaned = input.toLowerCase().trim();

    // Handle grid coordinates like "1,1", "2,3", etc.
    const gridMatch = cleaned.match(/^(\d),\s*(\d)$/);
    if (gridMatch) {
      const row = parseInt(gridMatch[1]);
      const col = parseInt(gridMatch[2]);
      if (row >= 1 && row <= 3 && col >= 1 && col <= 3) {
        return (row - 1) * 3 + (col - 1);
      }
    }

    // Handle position names
    const positionMap: { [key: string]: number } = {
      "top-left": 0,
      topleft: 0,
      tl: 0,
      "1": 0,
      "top-center": 1,
      topcenter: 1,
      tc: 1,
      top: 1,
      "2": 1,
      "top-right": 2,
      topright: 2,
      tr: 2,
      "3": 2,
      "middle-left": 3,
      middleleft: 3,
      ml: 3,
      left: 3,
      "4": 3,
      center: 4,
      middle: 4,
      c: 4,
      "5": 4,
      "middle-right": 5,
      middleright: 5,
      mr: 5,
      right: 5,
      "6": 5,
      "bottom-left": 6,
      bottomleft: 6,
      bl: 6,
      "7": 6,
      "bottom-center": 7,
      bottomcenter: 7,
      bc: 7,
      bottom: 7,
      "8": 7,
      "bottom-right": 8,
      bottomright: 8,
      br: 8,
      "9": 8,
    };

    return positionMap[cleaned] !== undefined ? positionMap[cleaned] : null;
  };

  const handleCoordinateSubmit = () => {
    const position = parseCoordinate(coordinateInput);

    if (position === null) {
      alert('Invalid coordinate! Try: "1,1", "top-left", "center", etc.');
      return;
    }

    if (board[position] !== null) {
      setMoveHistory((prev) => [
        ...prev,
        {
          player: currentPlayer,
          position,
          coordinateName: coordinateInput,
          result: "occupied",
        },
      ]);
      alert(`Position ${getCoordinateName(position)} is already occupied!`);
      return;
    }

    // Make the move
    const newBoard = [...board];
    newBoard[position] = currentPlayer;
    setBoard(newBoard);

    setMoveHistory((prev) => [
      ...prev,
      {
        player: currentPlayer,
        position,
        coordinateName: coordinateInput,
        result: "success",
      },
    ]);

    setCoordinateInput("");

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      setScores((prev) => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
      setShowBoard(true); // Reveal board when game ends
      return;
    }

    if (newBoard.every((cell) => cell !== null)) {
      setGameEnded(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      setShowBoard(true); // Reveal board when game ends
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleCellClick = (index: number) => {
    if (!showBoard || board[index] !== null || gameEnded) return;

    // This is only for when board is visible (debugging mode)
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    setMoveHistory((prev) => [
      ...prev,
      {
        player: currentPlayer,
        position: index,
        coordinateName: getCoordinateName(index),
        result: "success",
      },
    ]);

    const gameWinner = checkWinner(newBoard);
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
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    setMoveHistory([]);
    setCoordinateInput("");
    setShowBoard(false);
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const toggleBoardVisibility = () => {
    setShowBoard(!showBoard);
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
        <h2 className="text-2xl font-bold">Blind Tic-Tac-Toe</h2>
        <EyeOff className="text-purple-500" size={24} />
      </div>

      {/* Rules */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <EyeOff className="text-purple-600 dark:text-purple-400" size={16} />
          <h3 className="font-semibold text-purple-800 dark:text-purple-300">
            Blind Rules!
          </h3>
        </div>
        <div className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
          <p>• Players cannot see the board - they must rely on memory!</p>
          <p>
            • Call out coordinates like &quot;1,1&quot;, &quot;top-left&quot;,
            &quot;center&quot;, etc.
          </p>
          <p>
            • If you try to play on an occupied position, you&apos;ll be told
            but lose your turn
          </p>
          <p>• Forces mental visualization and memory skills</p>
          <p>• Use the move history to track what&apos;s been played</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Input & History Panel */}
        <div className="lg:col-span-1">
          {/* Coordinate Input */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-4">
            <h4 className="font-semibold mb-4 text-center">Make Your Move</h4>

            <div className="space-y-4">
              {/* Current Player */}
              <div
                className={`p-3 rounded-lg text-center ${
                  currentPlayer === "X"
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}
              >
                <div
                  className={`text-lg font-bold ${
                    currentPlayer === "X"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  Player {currentPlayer}&apos;s Turn
                </div>
              </div>

              {/* Coordinate Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Enter Coordinate:
                </label>
                <input
                  type="text"
                  value={coordinateInput}
                  onChange={(e) => setCoordinateInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleCoordinateSubmit()
                  }
                  placeholder="e.g. 1,1 or top-left"
                  disabled={gameEnded}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 disabled:opacity-50"
                />
                <button
                  onClick={handleCoordinateSubmit}
                  disabled={!coordinateInput.trim() || gameEnded}
                  className={`w-full p-2 rounded-lg font-medium transition-colors ${
                    coordinateInput.trim() && !gameEnded
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Submit Move
                </button>
              </div>

              {/* Board Visibility Toggle */}
              <button
                onClick={toggleBoardVisibility}
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-medium transition-colors ${
                  showBoard
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-slate-600 hover:bg-slate-700 text-white"
                }`}
              >
                {showBoard ? <Eye size={16} /> : <EyeOff size={16} />}
                {showBoard ? "Hide Board" : "Peek at Board"}
              </button>
            </div>
          </div>

          {/* Coordinate Reference */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Map className="text-purple-600 dark:text-purple-400" size={16} />
              <h4 className="font-semibold">Coordinate Reference</h4>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <div className="font-medium mb-1">Grid Format:</div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded">
                    1,1
                  </div>
                  <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded">
                    1,2
                  </div>
                  <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded">
                    1,3
                  </div>
                  <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded">
                    2,1
                  </div>
                  <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded">
                    2,2
                  </div>
                  <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded">
                    2,3
                  </div>
                  <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded">
                    3,1
                  </div>
                  <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded">
                    3,2
                  </div>
                  <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded">
                    3,3
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Name Format:</div>
                <div className="space-y-1">
                  <div>• Top: left, center, right</div>
                  <div>• Middle: left, center, right</div>
                  <div>• Bottom: left, center, right</div>
                  <div>
                    • Or just: &quot;center&quot;, &quot;top&quot;, etc.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Move History */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold mb-3 text-center">Move History</h4>
            <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
              {moveHistory
                .slice(-10)
                .reverse()
                .map((move, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      move.result === "success"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}
                  >
                    <div
                      className={`font-medium ${
                        move.player === "X"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {move.player}: {move.coordinateName}
                    </div>
                    <div
                      className={`${
                        move.result === "success"
                          ? "text-green-700 dark:text-green-400"
                          : "text-red-700 dark:text-red-400"
                      }`}
                    >
                      {move.result === "success"
                        ? `✓ ${getCoordinateName(move.position)}`
                        : "✗ Occupied"}
                    </div>
                  </div>
                ))}
              {moveHistory.length === 0 && (
                <div className="text-center text-slate-500 dark:text-slate-400">
                  No moves yet
                </div>
              )}
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
                  Enter coordinates without looking at the board!
                </div>
              </div>
            )}
          </div>

          {/* Game Board */}
          <div className="flex justify-center mb-6">
            <div className={`relative ${!showBoard ? "filter blur-2xl" : ""}`}>
              <div className="grid grid-cols-3 gap-2 p-4 bg-slate-200 dark:bg-slate-700 rounded-lg">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => showBoard && handleCellClick(index)}
                    className={`w-16 h-16 border-2 rounded text-lg font-bold transition-all flex items-center justify-center relative ${
                      cell
                        ? `${
                            cell === "X"
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                              : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                          } cursor-not-allowed`
                        : showBoard
                        ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                        : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    }`}
                    disabled={cell !== null || gameEnded || !showBoard}
                  >
                    {cell}
                    <div className="absolute top-0 right-0 text-xs text-slate-400 dark:text-slate-500">
                      {getGridCoordinate(index)}
                    </div>
                  </button>
                ))}
              </div>
              {!showBoard && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 text-white px-4 py-2 rounded-lg font-bold">
                    <EyeOff className="inline mr-2" size={20} />
                    Board Hidden
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mental Challenge Info */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2 text-center">
              Mental Challenge Tips
            </h4>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p>
                • <strong>Visualization:</strong> Keep a mental picture of the
                3×3 grid
              </p>
              <p>
                • <strong>Memory Palace:</strong> Associate positions with
                familiar locations
              </p>
              <p>
                • <strong>Pattern Recognition:</strong> Remember opponent&apos;s
                typical strategies
              </p>
              <p>
                • <strong>Coordinate System:</strong> Use either grid numbers or
                position names consistently
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

      {/* Strategy Tips */}
      <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>
          🙈 <strong>Memory Challenge:</strong> Develop spatial memory and
          visualization skills - no peeking allowed!
        </p>
      </div>
    </div>
  );
}
