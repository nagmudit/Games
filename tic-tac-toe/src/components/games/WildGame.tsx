"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw, Trophy, Shuffle, X, Circle } from "lucide-react";

interface WildGameProps {
  onBack: () => void;
}

type Player = "X" | "O" | null;

export default function WildGame({ onBack }: WildGameProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"Player1" | "Player2">(
    "Player1"
  );
  const [selectedSymbol, setSelectedSymbol] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"Player1" | "Player2" | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scorePlayer1, setScorePlayer1] = useState(0);
  const [scorePlayer2, setScorePlayer2] = useState(0);
  const [moveHistory, setMoveHistory] = useState<
    Array<{
      player: "Player1" | "Player2";
      symbol: "X" | "O";
      position: number;
    }>
  >([]);

  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  const checkWinner = (squares: Player[]) => {
    for (const line of winningLines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        // Find which player made the winning line by checking the last few moves
        const winningSymbol = squares[a];

        // Check who placed the most recent winning symbols
        const recentMoves = moveHistory.slice(-9); // Last 9 moves should be enough
        const winningPositions = [a, b, c];
        const movesInWinningLine = recentMoves.filter(
          (move) =>
            winningPositions.includes(move.position) &&
            move.symbol === winningSymbol
        );

        if (movesInWinningLine.length > 0) {
          // The winner is the player who made the last move in the winning line
          const lastMoveInLine =
            movesInWinningLine[movesInWinningLine.length - 1];
          return lastMoveInLine.player;
        }

        // Fallback: if we can't determine from history, use current player
        return currentPlayer === "Player1" ? "Player2" : "Player1";
      }
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameEnded) return;

    const newBoard = [...board];
    newBoard[index] = selectedSymbol;
    setBoard(newBoard);

    const newMoveHistory = [
      ...moveHistory,
      {
        player: currentPlayer,
        symbol: selectedSymbol,
        position: index,
      },
    ];
    setMoveHistory(newMoveHistory);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      if (gameWinner === "Player1") setScorePlayer1(scorePlayer1 + 1);
      else setScorePlayer2(scorePlayer2 + 1);
    } else if (newBoard.every((cell) => cell !== null)) {
      setGameEnded(true);
    } else {
      setCurrentPlayer(currentPlayer === "Player1" ? "Player2" : "Player1");
      // Reset selected symbol for next player
      setSelectedSymbol("X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("Player1");
    setSelectedSymbol("X");
    setWinner(null);
    setGameEnded(false);
    setMoveHistory([]);
  };

  const resetAll = () => {
    resetGame();
    setScorePlayer1(0);
    setScorePlayer2(0);
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
        <h2 className="text-2xl font-bold">Wild Tic-Tac-Toe</h2>
        <Shuffle className="text-purple-500" size={24} />
      </div>

      {/* Rules Explanation */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shuffle className="text-purple-600 dark:text-purple-400" size={16} />
          <h3 className="font-semibold text-purple-800 dark:text-purple-300">
            Wild Rules!
          </h3>
        </div>
        <p className="text-sm text-purple-700 dark:text-purple-400">
          Choose X or O on each turn! Strategic bluffing and adaptability are
          key to victory.
        </p>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Player 1
            </div>
            <div className="text-lg font-semibold">{scorePlayer1}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Wins
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              Player 2
            </div>
            <div className="text-lg font-semibold">{scorePlayer2}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Wins
            </div>
          </div>
        </div>
      </div>

      {/* Game Status and Symbol Selection */}
      {!gameEnded && (
        <div className="text-center mb-6">
          <div className="text-lg font-semibold mb-4">
            <span
              className={
                currentPlayer === "Player1"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-red-600 dark:text-red-400"
              }
            >
              {currentPlayer}&apos;s Turn
            </span>
          </div>

          <div className="flex justify-center items-center gap-4">
            <span className="text-sm font-medium">Choose your symbol:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedSymbol("X")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedSymbol === "X"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-slate-300 dark:border-slate-600 hover:border-slate-400"
                }`}
              >
                <X
                  size={20}
                  className={
                    selectedSymbol === "X"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400"
                  }
                />
              </button>
              <button
                onClick={() => setSelectedSymbol("O")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedSymbol === "O"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                    : "border-slate-300 dark:border-slate-600 hover:border-slate-400"
                }`}
              >
                <Circle
                  size={20}
                  className={
                    selectedSymbol === "O"
                      ? "text-red-600 dark:text-red-400"
                      : "text-slate-600 dark:text-slate-400"
                  }
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game End Status */}
      {gameEnded && (
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2">
            {winner ? (
              <>
                <Trophy className="text-yellow-500" size={20} />
                <span className="text-lg font-semibold">{winner} Wins!</span>
              </>
            ) : (
              <span className="text-lg font-semibold">It&apos;s a Draw!</span>
            )}
          </div>
        </div>
      )}

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 mb-6 max-w-sm mx-auto">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            className="aspect-square bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-3xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:cursor-not-allowed"
            disabled={cell !== null || gameEnded}
          >
            <span
              className={
                cell === "X"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-red-600 dark:text-red-400"
              }
            >
              {cell}
            </span>
          </button>
        ))}
      </div>

      {/* Move History */}
      {moveHistory.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-6">
          <h3 className="font-semibold mb-2">Move History</h3>
          <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
            {moveHistory.map((move, index) => (
              <div key={index} className="flex justify-between">
                <span
                  className={
                    move.player === "Player1"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {move.player}
                </span>
                <span>
                  placed {move.symbol} at position {move.position + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
          Reset Score
        </button>
      </div>
    </div>
  );
}
