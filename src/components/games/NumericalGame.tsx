"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw, Trophy, Hash, Calculator } from "lucide-react";

interface NumericalGameProps {
  onBack: () => void;
}

type Cell = number | null;
type Player = "odd" | "even";

export default function NumericalGame({ onBack }: NumericalGameProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("odd");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState({ odd: 0, even: 0, draws: 0 });
  const [usedNumbers, setUsedNumbers] = useState<Set<number>>(new Set());
  const [winningPositions, setWinningPositions] = useState<number[]>([]);
  const [winningSum, setWinningSum] = useState<number | null>(null);

  const oddNumbers = [1, 3, 5, 7, 9];
  const evenNumbers = [2, 4, 6, 8];

  const getAvailableNumbers = (player: Player) => {
    const numbers = player === "odd" ? oddNumbers : evenNumbers;
    return numbers.filter((num) => !usedNumbers.has(num));
  };

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
      if (squares[a] !== null && squares[b] !== null && squares[c] !== null) {
        const sum =
          (squares[a] as number) +
          (squares[b] as number) +
          (squares[c] as number);
        if (sum === 15) {
          setWinningPositions([a, b, c]);
          setWinningSum(sum);

          // Determine winner based on who made the winning move
          const line = [squares[a], squares[b], squares[c]];
          const hasOdd = line.some((num) => num && num % 2 === 1);
          const hasEven = line.some((num) => num && num % 2 === 0);

          if (hasOdd && hasEven) {
            // Mixed line - winner is the current player who just completed it
            return currentPlayer;
          } else if (hasOdd) {
            return "odd";
          } else {
            return "even";
          }
        }
      }
    }
    return null;
  };

  const handleCellClick = (index: number, number: number) => {
    if (board[index] !== null || gameEnded || usedNumbers.has(number)) return;

    const newBoard = [...board];
    newBoard[index] = number;
    setBoard(newBoard);

    const newUsedNumbers = new Set(usedNumbers);
    newUsedNumbers.add(number);
    setUsedNumbers(newUsedNumbers);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      setScores((prev) => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
      return;
    }

    // Check for draw - all numbers used
    if (newUsedNumbers.size === 9) {
      setGameEnded(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    setCurrentPlayer(currentPlayer === "odd" ? "even" : "odd");
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("odd");
    setWinner(null);
    setGameEnded(false);
    setUsedNumbers(new Set());
    setWinningPositions([]);
    setWinningSum(null);
  };

  const resetAll = () => {
    resetGame();
    setScores({ odd: 0, even: 0, draws: 0 });
  };

  const getCellSum = (row: number) => {
    const startIndex = row * 3;
    const rowCells = board.slice(startIndex, startIndex + 3);
    if (rowCells.every((cell) => cell !== null)) {
      return (rowCells as number[]).reduce((sum, num) => sum + num, 0);
    }
    return null;
  };

  const getColumnSum = (col: number) => {
    const columnCells = [board[col], board[col + 3], board[col + 6]];
    if (columnCells.every((cell) => cell !== null)) {
      return (columnCells as number[]).reduce((sum, num) => sum + num, 0);
    }
    return null;
  };

  const getDiagonalSum = (diagonal: "main" | "anti") => {
    const cells =
      diagonal === "main"
        ? [board[0], board[4], board[8]]
        : [board[2], board[4], board[6]];

    if (cells.every((cell) => cell !== null)) {
      return (cells as number[]).reduce((sum, num) => sum + num, 0);
    }
    return null;
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
        <h2 className="text-2xl font-bold">Numerical Tic-Tac-Toe</h2>
        <Hash className="text-purple-500" size={24} />
      </div>

      {/* Rules */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Calculator
            className="text-purple-600 dark:text-purple-400"
            size={16}
          />
          <h3 className="font-semibold text-purple-800 dark:text-purple-300">
            Mathematical Rules!
          </h3>
        </div>
        <div className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
          <p>• Use numbers 1-9, each number can only be used once</p>
          <p>
            • <strong>Odd Player:</strong> Uses 1, 3, 5, 7, 9 (5 numbers)
          </p>
          <p>
            • <strong>Even Player:</strong> Uses 2, 4, 6, 8 (4 numbers)
          </p>
          <p>
            • <strong>Goal:</strong> Get any line (row, column, diagonal) that
            sums to <strong>15</strong>
          </p>
          <p>
            • Based on magic square mathematics - every line in a 3×3 magic
            square sums to 15!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Number Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-4">
            <h4 className="font-semibold mb-4 text-center">
              Available Numbers
            </h4>

            <div className="space-y-4">
              {/* Odd Player Numbers */}
              <div
                className={`p-3 rounded-lg ${
                  currentPlayer === "odd"
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : "bg-slate-50 dark:bg-slate-700 opacity-60"
                }`}
              >
                <div className="text-center mb-2">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    Odd Player {currentPlayer === "odd" ? "(Current)" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {oddNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        gameEnded || currentPlayer !== "odd" ? {} : {}
                      }
                      className={`p-2 rounded text-sm font-bold transition-colors ${
                        usedNumbers.has(num)
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                          : currentPlayer === "odd" && !gameEnded
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 cursor-pointer"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      }`}
                      disabled={
                        usedNumbers.has(num) ||
                        currentPlayer !== "odd" ||
                        gameEnded
                      }
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Even Player Numbers */}
              <div
                className={`p-3 rounded-lg ${
                  currentPlayer === "even"
                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    : "bg-slate-50 dark:bg-slate-700 opacity-60"
                }`}
              >
                <div className="text-center mb-2">
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    Even Player {currentPlayer === "even" ? "(Current)" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {evenNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        gameEnded || currentPlayer !== "even" ? {} : {}
                      }
                      className={`p-2 rounded text-sm font-bold transition-colors ${
                        usedNumbers.has(num)
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                          : currentPlayer === "even" && !gameEnded
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 cursor-pointer"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}
                      disabled={
                        usedNumbers.has(num) ||
                        currentPlayer !== "even" ||
                        gameEnded
                      }
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Line Sums */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold mb-3 text-center">Line Sums</h4>
            <div className="space-y-2 text-sm">
              <div>
                <div className="font-medium mb-1">Rows:</div>
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex justify-between">
                    <span>Row {row + 1}:</span>
                    <span
                      className={`font-medium ${
                        getCellSum(row) === 15
                          ? "text-green-600 dark:text-green-400"
                          : ""
                      }`}
                    >
                      {getCellSum(row) || "-"}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <div className="font-medium mb-1">Columns:</div>
                {[0, 1, 2].map((col) => (
                  <div key={col} className="flex justify-between">
                    <span>Col {col + 1}:</span>
                    <span
                      className={`font-medium ${
                        getColumnSum(col) === 15
                          ? "text-green-600 dark:text-green-400"
                          : ""
                      }`}
                    >
                      {getColumnSum(col) || "-"}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <div className="font-medium mb-1">Diagonals:</div>
                <div className="flex justify-between">
                  <span>Main:</span>
                  <span
                    className={`font-medium ${
                      getDiagonalSum("main") === 15
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }`}
                  >
                    {getDiagonalSum("main") || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Anti:</span>
                  <span
                    className={`font-medium ${
                      getDiagonalSum("anti") === 15
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }`}
                  >
                    {getDiagonalSum("anti") || "-"}
                  </span>
                </div>
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
                      <span
                        className={
                          winner === "odd"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {winner === "odd" ? "Odd" : "Even"} Player
                      </span>{" "}
                      Wins!
                      {winningSum && (
                        <span className="text-purple-600 dark:text-purple-400">
                          {" "}
                          (Sum: {winningSum})
                        </span>
                      )}
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
                      currentPlayer === "odd"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {currentPlayer === "odd" ? "Odd" : "Even"}
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Choose a number, then click a cell. Goal: Sum to 15!
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {!gameEnded && (
            <div className="text-center mb-4 text-sm text-purple-600 dark:text-purple-400">
              Step 1: Select a number from your available set → Step 2: Click an
              empty cell
            </div>
          )}

          {/* Game Board */}
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-3 gap-2 p-4 bg-slate-200 dark:bg-slate-700 rounded-lg">
              {board.map((cell, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => {
                      const availableNumbers =
                        getAvailableNumbers(currentPlayer);
                      if (
                        availableNumbers.length === 1 &&
                        cell === null &&
                        !gameEnded
                      ) {
                        handleCellClick(index, availableNumbers[0]);
                      }
                    }}
                    className={`w-16 h-16 border-2 rounded text-lg font-bold transition-all flex items-center justify-center ${
                      winningPositions.includes(index)
                        ? "border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 shadow-lg"
                        : cell !== null
                        ? `${
                            (cell as number) % 2 === 1
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                              : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                          } cursor-not-allowed`
                        : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500"
                    }`}
                    disabled={cell !== null || gameEnded}
                  >
                    {cell}
                  </button>
                  {/* Click handlers for each available number */}
                  {cell === null &&
                    !gameEnded &&
                    getAvailableNumbers(currentPlayer).map((num) => (
                      <button
                        key={num}
                        onClick={() => handleCellClick(index, num)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={gameEnded}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Number Display */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Hash
                size={16}
                className="text-purple-600 dark:text-purple-400"
              />
              <span className="text-sm font-medium">
                Available:{" "}
                {getAvailableNumbers(currentPlayer).join(", ") || "None"}
              </span>
            </div>
          </div>

          {/* Mathematical Insight */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2 text-center">
              Magic Square Mathematics
            </h4>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p>
                • <strong>Magic Constant:</strong> 15 (sum of any line in a 3×3
                magic square)
              </p>
              <p>
                • <strong>Number Distribution:</strong> Odd player has 5
                numbers, Even player has 4
              </p>
              <p>
                • <strong>Strategic Balance:</strong> Despite unequal counts,
                both players have equal winning chances
              </p>
              <p>
                • <strong>Mathematical Beauty:</strong> Every combination that
                sums to 15 uses both odd and even numbers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ODD
          </div>
          <div className="text-lg font-semibold">{scores.odd}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            1,3,5,7,9
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
            EVEN
          </div>
          <div className="text-lg font-semibold">{scores.even}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            2,4,6,8
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
          # <strong>Math Strategy:</strong> Look for combinations that sum to
          15: 1+5+9, 2+4+9, 2+6+7, 3+4+8, 1+6+8, 4+5+6!
        </p>
      </div>
    </div>
  );
}
