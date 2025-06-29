"use client";

import { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Users,
  Crown,
  AlertCircle,
} from "lucide-react";

interface ThreePlayerGameProps {
  onBack: () => void;
}

type Player = "X" | "O" | "Δ" | null;
type PlayerName = "Player1" | "Player2" | "Player3";

export default function ThreePlayerGame({ onBack }: ThreePlayerGameProps) {
  const [board, setBoard] = useState<Player[]>(Array(25).fill(null)); // 5x5 grid
  const [currentPlayer, setCurrentPlayer] = useState<PlayerName>("Player1");
  const [winner, setWinner] = useState<PlayerName | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState({
    Player1: 0,
    Player2: 0,
    Player3: 0,
  });
  const [turnOrder, setTurnOrder] = useState<PlayerName[]>([
    "Player1",
    "Player2",
    "Player3",
  ]);

  const playerSymbols: Record<PlayerName, Player> = {
    Player1: "X",
    Player2: "O",
    Player3: "Δ",
  };

  const playerColors = {
    Player1: "text-blue-600 dark:text-blue-400",
    Player2: "text-red-600 dark:text-red-400",
    Player3: "text-green-600 dark:text-green-400",
  };

  const playerBgColors = {
    Player1:
      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    Player2: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    Player3:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  };

  // Check for 4 in a row (since it's 5x5, we need 4 to win)
  const checkWinner = (squares: Player[]) => {
    const size = 5;
    const winLength = 4;

    // Check rows
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - winLength; col++) {
        const start = row * size + col;
        const player = squares[start];
        if (player) {
          let count = 0;
          for (let i = 0; i < winLength; i++) {
            if (squares[start + i] === player) count++;
            else break;
          }
          if (count === winLength) {
            return Object.keys(playerSymbols).find(
              (p) => playerSymbols[p as PlayerName] === player
            ) as PlayerName;
          }
        }
      }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - winLength; row++) {
        const start = row * size + col;
        const player = squares[start];
        if (player) {
          let count = 0;
          for (let i = 0; i < winLength; i++) {
            if (squares[start + i * size] === player) count++;
            else break;
          }
          if (count === winLength) {
            return Object.keys(playerSymbols).find(
              (p) => playerSymbols[p as PlayerName] === player
            ) as PlayerName;
          }
        }
      }
    }

    // Check diagonals (top-left to bottom-right)
    for (let row = 0; row <= size - winLength; row++) {
      for (let col = 0; col <= size - winLength; col++) {
        const start = row * size + col;
        const player = squares[start];
        if (player) {
          let count = 0;
          for (let i = 0; i < winLength; i++) {
            if (squares[start + i * (size + 1)] === player) count++;
            else break;
          }
          if (count === winLength) {
            return Object.keys(playerSymbols).find(
              (p) => playerSymbols[p as PlayerName] === player
            ) as PlayerName;
          }
        }
      }
    }

    // Check diagonals (top-right to bottom-left)
    for (let row = 0; row <= size - winLength; row++) {
      for (let col = winLength - 1; col < size; col++) {
        const start = row * size + col;
        const player = squares[start];
        if (player) {
          let count = 0;
          for (let i = 0; i < winLength; i++) {
            if (squares[start + i * (size - 1)] === player) count++;
            else break;
          }
          if (count === winLength) {
            return Object.keys(playerSymbols).find(
              (p) => playerSymbols[p as PlayerName] === player
            ) as PlayerName;
          }
        }
      }
    }

    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameEnded) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbols[currentPlayer];
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      setScores((prev) => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1,
      }));
    } else if (newBoard.every((cell) => cell !== null)) {
      setGameEnded(true); // Draw
    } else {
      // Move to next player
      const currentIndex = turnOrder.indexOf(currentPlayer);
      const nextPlayer = turnOrder[(currentIndex + 1) % turnOrder.length];
      setCurrentPlayer(nextPlayer);
    }
  };

  const resetGame = () => {
    setBoard(Array(25).fill(null));
    setCurrentPlayer("Player1");
    setWinner(null);
    setGameEnded(false);
  };

  const resetAll = () => {
    resetGame();
    setScores({ Player1: 0, Player2: 0, Player3: 0 });
  };

  const shuffleTurnOrder = () => {
    const shuffled = [...turnOrder].sort(() => Math.random() - 0.5);
    setTurnOrder(shuffled);
    setCurrentPlayer(shuffled[0]);
  };

  const getPlayerRank = () => {
    const sortedPlayers = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([player]) => player as PlayerName);
    return sortedPlayers;
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
        <h2 className="text-2xl font-bold">Three-Player Tic-Tac-Toe</h2>
        <Users className="text-violet-500" size={24} />
      </div>

      {/* Rules Explanation */}
      <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Users className="text-violet-600 dark:text-violet-400" size={16} />
          <h3 className="font-semibold text-violet-800 dark:text-violet-300">
            Three-Player Rules!
          </h3>
        </div>
        <div className="text-sm text-violet-700 dark:text-violet-400 space-y-1">
          <p>• Three players take turns: X (Blue), O (Red), and Δ (Green)</p>
          <p>• Played on a 5x5 grid - get 4 in a row to win!</p>
          <p>• Strategic alliances and blocking are key to victory</p>
          <p>• Turn order can be shuffled for variety</p>
        </div>
      </div>

      {/* Score Board and Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Player Scores */}
        {Object.entries(scores).map(([player, score], index) => {
          const playerName = player as PlayerName;
          const rank = getPlayerRank().indexOf(playerName) + 1;
          const isCurrentPlayer = currentPlayer === playerName;

          return (
            <div
              key={player}
              className={`rounded-lg p-4 border transition-all ${
                isCurrentPlayer && !gameEnded
                  ? `ring-2 ring-violet-500 ${playerBgColors[playerName]}`
                  : `bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700`
              }`}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {rank === 1 && score > 0 && (
                    <Crown className="text-yellow-500" size={16} />
                  )}
                  <div
                    className={`text-2xl font-bold ${playerColors[playerName]}`}
                  >
                    {playerSymbols[playerName]}
                  </div>
                </div>
                <div className="text-lg font-semibold">{score}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {player}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  Rank #{rank}
                </div>
                {isCurrentPlayer && !gameEnded && (
                  <div className="mt-2 text-xs text-violet-600 dark:text-violet-400 font-medium">
                    Current Turn
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Turn Order */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <h4 className="font-semibold mb-2">Turn Order</h4>
            <div className="space-y-1 mb-3">
              {turnOrder.map((player, index) => (
                <div
                  key={player}
                  className="text-sm flex items-center justify-center gap-2"
                >
                  <span className="text-slate-600 dark:text-slate-400">
                    {index + 1}.
                  </span>
                  <span className={playerColors[player]}>
                    {playerSymbols[player]}
                  </span>
                  <span className="text-xs">{player}</span>
                </div>
              ))}
            </div>
            <button
              onClick={shuffleTurnOrder}
              className="text-xs px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
              disabled={!gameEnded && board.some((cell) => cell !== null)}
            >
              Shuffle Order
            </button>
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
                  <span className={playerColors[winner]}>{winner}</span> Wins!
                </span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="text-slate-500" size={20} />
                <span className="text-lg font-semibold">It&apos;s a Draw!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-lg font-semibold">
            Current Player:{" "}
            <span className={playerColors[currentPlayer]}>
              {currentPlayer} ({playerSymbols[currentPlayer]})
            </span>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-5 gap-1 p-4 bg-slate-200 dark:bg-slate-700 rounded-lg max-w-md">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:cursor-not-allowed"
              disabled={cell !== null || gameEnded}
            >
              <span
                className={
                  cell === "X"
                    ? playerColors.Player1
                    : cell === "O"
                    ? playerColors.Player2
                    : cell === "Δ"
                    ? playerColors.Player3
                    : ""
                }
              >
                {cell}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Game Statistics */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-6">
        <h4 className="font-semibold mb-2 text-center">Game Statistics</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium">Total Games</div>
            <div className="text-lg">
              {scores.Player1 + scores.Player2 + scores.Player3}
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium">Leader</div>
            <div className={`text-lg ${playerColors[getPlayerRank()[0]]}`}>
              {scores[getPlayerRank()[0]] > 0 ? getPlayerRank()[0] : "None"}
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium">Moves Made</div>
            <div className="text-lg">
              {board.filter((cell) => cell !== null).length}/25
            </div>
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
          💡 <strong>Strategy Tip:</strong> Watch for opportunities to block
          multiple opponents or form temporary alliances!
        </p>
      </div>
    </div>
  );
}
