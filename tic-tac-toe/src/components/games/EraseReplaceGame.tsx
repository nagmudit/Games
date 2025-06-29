"use client";

import { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface EraseReplaceGameProps {
  onBack: () => void;
}

type Cell = "X" | "O" | null;
type Player = "X" | "O";

export default function EraseReplaceGame({ onBack }: EraseReplaceGameProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [turnCount, setTurnCount] = useState(0);
  const [moveHistory, setMoveHistory] = useState<
    { player: Player; position: number; action: "place" | "erase" }[]
  >([]);
  const [canErase, setCanErase] = useState(false);

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

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
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

  const handleCellClick = (index: number) => {
    if (gameEnded) return;

    const newBoard = [...board];
    const cellOccupied = newBoard[index] !== null;
    const isOpponentPiece = cellOccupied && newBoard[index] !== currentPlayer;

    // If cell is empty, place piece normally
    if (!cellOccupied) {
      newBoard[index] = currentPlayer;
      setMoveHistory((prev) => [
        ...prev,
        { player: currentPlayer, position: index, action: "place" },
      ]);
    }
    // If cell has opponent's piece and erase is allowed (after 3 turns)
    else if (isOpponentPiece && canErase) {
      newBoard[index] = currentPlayer;
      setMoveHistory((prev) => [
        ...prev,
        { player: currentPlayer, position: index, action: "erase" },
      ]);
    }
    // If cell has own piece or erase not allowed, do nothing
    else {
      return;
    }

    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    const newTurnCount = turnCount + 1;

    setTurnCount(newTurnCount);

    // Enable erase capability after 3 turns
    if (newTurnCount >= 3) {
      setCanErase(true);
    }

    if (newWinner) {
      setWinner(newWinner);
      setGameEnded(true);
      setScores((prev) => ({
        ...prev,
        [newWinner]: prev[newWinner] + 1,
      }));
    } else if (newBoard.every((cell) => cell !== null)) {
      setGameEnded(true);
      setScores((prev) => ({
        ...prev,
        draws: prev.draws + 1,
      }));
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    setTurnCount(0);
    setCanErase(false);
    setMoveHistory([]);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  const getCellClassName = (index: number) => {
    const baseClass =
      "w-20 h-20 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-bold text-2xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700";
    const cell = board[index];
    const isOpponentPiece = cell && cell !== currentPlayer;

    if (cell === "X") {
      return `${baseClass} bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ${
        isOpponentPiece && canErase
          ? "hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer ring-2 ring-red-300 dark:ring-red-600"
          : ""
      }`;
    } else if (cell === "O") {
      return `${baseClass} bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 ${
        isOpponentPiece && canErase
          ? "hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer ring-2 ring-red-300 dark:ring-red-600"
          : ""
      }`;
    } else {
      return `${baseClass} bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer`;
    }
  };

  const getButtonText = (index: number) => {
    const cell = board[index];
    if (!cell) return "";

    const isOpponentPiece = cell !== currentPlayer;
    if (isOpponentPiece && canErase) {
      return (
        <div className="relative">
          <span className="opacity-50">{cell}</span>
          <Trash2 size={12} className="absolute -top-1 -right-1 text-red-500" />
        </div>
      );
    }
    return cell;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Menu
        </button>
        <h2 className="text-3xl font-bold text-center">Erase & Replace</h2>
        <div className="w-32" /> {/* Spacer for centering */}
      </div>

      {/* Game Info */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="text-lg">
            <span className="font-semibold">Turn:</span> {turnCount}
          </div>
          {canErase && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
              <Trash2 size={16} />
              <span className="text-sm font-medium">Erase Mode Active</span>
            </div>
          )}
        </div>

        {!gameEnded && (
          <div className="text-xl">
            Current Player:{" "}
            <span
              className={`font-bold ${
                currentPlayer === "X"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {currentPlayer}
            </span>
          </div>
        )}

        {!canErase && turnCount > 0 && (
          <div className="mt-2 flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle size={16} />
            <span className="text-sm">Erase mode unlocks after turn 3</span>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-3 gap-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={getCellClassName(index)}
              disabled={
                gameEnded ||
                (cell !== null && (cell === currentPlayer || !canErase))
              }
            >
              {getButtonText(index)}
            </button>
          ))}
        </div>
      </div>

      {/* Game Status */}
      {gameEnded && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg shadow-lg">
            <Trophy size={24} />
            <span className="text-xl font-bold">
              {winner ? `Player ${winner} Wins!` : "It's a Draw!"}
            </span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw size={20} />
          New Game
        </button>
        <button
          onClick={resetScores}
          className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          Reset Scores
        </button>
      </div>

      {/* Scoreboard */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
        <h3 className="text-xl font-bold text-center mb-4">Scoreboard</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {scores.X}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Player X
            </div>
          </div>
          <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
              {scores.draws}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Draws
            </div>
          </div>
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {scores.O}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Player O
            </div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-3">Erase & Replace Rules</h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>• Place your mark in empty cells normally</li>
          <li>
            • After turn 3, you can erase opponent&apos;s marks by clicking on
            them
          </li>
          <li>• Erasing replaces the opponent&apos;s mark with your own</li>
          <li>• You cannot erase your own marks</li>
          <li>• Get 3 in a row to win!</li>
        </ul>

        {moveHistory.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Move History</h4>
            <div className="max-h-24 overflow-y-auto space-y-1">
              {moveHistory.slice(-6).map((move, index) => (
                <div key={index} className="text-xs flex items-center gap-2">
                  <span
                    className={
                      move.player === "X"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {move.player}
                  </span>
                  <span>
                    {move.action === "erase"
                      ? "erased & replaced"
                      : "placed at"}{" "}
                    position {move.position + 1}
                  </span>
                  {move.action === "erase" && (
                    <Trash2 size={10} className="text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
