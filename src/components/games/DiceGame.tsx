"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  RefreshCw,
} from "lucide-react";

interface DiceGameProps {
  onBack: () => void;
}

type Cell = "X" | "O" | null;
type Player = "X" | "O";

export default function DiceGame({ onBack }: DiceGameProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [currentDiceRoll, setCurrentDiceRoll] = useState<number | null>(null);
  const [allowedPosition, setAllowedPosition] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState<
    {
      player: Player;
      roll: number;
      position: number;
      result: "played" | "occupied" | "rerolled";
    }[]
  >([]);
  const [rerollsLeft, setRerollsLeft] = useState(2); // Allow 2 rerolls per turn
  const [mustRoll, setMustRoll] = useState(true);

  const getDiceIcon = (number: number) => {
    switch (number) {
      case 1:
        return Dice1;
      case 2:
        return Dice2;
      case 3:
        return Dice3;
      case 4:
        return Dice4;
      case 5:
        return Dice5;
      case 6:
        return Dice6;
      default:
        return Dice1;
    }
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

  const rollDice = () => {
    if (isRolling || gameEnded) return;

    setIsRolling(true);
    setMustRoll(false);

    // Simulate dice rolling animation
    setTimeout(() => {
      // Roll 1-9 for 3x3 board positions
      const finalRoll = Math.floor(Math.random() * 9) + 1;
      const finalPosition = finalRoll - 1;

      setCurrentDiceRoll(finalRoll);
      setAllowedPosition(finalPosition);
      setIsRolling(false);

      // Check if position is occupied
      if (board[finalPosition] !== null) {
        setRollHistory((prev) => [
          ...prev,
          {
            player: currentPlayer,
            roll: finalRoll,
            position: finalPosition,
            result: "occupied",
          },
        ]);
      }
    }, 1000);
  };

  const handleCellClick = (index: number) => {
    if (
      gameEnded ||
      mustRoll ||
      allowedPosition !== index ||
      board[index] !== null
    )
      return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    setRollHistory((prev) => [
      ...prev,
      {
        player: currentPlayer,
        roll: currentDiceRoll!,
        position: index,
        result: "played",
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

    // Reset for next player
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    setCurrentDiceRoll(null);
    setAllowedPosition(null);
    setRerollsLeft(2);
    setMustRoll(true);
  };

  const reroll = () => {
    if (rerollsLeft <= 0 || isRolling || gameEnded) return;

    setRerollsLeft(rerollsLeft - 1);
    setRollHistory((prev) => [
      ...prev,
      {
        player: currentPlayer,
        roll: currentDiceRoll!,
        position: allowedPosition!,
        result: "rerolled",
      },
    ]);
    setCurrentDiceRoll(null);
    setAllowedPosition(null);
    setMustRoll(true);
  };

  const skipTurn = () => {
    if (mustRoll || gameEnded) return;

    // Skip turn and move to next player
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    setCurrentDiceRoll(null);
    setAllowedPosition(null);
    setRerollsLeft(2);
    setMustRoll(true);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    setCurrentDiceRoll(null);
    setAllowedPosition(null);
    setRerollsLeft(2);
    setMustRoll(true);
    setRollHistory([]);
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const getPositionName = (pos: number) => {
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
    return names[pos];
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
        <h2 className="text-2xl font-bold">Tic-Tac-Toe with Dice</h2>
        <Dice3 className="text-green-500" size={24} />
      </div>

      {/* Rules */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Dice3 className="text-green-600 dark:text-green-400" size={16} />
          <h3 className="font-semibold text-green-800 dark:text-green-300">
            Dice Rules!
          </h3>
        </div>
        <div className="text-sm text-green-700 dark:text-green-400 space-y-1">
          <p>• Roll the dice to determine which position you can play</p>
          <p>
            • Numbers 1-9 correspond to board positions (top-left to
            bottom-right)
          </p>
          <p>
            • If your rolled position is occupied, you can reroll (2 rerolls
            max) or skip turn
          </p>
          <p>• Adds an element of luck while keeping strategy important!</p>
          <p>• Perfect for kids and casual players who want some randomness</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Dice Control Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-4">
            <h4 className="font-semibold mb-4 text-center">Dice Control</h4>

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

              {/* Dice Display */}
              <div className="text-center">
                {currentDiceRoll ? (
                  <div className="space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg">
                      {React.createElement(getDiceIcon(currentDiceRoll), {
                        size: 32,
                        className: "text-green-600 dark:text-green-400",
                      })}
                    </div>
                    <div className="text-sm font-medium">
                      Position: {getPositionName(allowedPosition!)}
                    </div>
                    {board[allowedPosition!] !== null && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        Position occupied!
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                    <Dice3 size={32} className="text-slate-400" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={rollDice}
                  disabled={!mustRoll || isRolling || gameEnded}
                  className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${
                    mustRoll && !isRolling && !gameEnded
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isRolling ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Rolling...
                    </>
                  ) : (
                    <>
                      <Dice3 size={16} />
                      Roll Dice
                    </>
                  )}
                </button>

                {currentDiceRoll && board[allowedPosition!] !== null && (
                  <div className="space-y-1">
                    <button
                      onClick={reroll}
                      disabled={rerollsLeft <= 0 || isRolling || gameEnded}
                      className={`w-full p-2 rounded text-sm font-medium transition-colors ${
                        rerollsLeft > 0 && !isRolling && !gameEnded
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Reroll ({rerollsLeft} left)
                    </button>
                    <button
                      onClick={skipTurn}
                      disabled={mustRoll || gameEnded}
                      className="w-full p-2 rounded text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                    >
                      Skip Turn
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Roll History */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold mb-3 text-center">Recent Rolls</h4>
            <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
              {rollHistory
                .slice(-8)
                .reverse()
                .map((entry, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      entry.result === "played"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : entry.result === "occupied"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-yellow-100 dark:bg-yellow-900/30"
                    }`}
                  >
                    <div
                      className={`font-medium ${
                        entry.player === "X"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {entry.player}: {entry.roll} →{" "}
                      {getPositionName(entry.position)}
                    </div>
                    <div
                      className={`${
                        entry.result === "played"
                          ? "text-green-700 dark:text-green-400"
                          : entry.result === "occupied"
                          ? "text-red-700 dark:text-red-400"
                          : "text-yellow-700 dark:text-yellow-400"
                      }`}
                    >
                      {entry.result === "played"
                        ? "Played"
                        : entry.result === "occupied"
                        ? "Occupied"
                        : "Rerolled"}
                    </div>
                  </div>
                ))}
              {rollHistory.length === 0 && (
                <div className="text-center text-slate-500 dark:text-slate-400">
                  No rolls yet
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
                  {mustRoll
                    ? "Roll the dice to see where you can play!"
                    : board[allowedPosition!] !== null
                    ? "Position occupied - reroll or skip turn"
                    : "Click on the highlighted position to play"}
                </div>
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
                  className={`w-16 h-16 border-2 rounded text-lg font-bold transition-all flex items-center justify-center relative ${
                    allowedPosition === index && !mustRoll && cell === null
                      ? "border-green-400 bg-green-100 dark:bg-green-900/30 shadow-lg cursor-pointer animate-pulse"
                      : cell
                      ? `${
                          cell === "X"
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                            : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                        } cursor-not-allowed`
                      : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 cursor-not-allowed opacity-60"
                  }`}
                  disabled={
                    allowedPosition !== index ||
                    cell !== null ||
                    gameEnded ||
                    mustRoll
                  }
                >
                  {cell}
                  <div className="absolute top-0 right-0 text-xs text-slate-400 dark:text-slate-500">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Position Guide */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2 text-center">Position Guide</h4>
            <div className="grid grid-cols-3 gap-2 text-sm text-center">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="p-2 bg-white dark:bg-slate-700 rounded">
                  <div className="font-bold">{i + 1}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {getPositionName(i)}
                  </div>
                </div>
              ))}
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
          🎲 <strong>Luck & Strategy:</strong> Plan for multiple scenarios since
          you can&apos;t control where you&apos;ll play next!
        </p>
      </div>
    </div>
  );
}
