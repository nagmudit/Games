"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Trophy, Zap } from "lucide-react";

interface PowerUpGameProps {
  onBack: () => void;
}

type Cell = "X" | "O" | null;
type Player = "X" | "O";
type PowerUpType = "EXTRA_TURN" | "SWAP_SYMBOLS" | "BLOCK_CELL" | "DOUBLE_MOVE";

interface PowerUpCell {
  content: Cell;
  powerUp: PowerUpType | null;
  isBlocked: boolean;
}

export default function PowerUpGame({ onBack }: PowerUpGameProps) {
  const [board, setBoard] = useState<PowerUpCell[]>(
    Array(9)
      .fill(null)
      .map(() => ({ content: null, powerUp: null, isBlocked: false }))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [activePowerUps, setActivePowerUps] = useState({
    X: { extraTurn: 0, swapSymbols: 0, blockCell: 0, doubleMove: 0 },
    O: { extraTurn: 0, swapSymbols: 0, blockCell: 0, doubleMove: 0 },
  });
  const [doubleMovePending, setDoubleMovePending] = useState(false);
  const [extraTurnActive, setExtraTurnActive] = useState(false);

  // Generate power-ups randomly
  const generatePowerUps = () => {
    const newBoard: PowerUpCell[] = Array(9)
      .fill(null)
      .map(() => ({
        content: null,
        powerUp: null,
        isBlocked: false,
      }));

    // Add 2-3 random power-ups
    const powerUpCount = Math.floor(Math.random() * 2) + 2;
    const powerUpTypes: PowerUpType[] = [
      "EXTRA_TURN",
      "SWAP_SYMBOLS",
      "BLOCK_CELL",
      "DOUBLE_MOVE",
    ];

    for (let i = 0; i < powerUpCount; i++) {
      let position;
      do {
        position = Math.floor(Math.random() * 9);
      } while (newBoard[position].powerUp !== null);

      const randomPowerUp =
        powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      newBoard[position].powerUp = randomPowerUp;
    }

    setBoard(newBoard);
  };

  useEffect(() => {
    generatePowerUps();
  }, []);

  const checkWinner = (squares: PowerUpCell[]) => {
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
        squares[a].content &&
        squares[a].content === squares[b].content &&
        squares[a].content === squares[c].content
      ) {
        return squares[a].content;
      }
    }
    return null;
  };

  const getPowerUpIcon = (powerUp: PowerUpType | null) => {
    switch (powerUp) {
      case "EXTRA_TURN":
        return "⚡";
      case "SWAP_SYMBOLS":
        return "🔄";
      case "BLOCK_CELL":
        return "🛡️";
      case "DOUBLE_MOVE":
        return "⚡⚡";
      default:
        return "";
    }
  };

  const activatePowerUp = (powerUpType: keyof typeof activePowerUps.X) => {
    if (activePowerUps[currentPlayer][powerUpType] <= 0) return false;

    setActivePowerUps((prev) => ({
      ...prev,
      [currentPlayer]: {
        ...prev[currentPlayer],
        [powerUpType]: prev[currentPlayer][powerUpType] - 1,
      },
    }));

    switch (powerUpType) {
      case "extraTurn":
        setExtraTurnActive(true);
        break;
      case "swapSymbols":
        setBoard((prev) =>
          prev.map((cell) => ({
            ...cell,
            content:
              cell.content === "X"
                ? "O"
                : cell.content === "O"
                ? "X"
                : cell.content,
          }))
        );
        break;
      case "doubleMove":
        setDoubleMovePending(true);
        break;
    }

    return true;
  };

  const handleCellClick = (index: number) => {
    if (board[index].content || board[index].isBlocked || gameEnded) return;

    const newBoard = [...board];
    newBoard[index] = {
      ...newBoard[index],
      content: currentPlayer,
    };

    // Handle power-up collection
    const collectedPowerUp = board[index].powerUp;
    if (collectedPowerUp) {
      const powerUpKey =
        collectedPowerUp === "EXTRA_TURN"
          ? "extraTurn"
          : collectedPowerUp === "SWAP_SYMBOLS"
          ? "swapSymbols"
          : collectedPowerUp === "BLOCK_CELL"
          ? "blockCell"
          : "doubleMove";

      setActivePowerUps((prev) => ({
        ...prev,
        [currentPlayer]: {
          ...prev[currentPlayer],
          [powerUpKey]: prev[currentPlayer][powerUpKey] + 1,
        },
      }));
      newBoard[index].powerUp = null;
    }

    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      setScores((prev) => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
      return;
    }

    if (newBoard.every((cell) => cell.content !== null || cell.isBlocked)) {
      setGameEnded(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    // Handle turn switching
    if (doubleMovePending) {
      setDoubleMovePending(false);
      // Don't switch players for double move
    } else if (extraTurnActive) {
      setExtraTurnActive(false);
      // Don't switch players for extra turn
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const handleBlockCell = (index: number) => {
    if (
      activePowerUps[currentPlayer].blockCell <= 0 ||
      board[index].content ||
      board[index].isBlocked
    )
      return;

    activatePowerUp("blockCell");

    const newBoard = [...board];
    newBoard[index] = { ...newBoard[index], isBlocked: true };
    setBoard(newBoard);

    // Block cell doesn't end turn
  };

  const resetGame = () => {
    setBoard(
      Array(9)
        .fill(null)
        .map(() => ({ content: null, powerUp: null, isBlocked: false }))
    );
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    setActivePowerUps({
      X: { extraTurn: 0, swapSymbols: 0, blockCell: 0, doubleMove: 0 },
      O: { extraTurn: 0, swapSymbols: 0, blockCell: 0, doubleMove: 0 },
    });
    setDoubleMovePending(false);
    setExtraTurnActive(false);
    generatePowerUps();
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Tic-Tac-Toe with Power-Ups</h2>
        <Zap className="text-purple-500" size={24} />
      </div>

      {/* Rules */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="text-purple-600 dark:text-purple-400" size={16} />
          <h3 className="font-semibold text-purple-800 dark:text-purple-300">
            Power-Up Rules!
          </h3>
        </div>
        <div className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
          <p>• Collect power-ups by placing your symbol on special cells</p>
          <p>
            • ⚡ <strong>Extra Turn:</strong> Take another turn immediately
          </p>
          <p>
            • 🔄 <strong>Swap Symbols:</strong> All X&apos;s become O&apos;s and
            vice versa
          </p>
          <p>
            • 🛡️ <strong>Block Cell:</strong> Block an empty cell permanently
            (right-click)
          </p>
          <p>
            • ⚡⚡ <strong>Double Move:</strong> Make two moves in a row
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Power-Up Inventory */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold mb-4 text-center">
              Power-Up Inventory
            </h4>

            <div
              className={`p-3 rounded-lg ${
                currentPlayer === "X"
                  ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              <div className="text-center mb-3">
                <span
                  className={`text-lg font-bold ${
                    currentPlayer === "X"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  Player {currentPlayer}
                  {doubleMovePending && " (Double Move)"}
                  {extraTurnActive && " (Extra Turn)"}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => activatePowerUp("extraTurn")}
                  disabled={activePowerUps[currentPlayer].extraTurn <= 0}
                  className="w-full flex items-center justify-between p-2 rounded bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>⚡</span>
                    <span className="text-sm">Extra Turn</span>
                  </span>
                  <span className="text-sm font-bold">
                    {activePowerUps[currentPlayer].extraTurn}
                  </span>
                </button>

                <button
                  onClick={() => activatePowerUp("swapSymbols")}
                  disabled={activePowerUps[currentPlayer].swapSymbols <= 0}
                  className="w-full flex items-center justify-between p-2 rounded bg-cyan-100 dark:bg-cyan-900/30 hover:bg-cyan-200 dark:hover:bg-cyan-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🔄</span>
                    <span className="text-sm">Swap</span>
                  </span>
                  <span className="text-sm font-bold">
                    {activePowerUps[currentPlayer].swapSymbols}
                  </span>
                </button>

                <div className="w-full flex items-center justify-between p-2 rounded bg-orange-100 dark:bg-orange-900/30">
                  <span className="flex items-center gap-2">
                    <span>🛡️</span>
                    <span className="text-sm">Block</span>
                  </span>
                  <span className="text-sm font-bold">
                    {activePowerUps[currentPlayer].blockCell}
                  </span>
                </div>

                <button
                  onClick={() => activatePowerUp("doubleMove")}
                  disabled={
                    activePowerUps[currentPlayer].doubleMove <= 0 ||
                    doubleMovePending
                  }
                  className="w-full flex items-center justify-between p-2 rounded bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>⚡⚡</span>
                    <span className="text-sm">Double</span>
                  </span>
                  <span className="text-sm font-bold">
                    {activePowerUps[currentPlayer].doubleMove}
                  </span>
                </button>
              </div>
            </div>

            {/* Opponent's Power-ups (Read-only display) */}
            <div
              className={`p-3 rounded-lg mt-4 opacity-60 ${
                currentPlayer === "O"
                  ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              <div className="text-center mb-2">
                <span
                  className={`text-sm font-semibold ${
                    currentPlayer === "O"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  Player {currentPlayer === "X" ? "O" : "X"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>
                  ⚡{" "}
                  {activePowerUps[currentPlayer === "X" ? "O" : "X"].extraTurn}
                </div>
                <div>
                  🔄{" "}
                  {
                    activePowerUps[currentPlayer === "X" ? "O" : "X"]
                      .swapSymbols
                  }
                </div>
                <div>
                  🛡️{" "}
                  {activePowerUps[currentPlayer === "X" ? "O" : "X"].blockCell}
                </div>
                <div>
                  ⚡⚡{" "}
                  {activePowerUps[currentPlayer === "X" ? "O" : "X"].doubleMove}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="lg:col-span-2">
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
                {doubleMovePending && (
                  <span className="text-purple-600 dark:text-purple-400">
                    {" "}
                    (Double Move)
                  </span>
                )}
                {extraTurnActive && (
                  <span className="text-yellow-600 dark:text-yellow-400">
                    {" "}
                    (Extra Turn)
                  </span>
                )}
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
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (activePowerUps[currentPlayer].blockCell > 0) {
                      handleBlockCell(index);
                    }
                  }}
                  className={`w-16 h-16 border border-slate-300 dark:border-slate-600 rounded text-lg font-bold transition-all relative ${
                    cell.isBlocked
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : cell.content
                      ? `${
                          cell.content === "X"
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                        } cursor-not-allowed`
                      : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  }`}
                  disabled={
                    cell.content !== null || cell.isBlocked || gameEnded
                  }
                >
                  {cell.isBlocked ? "🚫" : cell.content}
                  {cell.powerUp && !cell.content && !cell.isBlocked && (
                    <span className="absolute top-0 right-0 text-xs bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {getPowerUpIcon(cell.powerUp)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          {activePowerUps[currentPlayer].blockCell > 0 && (
            <div className="text-center text-sm text-orange-600 dark:text-orange-400 mb-4">
              Right-click on an empty cell to block it with 🛡️ Block Cell
              power-up
            </div>
          )}
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
          ⚡ <strong>Power-Up Tip:</strong> Collect power-ups strategically and
          use them at the perfect moment to turn the tide!
        </p>
      </div>
    </div>
  );
}
