"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Clock,
  Play,
  Pause,
  Settings,
} from "lucide-react";

interface TimeControlledGameProps {
  onBack: () => void;
}

type Player = "X" | "O";

export default function TimeControlledGame({
  onBack,
}: TimeControlledGameProps) {
  const [board, setBoard] = useState<(Player | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0, timeouts: 0 });

  // Time control states
  const [timeSettings, setTimeSettings] = useState({
    initial: 30,
    increment: 5,
  }); // 30 seconds + 5 second increment
  const [timeLeft, setTimeLeft] = useState({ X: 30, O: 30 });
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !gameEnded && gameStarted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = { ...prev };
          newTime[currentPlayer] = Math.max(0, newTime[currentPlayer] - 0.1);

          // Check for timeout
          if (newTime[currentPlayer] <= 0) {
            const opponent = currentPlayer === "X" ? "O" : "X";
            setWinner(opponent);
            setGameEnded(true);
            setIsRunning(false);
            setScores((prevScores) => ({
              ...prevScores,
              [opponent]: prevScores[opponent] + 1,
              timeouts: prevScores.timeouts + 1,
            }));
          }

          return newTime;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, gameEnded, currentPlayer, gameStarted]);

  const checkWinner = (squares: (Player | null)[]) => {
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

  const handleCellClick = (index: number) => {
    if (board[index] || gameEnded || !gameStarted) return;

    if (!isRunning) {
      setIsRunning(true);
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // Add time increment
    setTimeLeft((prev) => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] + timeSettings.increment,
    }));

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      setIsRunning(false);
      setScores((prev) => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
    } else if (newBoard.every((cell) => cell !== null)) {
      setGameEnded(true);
      setIsRunning(false);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setIsRunning(true);
  };

  const pauseGame = () => {
    setIsRunning(false);
  };

  const resumeGame = () => {
    if (gameStarted && !gameEnded) {
      setIsRunning(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameEnded(false);
    setIsRunning(false);
    setGameStarted(false);
    setTimeLeft({ X: timeSettings.initial, O: timeSettings.initial });
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0, timeouts: 0 });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, "0")}.${tenths}`;
  };

  const updateTimeSettings = (initial: number, increment: number) => {
    setTimeSettings({ initial, increment });
    setTimeLeft({ X: initial, O: initial });
    setShowSettings(false);
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
        <h2 className="text-2xl font-bold">Time-Controlled Tic-Tac-Toe</h2>
        <Clock className="text-blue-500" size={24} />
      </div>

      {/* Rules Explanation */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="text-blue-600 dark:text-blue-400" size={16} />
          <h3 className="font-semibold text-blue-800 dark:text-blue-300">
            Time Control Rules!
          </h3>
        </div>
        <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <p>• Each player starts with {timeSettings.initial} seconds</p>
          <p>• Get +{timeSettings.increment} seconds after each move</p>
          <p>• If your time runs out, you lose!</p>
          <p>• Click Start Game to begin the timer</p>
        </div>
      </div>

      {/* Time Settings */}
      {showSettings && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-4">Time Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Initial Time (seconds)
              </label>
              <select
                value={timeSettings.initial}
                onChange={(e) =>
                  updateTimeSettings(
                    parseInt(e.target.value),
                    timeSettings.increment
                  )
                }
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Increment (seconds)
              </label>
              <select
                value={timeSettings.increment}
                onChange={(e) =>
                  updateTimeSettings(
                    timeSettings.initial,
                    parseInt(e.target.value)
                  )
                }
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
              >
                <option value={0}>No increment</option>
                <option value={3}>3 seconds</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg border transition-all ${
            currentPlayer === "X" && isRunning && gameStarted
              ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500"
              : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          }`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              X
            </div>
            <div
              className={`text-xl font-mono ${
                timeLeft.X < 10 ? "text-red-500 animate-pulse" : ""
              }`}
            >
              {formatTime(timeLeft.X)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Player X
            </div>
          </div>
        </div>
        <div
          className={`p-4 rounded-lg border transition-all ${
            currentPlayer === "O" && isRunning && gameStarted
              ? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 ring-2 ring-red-500"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              O
            </div>
            <div
              className={`text-xl font-mono ${
                timeLeft.O < 10 ? "text-red-500 animate-pulse" : ""
              }`}
            >
              {formatTime(timeLeft.O)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Player O
            </div>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex justify-center gap-2 mb-6">
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Play size={16} />
            Start Game
          </button>
        ) : (
          <>
            {isRunning ? (
              <button
                onClick={pauseGame}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
              >
                <Pause size={16} />
                Pause
              </button>
            ) : (
              <button
                onClick={resumeGame}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                disabled={gameEnded}
              >
                <Play size={16} />
                Resume
              </button>
            )}
          </>
        )}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
          disabled={gameStarted && !gameEnded}
        >
          <Settings size={16} />
          Settings
        </button>
      </div>

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
                  {timeLeft[winner === "X" ? "O" : "X"] <= 0 && " (Timeout)"}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold">It&apos;s a Draw!</span>
            )}
          </div>
        ) : gameStarted ? (
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
            {!isRunning && " (Paused)"}
          </div>
        ) : (
          <div className="text-lg font-semibold text-slate-600 dark:text-slate-400">
            Click Start Game to begin!
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
              className={`w-16 h-16 border border-slate-300 dark:border-slate-600 rounded text-xl font-bold transition-colors ${
                cell
                  ? `${
                      cell === "X"
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                    } cursor-not-allowed`
                  : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              }`}
              disabled={cell !== null || gameEnded || !gameStarted}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {scores.X}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            X Wins
          </div>
        </div>
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            {scores.O}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            O Wins
          </div>
        </div>
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <div className="text-lg font-bold text-slate-600 dark:text-slate-400">
            {scores.draws}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Draws
          </div>
        </div>
        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
            {scores.timeouts}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Timeouts
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
          ⏰ <strong>Time Tip:</strong> Play quickly but think strategically.
          Use the increment to your advantage!
        </p>
      </div>
    </div>
  );
}
