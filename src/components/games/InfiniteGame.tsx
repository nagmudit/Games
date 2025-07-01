"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  ZoomIn,
  ZoomOut,
  Move,
  Home,
} from "lucide-react";

interface InfiniteGameProps {
  onBack: () => void;
}

type Player = "X" | "O" | null;

export default function InfiniteGame({ onBack }: InfiniteGameProps) {
  const [board, setBoard] = useState<Map<string, Player>>(new Map());
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);
  const [viewportX, setViewportX] = useState(0);
  const [viewportY, setViewportY] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [wasDragged, setWasDragged] = useState(false);

  const CELL_SIZE = 40;
  const VIEWPORT_SIZE = 15;

  // For position key
  const positionToKey = (x: number, y: number) => `${x},${y}`;

  // Check winner (5 in a row)
  const checkWinner = (
    board: Map<string, Player>,
    lastMove: { x: number; y: number }
  ) => {
    const { x, y } = lastMove;
    const player = board.get(positionToKey(x, y));
    if (!player) return null;

    const directions = [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      // Check positive direction
      for (let i = 1; i < 5; i++) {
        const key = positionToKey(x + dx * i, y + dy * i);
        if (board.get(key) === player) {
          count++;
        } else break;
      }
      // Check negative direction
      for (let i = 1; i < 5; i++) {
        const key = positionToKey(x - dx * i, y - dy * i);
        if (board.get(key) === player) {
          count++;
        } else break;
      }
      if (count >= 5) return player;
    }
    return null;
  };

  // Handle cell click
  const handleCellClick = (x: number, y: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (wasDragged) {
      setWasDragged(false);
      return;
    }

    if (board.get(positionToKey(x, y)) || gameEnded) return;

    const newBoard = new Map(board);
    newBoard.set(positionToKey(x, y), currentPlayer);
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard, { x, y });
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      if (gameWinner === "X") setScoreX(scoreX + 1);
      else setScoreO(scoreO + 1);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  // Resets
  const resetGame = () => {
    setBoard(new Map());
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
  };

  const resetAll = () => {
    resetGame();
    setScoreX(0);
    setScoreO(0);
    setViewportX(0);
    setViewportY(0);
    setZoom(1);
  };

  // Panning logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setWasDragged(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      setViewportX((prev) => prev - deltaX / (CELL_SIZE * zoom));
      setViewportY((prev) => prev - deltaY / (CELL_SIZE * zoom));
      setDragStart({ x: e.clientX, y: e.clientY });
      setWasDragged(true);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Global drag listeners for smooth panning
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        setViewportX((prev) => prev - deltaX / (CELL_SIZE * zoom));
        setViewportY((prev) => prev - deltaY / (CELL_SIZE * zoom));
        setDragStart({ x: e.clientX, y: e.clientY });
        setWasDragged(true);
      }
    };
    const handleGlobalMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, zoom]);

  // Center the grid
  const centerView = () => {
    setViewportX(0);
    setViewportY(0);
  };

  // Render grid
  const renderGrid = () => {
    const cells = [];
    // Render extra border for panning safety
    const startX = Math.floor(viewportX - VIEWPORT_SIZE / 2) - 1;
    const endX = Math.ceil(viewportX + VIEWPORT_SIZE / 2) + 1;
    const startY = Math.floor(viewportY - VIEWPORT_SIZE / 2) - 1;
    const endY = Math.ceil(viewportY + VIEWPORT_SIZE / 2) + 1;

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const key = positionToKey(x, y);
        const cell = board.get(key);
        // Position relative to center
        const relativeX = x - viewportX;
        const relativeY = y - viewportY;

        const left =
          relativeX * CELL_SIZE * zoom + (VIEWPORT_SIZE * CELL_SIZE * zoom) / 2;
        const top =
          relativeY * CELL_SIZE * zoom + (VIEWPORT_SIZE * CELL_SIZE * zoom) / 2;

        // Only render visible
        if (
          left >= -CELL_SIZE * zoom &&
          left < VIEWPORT_SIZE * CELL_SIZE * zoom &&
          top >= -CELL_SIZE * zoom &&
          top < VIEWPORT_SIZE * CELL_SIZE * zoom
        ) {
          cells.push(
            <button
              key={key}
              onClick={(e) => handleCellClick(x, y, e)}
              disabled={cell !== null || gameEnded}
              className={`border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-sm font-bold ${
                cell !== null || gameEnded
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:border-blue-400"
              }`}
              style={{
                position: "absolute",
                left: left,
                top: top,
                width: CELL_SIZE * zoom,
                height: CELL_SIZE * zoom,
                fontSize: `${Math.max(12, 16 * zoom)}px`,
                pointerEvents: "auto",
                zIndex: 10,
              }}
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
          );
        }
      }
    }
    return cells;
  };

  // Clamp zoom
  const clampZoom = (z: number) => Math.max(0.4, Math.min(2, z));

  // UI
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Infinite Tic-Tac-Toe</h2>
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
              <span className="text-lg font-semibold">Game Over</span>
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

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={() => setZoom((z) => clampZoom(z + 0.2))}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          disabled={zoom >= 2}
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => setZoom((z) => clampZoom(z - 0.2))}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          disabled={zoom <= 0.4}
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={centerView}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Home size={16} />
          Center
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Move size={16} />
          Drag to pan
        </div>
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-6">
        <div
          className="relative bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing select-none"
          style={{
            width: VIEWPORT_SIZE * CELL_SIZE * zoom,
            height: VIEWPORT_SIZE * CELL_SIZE * zoom,
            maxWidth: "90vw",
            maxHeight: "60vh",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          {renderGrid()}
          {/* Center indicator */}
          <div
            className="absolute w-1 h-1 bg-red-500 rounded-full pointer-events-none"
            style={{
              left: (VIEWPORT_SIZE * CELL_SIZE * zoom) / 2 - 2,
              top: (VIEWPORT_SIZE * CELL_SIZE * zoom) / 2 - 2,
              zIndex: 5,
            }}
          />
        </div>
      </div>

      {/* Game Controls */}
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

      {/* Instructions */}
      <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>
          Get 5 in a row in any direction to win! Drag to explore the infinite
          grid.
        </p>
      </div>
    </div>
  );
}
