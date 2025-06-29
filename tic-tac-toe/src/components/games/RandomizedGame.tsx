"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Trophy, Dice6, Shuffle } from "lucide-react";

interface RandomizedGameProps {
  onBack: () => void;
}

type Player = "X" | "O" | null;

export default function RandomizedGame({ onBack }: RandomizedGameProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);
  const [randomMovesCount, setRandomMovesCount] = useState(3);
  const [randomMovesPlaced, setRandomMovesPlaced] = useState(0);
  const [isPlacingRandomMoves, setIsPlacingRandomMoves] = useState(false);

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
        return squares[a];
      }
    }
    return null;
  };

  const getRandomEmptyPosition = (board: Player[]) => {
    const emptyPositions = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter((index) => index !== -1);
    if (emptyPositions.length === 0) return -1;
    return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  };

  const placeRandomMove = () => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      const randomPosition = getRandomEmptyPosition(newBoard);

      if (randomPosition !== -1) {
        newBoard[randomPosition] = currentPlayer;
        return newBoard;
      }
      return prevBoard;
    });

    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
    setRandomMovesPlaced((prev) => prev + 1);
  };

  const startRandomPhase = () => {
    setIsPlacingRandomMoves(true);
    setRandomMovesPlaced(0);
    setCurrentPlayer("X");

    // Place random moves with delays
    const placeMovesWithDelay = (moveCount: number) => {
      if (moveCount < randomMovesCount) {
        setTimeout(() => {
          placeRandomMove();
          placeMovesWithDelay(moveCount + 1);
        }, 800); // 800ms delay between moves
      } else {
        setIsPlacingRandomMoves(false);
      }
    };

    placeMovesWithDelay(0);
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameEnded || isPlacingRandomMoves) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      if (gameWinner === "X") setScoreX(scoreX + 1);
      else setScoreO(scoreO + 1);
    } else if (newBoard.every((cell) => cell !== null)) {
      setGameEnded(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    setRandomMovesPlaced(0);
    setIsPlacingRandomMoves(false);

    // Start with random moves
    setTimeout(() => {
      startRandomPhase();
    }, 500);
  };

  const resetAll = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    setRandomMovesPlaced(0);
    setIsPlacingRandomMoves(false);
    setScoreX(0);
    setScoreO(0);
  };

  // Start random phase when component mounts
  useEffect(() => {
    startRandomPhase();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <h2 className="text-2xl font-bold">Randomized Start Tic-Tac-Toe</h2>
        <Dice6 className="text-green-500" size={24} />
      </div>

      {/* Rules Explanation */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Dice6 className="text-green-600 dark:text-green-400" size={16} />
          <h3 className="font-semibold text-green-800 dark:text-green-300">
            Randomized Rules!
          </h3>
        </div>
        <p className="text-sm text-green-700 dark:text-green-400">
          The first {randomMovesCount} moves are placed randomly. Then normal
          gameplay begins - adapt your strategy!
        </p>
      </div>

      {/* Random Move Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex items-center justify-between">
          <span className="font-medium">Random Moves:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setRandomMovesCount(Math.max(1, randomMovesCount - 1))
              }
              className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              disabled={isPlacingRandomMoves || randomMovesPlaced > 0}
            >
              -
            </button>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono">
              {randomMovesCount}
            </span>
            <button
              onClick={() =>
                setRandomMovesCount(Math.min(6, randomMovesCount + 1))
              }
              className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              disabled={isPlacingRandomMoves || randomMovesPlaced > 0}
            >
              +
            </button>
          </div>
        </div>
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
        {isPlacingRandomMoves ? (
          <div className="flex items-center justify-center gap-2">
            <Shuffle className="text-green-500 animate-spin" size={20} />
            <span className="text-lg font-semibold">
              Placing random moves... ({randomMovesPlaced}/{randomMovesCount})
            </span>
          </div>
        ) : gameEnded ? (
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
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Random phase complete - your turn!
            </div>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 mb-6 max-w-sm mx-auto">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            className={`aspect-square bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-3xl font-bold transition-colors disabled:cursor-not-allowed ${
              isPlacingRandomMoves
                ? "cursor-wait"
                : "hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
            disabled={cell !== null || gameEnded || isPlacingRandomMoves}
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

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg transition-colors"
          disabled={isPlacingRandomMoves}
        >
          <RotateCcw size={16} />
          New Game
        </button>
        <button
          onClick={resetAll}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
          disabled={isPlacingRandomMoves}
        >
          Reset All
        </button>
      </div>

      {/* Progress indicator during random phase */}
      {isPlacingRandomMoves && (
        <div className="mt-4">
          <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(randomMovesPlaced / randomMovesCount) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
