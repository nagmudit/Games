"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw, Trophy, Layers, Eye } from "lucide-react";

interface ThreeDGameProps {
  onBack: () => void;
}

type Player = "X" | "O" | null;

export default function ThreeDGame({ onBack }: ThreeDGameProps) {
  const size = 4; // 4x4x4 cube
  const [board, setBoard] = useState<Player[][][]>(
    Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => Array(size).fill(null))
      )
  );
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);
  const [currentLayer, setCurrentLayer] = useState(0);

  const checkWinner = (board3d: Player[][][]) => {
    const n = size;

    // Check each layer separately (2D wins)
    for (let layer = 0; layer < n; layer++) {
      // Rows in layer
      for (let row = 0; row < n; row++) {
        for (let col = 0; col <= n - 4; col++) {
          const player = board3d[layer][row][col];
          if (
            player &&
            board3d[layer][row][col + 1] === player &&
            board3d[layer][row][col + 2] === player &&
            board3d[layer][row][col + 3] === player
          ) {
            return player;
          }
        }
      }

      // Columns in layer
      for (let col = 0; col < n; col++) {
        for (let row = 0; row <= n - 4; row++) {
          const player = board3d[layer][row][col];
          if (
            player &&
            board3d[layer][row + 1][col] === player &&
            board3d[layer][row + 2][col] === player &&
            board3d[layer][row + 3][col] === player
          ) {
            return player;
          }
        }
      }

      // Diagonals in layer
      for (let row = 0; row <= n - 4; row++) {
        for (let col = 0; col <= n - 4; col++) {
          const player = board3d[layer][row][col];
          if (
            player &&
            board3d[layer][row + 1][col + 1] === player &&
            board3d[layer][row + 2][col + 2] === player &&
            board3d[layer][row + 3][col + 3] === player
          ) {
            return player;
          }
        }
      }

      for (let row = 0; row <= n - 4; row++) {
        for (let col = 3; col < n; col++) {
          const player = board3d[layer][row][col];
          if (
            player &&
            board3d[layer][row + 1][col - 1] === player &&
            board3d[layer][row + 2][col - 2] === player &&
            board3d[layer][row + 3][col - 3] === player
          ) {
            return player;
          }
        }
      }
    }

    // Check vertical (through layers)
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        const player = board3d[0][row][col];
        if (
          player &&
          board3d[1][row][col] === player &&
          board3d[2][row][col] === player &&
          board3d[3][row][col] === player
        ) {
          return player;
        }
      }
    }

    // Check 3D diagonals
    // Main 3D diagonal
    const player1 = board3d[0][0][0];
    if (
      player1 &&
      board3d[1][1][1] === player1 &&
      board3d[2][2][2] === player1 &&
      board3d[3][3][3] === player1
    ) {
      return player1;
    }

    const player2 = board3d[0][0][3];
    if (
      player2 &&
      board3d[1][1][2] === player2 &&
      board3d[2][2][1] === player2 &&
      board3d[3][3][0] === player2
    ) {
      return player2;
    }

    const player3 = board3d[0][3][0];
    if (
      player3 &&
      board3d[1][2][1] === player3 &&
      board3d[2][1][2] === player3 &&
      board3d[3][0][3] === player3
    ) {
      return player3;
    }

    const player4 = board3d[0][3][3];
    if (
      player4 &&
      board3d[1][2][2] === player4 &&
      board3d[2][1][1] === player4 &&
      board3d[3][0][0] === player4
    ) {
      return player4;
    }

    return null;
  };

  const handleCellClick = (layer: number, row: number, col: number) => {
    if (board[layer][row][col] || gameEnded) return;

    const newBoard = board.map((l, lIdx) =>
      l.map((r, rIdx) =>
        r.map((c, cIdx) =>
          lIdx === layer && rIdx === row && cIdx === col ? currentPlayer : c
        )
      )
    );

    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      if (gameWinner === "X") setScoreX(scoreX + 1);
      else setScoreO(scoreO + 1);
    } else if (
      newBoard.every((layer) =>
        layer.every((row) => row.every((cell) => cell !== null))
      )
    ) {
      setGameEnded(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(
      Array(size)
        .fill(null)
        .map(() =>
          Array(size)
            .fill(null)
            .map(() => Array(size).fill(null))
        )
    );
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
  };

  const resetAll = () => {
    resetGame();
    setScoreX(0);
    setScoreO(0);
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
        <h2 className="text-2xl font-bold">3D Tic-Tac-Toe (4x4x4)</h2>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              X
            </div>
            <div className="text-lg font-semibold">{scoreX}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Player 1
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              O
            </div>
            <div className="text-lg font-semibold">{scoreO}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Player 2
            </div>
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
                  Player {winner} Wins!
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

      {/* Layer Selector */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Eye size={20} className="text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium">Viewing Layer:</span>
        </div>
        <div className="flex gap-2">
          {Array(size)
            .fill(null)
            .map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentLayer(idx)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  currentLayer === idx
                    ? "bg-blue-600 dark:bg-emerald-600 text-white border-blue-600 dark:border-emerald-600"
                    : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
              >
                {idx + 1}
              </button>
            ))}
        </div>
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} className="text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium">
              Layer {currentLayer + 1}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 bg-slate-200 dark:bg-slate-700 p-2 rounded">
            {board[currentLayer].map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  onClick={() => handleCellClick(currentLayer, rowIdx, colIdx)}
                  className="w-12 h-12 bg-white dark:bg-slate-800 rounded text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:cursor-not-allowed"
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* All Layers Overview */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-center">
          All Layers Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {board.map((layer, layerIdx) => (
            <div
              key={layerIdx}
              className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
            >
              <div className="text-center text-sm font-medium mb-2">
                Layer {layerIdx + 1}
              </div>
              <div className="grid grid-cols-4 gap-0.5">
                {layer.map((row, rowIdx) =>
                  row.map((cell, colIdx) => (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className="w-4 h-4 bg-slate-100 dark:bg-slate-700 rounded-sm text-xs flex items-center justify-center"
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
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
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
          Reset Score
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>
          Get 4 in a row in any direction: horizontal, vertical, diagonal, or
          through layers!
        </p>
      </div>
    </div>
  );
}
