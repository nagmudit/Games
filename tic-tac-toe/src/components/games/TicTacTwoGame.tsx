'use client';

import { useState } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Copy, Target } from 'lucide-react';

interface TicTacTwoGameProps {
  onBack: () => void;
}

type Player = 'X' | 'O' | null;

export default function TicTacTwoGame({ onBack }: TicTacTwoGameProps) {
  const [board1, setBoard1] = useState<Player[]>(Array(9).fill(null));
  const [board2, setBoard2] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [activeBoard, setActiveBoard] = useState<1 | 2>(1);
  const [board1Winner, setBoard1Winner] = useState<Player>(null);
  const [board2Winner, setBoard2Winner] = useState<Player>(null);
  const [winner, setWinner] = useState<Player>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (squares: Player[]) => {
    for (const line of winningLines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleCellClick = (boardNum: 1 | 2, index: number) => {
    if (gameEnded || activeBoard !== boardNum) return;
    
    const currentBoard = boardNum === 1 ? board1 : board2;
    const currentBoardWinner = boardNum === 1 ? board1Winner : board2Winner;
    
    if (currentBoard[index] || currentBoardWinner) return;

    const newBoard = [...currentBoard];
    newBoard[index] = currentPlayer;
    
    if (boardNum === 1) {
      setBoard1(newBoard);
    } else {
      setBoard2(newBoard);
    }

    // Check if this board is won
    const boardWinner = checkWinner(newBoard);
    if (boardWinner) {
      if (boardNum === 1) {
        setBoard1Winner(boardWinner);
      } else {
        setBoard2Winner(boardWinner);
      }

      // Check if player has won both boards
      const otherBoardWinner = boardNum === 1 ? board2Winner : board1Winner;
      if (otherBoardWinner === boardWinner) {
        setWinner(boardWinner);
        setGameEnded(true);
        if (boardWinner === 'X') setScoreX(scoreX + 1);
        else setScoreO(scoreO + 1);
        return;
      }
    }

    // Check if both boards are complete (draw condition)
    const otherBoard = boardNum === 1 ? board2 : board1;
    const otherBoardWinner = boardNum === 1 ? board2Winner : board1Winner;
    
    if (newBoard.every(cell => cell !== null) && otherBoard.every(cell => cell !== null)) {
      if (!boardWinner && !otherBoardWinner) {
        setGameEnded(true); // Both boards complete, no winner
      }
    }

    // Switch to other board and other player
    setActiveBoard(boardNum === 1 ? 2 : 1);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard1(Array(9).fill(null));
    setBoard2(Array(9).fill(null));
    setCurrentPlayer('X');
    setActiveBoard(1);
    setBoard1Winner(null);
    setBoard2Winner(null);
    setWinner(null);
    setGameEnded(false);
  };

  const resetAll = () => {
    resetGame();
    setScoreX(0);
    setScoreO(0);
  };

  const renderBoard = (board: Player[], boardNum: 1 | 2, boardWinner: Player) => {
    const isActive = activeBoard === boardNum && !gameEnded;
    const isWon = boardWinner !== null;

    return (
      <div className={`relative ${isActive ? 'ring-2 ring-green-500' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Board {boardNum}</h3>
          <div className="flex items-center gap-2">
            {isActive && !gameEnded && (
              <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <Target size={12} />
                <span>Active</span>
              </div>
            )}
            {boardWinner && (
              <div className={`text-sm font-semibold ${
                boardWinner === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {boardWinner} Won!
              </div>
            )}
          </div>
        </div>
        
        <div className={`grid grid-cols-3 gap-1 p-3 rounded-lg border-2 transition-all ${
          isActive 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
            : isWon
            ? boardWinner === 'X'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
        }`}>
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(boardNum, index)}
              className="aspect-square bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:cursor-not-allowed"
              disabled={cell !== null || gameEnded || activeBoard !== boardNum || isWon}
            >
              <span className={cell === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>
                {cell}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
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
        <h2 className="text-2xl font-bold">Tic-Tac-Two</h2>
        <Copy className="text-orange-500" size={24} />
      </div>

      {/* Rules Explanation */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Copy className="text-orange-600 dark:text-orange-400" size={16} />
          <h3 className="font-semibold text-orange-800 dark:text-orange-300">Double Board Rules!</h3>
        </div>
        <div className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
          <p>• Play on two boards simultaneously</p>
          <p>• Your move switches the active board to the other one</p>
          <p>• Win both boards to claim victory!</p>
          <p>• Strategy: Block opponent while advancing your own position</p>
        </div>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">X</div>
            <div className="text-lg font-semibold">{scoreX}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Player 1</div>
            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Board 1: {board1Winner === 'X' ? '✓' : '○'} | Board 2: {board2Winner === 'X' ? '✓' : '○'}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">O</div>
            <div className="text-lg font-semibold">{scoreO}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Player 2</div>
            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Board 1: {board1Winner === 'O' ? '✓' : '○'} | Board 2: {board2Winner === 'O' ? '✓' : '○'}
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
                  Player {winner} Wins Both Boards!
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold">It&apos;s a Draw!</span>
            )}
          </div>
        ) : (
          <div className="text-lg font-semibold">
            Current Player: <span className={currentPlayer === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>{currentPlayer}</span>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Playing on Board {activeBoard}
            </div>
          </div>
        )}
      </div>

      {/* Game Boards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {renderBoard(board1, 1, board1Winner)}
        {renderBoard(board2, 2, board2Winner)}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-8 mb-6">
        <div className="text-center">
          <h4 className="font-medium mb-2">Progress Tracker</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="font-medium text-blue-600 dark:text-blue-400">Player X</div>
              <div className="flex gap-2">
                <div className={`w-4 h-4 rounded border-2 ${
                  board1Winner === 'X' 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-blue-300 dark:border-blue-600'
                }`}></div>
                <div className={`w-4 h-4 rounded border-2 ${
                  board2Winner === 'X' 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-blue-300 dark:border-blue-600'
                }`}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-red-600 dark:text-red-400">Player O</div>
              <div className="flex gap-2">
                <div className={`w-4 h-4 rounded border-2 ${
                  board1Winner === 'O' 
                    ? 'bg-red-500 border-red-500' 
                    : 'border-red-300 dark:border-red-600'
                }`}></div>
                <div className={`w-4 h-4 rounded border-2 ${
                  board2Winner === 'O' 
                    ? 'bg-red-500 border-red-500' 
                    : 'border-red-300 dark:border-red-600'
                }`}></div>
              </div>
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
          Reset Score
        </button>
      </div>
    </div>
  );
}
