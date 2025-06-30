"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw, Trophy, RotateCw, Clock } from "lucide-react";

interface MoveRotationGameProps {
  onBack: () => void;
}

type Cell = "X" | "O" | null;
type Player = "X" | "O";

interface MoveRecord {
  position: number;
  player: Player;
  timestamp: number;
  moveNumber: number;
}

interface CellWithAge {
  content: Cell;
  age: number; // How many moves ago this was placed (0 = most recent)
  moveNumber: number; // The absolute move number
}

export default function MoveRotationGame({ onBack }: MoveRotationGameProps) {
  const [board, setBoard] = useState<CellWithAge[]>(
    Array(9)
      .fill(null)
      .map(() => ({ content: null, age: 0, moveNumber: 0 }))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [maxMoves, setMaxMoves] = useState(3); // Default: 3 active moves per player
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [globalMoveCounter, setGlobalMoveCounter] = useState(0);
  const [removedMoves, setRemovedMoves] = useState<{
    [key: string]: MoveRecord[];
  }>({
    X: [],
    O: [],
  });

  const checkWinner = (squares: CellWithAge[]) => {
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

  const getPlayerMoves = (player: Player) => {
    return moveHistory.filter((move) => move.player === player);
  };

  const handleCellClick = (index: number) => {
    if (board[index].content || gameEnded) return;

    const newGlobalMoveCounter = globalMoveCounter + 1;
    const playerMoves = getPlayerMoves(currentPlayer);

    // Create new move record
    const newMove: MoveRecord = {
      position: index,
      player: currentPlayer,
      timestamp: Date.now(),
      moveNumber: newGlobalMoveCounter,
    };

    let newBoard = [...board];
    let newMoveHistory = [...moveHistory, newMove];
    const newRemovedMoves = { ...removedMoves };

    // Place the new move
    newBoard[index] = {
      content: currentPlayer,
      age: 0,
      moveNumber: newGlobalMoveCounter,
    };

    // Check if player has exceeded max moves
    if (playerMoves.length >= maxMoves) {
      // Find the oldest move for this player
      const oldestMove = playerMoves.reduce((oldest, move) =>
        move.moveNumber < oldest.moveNumber ? move : oldest
      );

      // Remove the oldest move from the board
      newBoard[oldestMove.position] = {
        content: null,
        age: 0,
        moveNumber: 0,
      };

      // Remove from move history
      newMoveHistory = newMoveHistory.filter(
        (move) => move.moveNumber !== oldestMove.moveNumber
      );

      // Add to removed moves for display
      newRemovedMoves[currentPlayer].push(oldestMove);
      if (newRemovedMoves[currentPlayer].length > 3) {
        newRemovedMoves[currentPlayer] =
          newRemovedMoves[currentPlayer].slice(-3);
      }
    }

    // Update ages for all moves
    newBoard = newBoard.map((cell) => {
      if (cell.content) {
        const moveAge = newGlobalMoveCounter - cell.moveNumber;
        return { ...cell, age: moveAge };
      }
      return cell;
    });

    setBoard(newBoard);
    setMoveHistory(newMoveHistory);
    setGlobalMoveCounter(newGlobalMoveCounter);
    setRemovedMoves(newRemovedMoves);

    // Check for winner
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      setScores((prev) => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
      return;
    }

    // Check for draw (very rare in this variant, but possible)
    const activeCells = newBoard.filter((cell) => cell.content !== null).length;
    if (activeCells === 9) {
      setGameEnded(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    // Switch players
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const resetGame = () => {
    setBoard(
      Array(9)
        .fill(null)
        .map(() => ({ content: null, age: 0, moveNumber: 0 }))
    );
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    setMoveHistory([]);
    setGlobalMoveCounter(0);
    setRemovedMoves({ X: [], O: [] });
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const getCellOpacity = (cell: CellWithAge) => {
    if (!cell.content) return 1;
    const maxAge = Math.max(
      ...board.filter((c) => c.content === cell.content).map((c) => c.age)
    );
    if (maxAge === 0) return 1;
    return Math.max(0.4, 1 - (cell.age / (maxAge + 1)) * 0.6);
  };

  const getCellStyle = (cell: CellWithAge) => {
    const opacity = getCellOpacity(cell);
    return { opacity };
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
        <h2 className="text-2xl font-bold">Tic-Tac-Toe with Move Rotation</h2>
        <RotateCw className="text-cyan-500" size={24} />
      </div>

      {/* Rules */}
      <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <RotateCw className="text-cyan-600 dark:text-cyan-400" size={16} />
          <h3 className="font-semibold text-cyan-800 dark:text-cyan-300">
            Move Rotation Rules!
          </h3>
        </div>
        <div className="text-sm text-cyan-700 dark:text-cyan-400 space-y-1">
          <p>
            • Each player can only have <strong>{maxMoves} active moves</strong>{" "}
            on the board
          </p>
          <p>
            • When you exceed {maxMoves} moves, your{" "}
            <strong>oldest move disappears</strong>
          </p>
          <p>• Older moves appear more faded to show their age</p>
          <p>
            • Win by getting 3 in a row, but watch out - your winning line might
            rotate away!
          </p>
          <p>
            • This variant rarely ends in draws since the board constantly
            changes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Game Controls */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-4">
            <h4 className="font-semibold mb-4 text-center">Game Settings</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Active Moves per Player
                </label>
                <select
                  value={maxMoves}
                  onChange={(e) => setMaxMoves(Number(e.target.value))}
                  disabled={globalMoveCounter > 0}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 disabled:opacity-50"
                >
                  <option value={3}>3 moves (Classic)</option>
                  <option value={4}>4 moves (Extended)</option>
                  <option value={2}>2 moves (Extreme)</option>
                </select>
              </div>

              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                {globalMoveCounter > 0 && "Settings locked during game"}
              </div>
            </div>
          </div>

          {/* Move History */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold mb-4 text-center">Active Moves</h4>

            <div className="space-y-4">
              {/* Player X Active Moves */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="text-center text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  Player X ({getPlayerMoves("X").length}/{maxMoves})
                </div>
                <div className="text-xs space-y-1">
                  {getPlayerMoves("X").map((move) => (
                    <div key={move.moveNumber} className="flex justify-between">
                      <span>Position {move.position + 1}</span>
                      <span>Move #{move.moveNumber}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Player O Active Moves */}
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="text-center text-red-600 dark:text-red-400 font-semibold mb-2">
                  Player O ({getPlayerMoves("O").length}/{maxMoves})
                </div>
                <div className="text-xs space-y-1">
                  {getPlayerMoves("O").map((move) => (
                    <div key={move.moveNumber} className="flex justify-between">
                      <span>Position {move.position + 1}</span>
                      <span>Move #{move.moveNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recently Removed Moves */}
            {(removedMoves.X.length > 0 || removedMoves.O.length > 0) && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="text-center text-sm font-medium mb-2 text-slate-600 dark:text-slate-400">
                  Recently Rotated Out
                </div>
                {removedMoves.X.length > 0 && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                    X:{" "}
                    {removedMoves.X.slice(-2)
                      .map((m) => `Pos ${m.position + 1}`)
                      .join(", ")}
                  </div>
                )}
                {removedMoves.O.length > 0 && (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    O:{" "}
                    {removedMoves.O.slice(-2)
                      .map((m) => `Pos ${m.position + 1}`)
                      .join(", ")}
                  </div>
                )}
              </div>
            )}
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
                  Total Moves: {globalMoveCounter}
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
                  style={getCellStyle(cell)}
                  className={`w-16 h-16 border border-slate-300 dark:border-slate-600 rounded text-lg font-bold transition-all relative ${
                    cell.content
                      ? `${
                          cell.content === "X"
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                        } cursor-not-allowed`
                      : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  }`}
                  disabled={cell.content !== null || gameEnded}
                >
                  {cell.content}
                  {cell.content && cell.age > 0 && (
                    <div className="absolute top-0 right-0 text-xs bg-gray-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                      {cell.age}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="text-center text-sm text-slate-600 dark:text-slate-400 mb-4">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>Numbers show move age</span>
              </div>
              <div>Faded = older moves</div>
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
          ♻️ <strong>Strategy Tip:</strong> Think ahead! A winning position
          might rotate away, but you can also break opponent&apos;s winning
          lines by forcing rotations.
        </p>
      </div>
    </div>
  );
}
