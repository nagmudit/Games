'use client';

import { useState } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Settings } from 'lucide-react';

interface NxNGameProps {
  onBack: () => void;
}

type Player = 'X' | 'O' | null;

export default function NxNGame({ onBack }: NxNGameProps) {
  const [boardSize, setBoardSize] = useState(4);
  const [board, setBoard] = useState<Player[]>(Array(16).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const checkWinner = (squares: Player[], size: number) => {
    const winCondition = size;

    // Check rows
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - winCondition; col++) {
        const start = row * size + col;
        let count = 0;
        const player = squares[start];
        if (!player) continue;

        for (let i = 0; i < winCondition; i++) {
          if (squares[start + i] === player) count++;
          else break;
        }
        if (count === winCondition) return player;
      }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - winCondition; row++) {
        const start = row * size + col;
        let count = 0;
        const player = squares[start];
        if (!player) continue;

        for (let i = 0; i < winCondition; i++) {
          if (squares[start + i * size] === player) count++;
          else break;
        }
        if (count === winCondition) return player;
      }
    }

    // Check diagonals (top-left to bottom-right)
    for (let row = 0; row <= size - winCondition; row++) {
      for (let col = 0; col <= size - winCondition; col++) {
        const start = row * size + col;
        let count = 0;
        const player = squares[start];
        if (!player) continue;

        for (let i = 0; i < winCondition; i++) {
          if (squares[start + i * (size + 1)] === player) count++;
          else break;
        }
        if (count === winCondition) return player;
      }
    }

    // Check diagonals (top-right to bottom-left)
    for (let row = 0; row <= size - winCondition; row++) {
      for (let col = winCondition - 1; col < size; col++) {
        const start = row * size + col;
        let count = 0;
        const player = squares[start];
        if (!player) continue;

        for (let i = 0; i < winCondition; i++) {
          if (squares[start + i * (size - 1)] === player) count++;
          else break;
        }
        if (count === winCondition) return player;
      }
    }

    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameEnded) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard, boardSize);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameEnded(true);
      if (gameWinner === 'X') setScoreX(scoreX + 1);
      else setScoreO(scoreO + 1);
    } else if (newBoard.every(cell => cell !== null)) {
      setGameEnded(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameEnded(false);
  };

  const changeBoardSize = (newSize: number) => {
    setBoardSize(newSize);
    setBoard(Array(newSize * newSize).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameEnded(false);
    setShowSettings(false);
  };

  const resetAll = () => {
    resetGame();
    setScoreX(0);
    setScoreO(0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold">{boardSize}x{boardSize} Tic-Tac-Toe</h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Board Size</h3>
          <div className="flex gap-2 flex-wrap">
            {[4, 5, 6, 7, 8, 10].map(size => (
              <button
                key={size}
                onClick={() => changeBoardSize(size)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  boardSize === size
                    ? 'bg-blue-600 dark:bg-emerald-600 text-white border-blue-600 dark:border-emerald-600'
                    : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                }`}
              >
                {size}x{size}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Get {boardSize} in a row to win!
          </p>
        </div>
      )}

      {/* Score Board */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">X</div>
            <div className="text-lg font-semibold">{scoreX}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Player 1</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">O</div>
            <div className="text-lg font-semibold">{scoreO}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Player 2</div>
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
            Current Player: <span className={currentPlayer === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>{currentPlayer}</span>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-6">
        <div 
          className="grid gap-1 bg-slate-200 dark:bg-slate-700 p-2 rounded-lg"
          style={{ 
            gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
            maxWidth: boardSize <= 6 ? '400px' : '600px'
          }}
        >
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className="aspect-square bg-white dark:bg-slate-800 rounded text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:cursor-not-allowed min-w-8 min-h-8"
              disabled={cell !== null || gameEnded}
              style={{
                fontSize: boardSize > 6 ? '0.875rem' : '1.125rem'
              }}
            >
              <span className={cell === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>
                {cell}
              </span>
            </button>
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
    </div>
  );
}
