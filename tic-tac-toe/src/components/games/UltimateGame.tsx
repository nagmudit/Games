'use client';

import { useState } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Grid3x3, Target } from 'lucide-react';

interface UltimateGameProps {
  onBack: () => void;
}

type Player = 'X' | 'O' | null;
type BoardResult = 'X' | 'O' | 'tie' | null;
type SmallBoard = Player[];
type UltimateBoard = SmallBoard[];

export default function UltimateGame({ onBack }: UltimateGameProps) {
  // 9 small boards, each with 9 cells
  const [ultimateBoard, setUltimateBoard] = useState<UltimateBoard>(
    Array(9).fill(null).map(() => Array(9).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [activeBoard, setActiveBoard] = useState<number | null>(null); // null means any board
  const [boardWinners, setBoardWinners] = useState<BoardResult[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<Player>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkSmallBoardWinner = (board: Player[]) => {
    for (const line of winningLines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.every(cell => cell !== null) ? 'tie' : null;
  };

  const checkUltimateWinner = (winners: BoardResult[]) => {
    for (const line of winningLines) {
      const [a, b, c] = line;
      if (winners[a] && winners[a] !== 'tie' && winners[a] === winners[b] && winners[a] === winners[c]) {
        return winners[a] as Player;
      }
    }
    return null;
  };

  const handleCellClick = (boardIndex: number, cellIndex: number) => {
    if (gameEnded || boardWinners[boardIndex] || ultimateBoard[boardIndex][cellIndex]) return;
    if (activeBoard !== null && activeBoard !== boardIndex) return;

    const newUltimateBoard = ultimateBoard.map((board, bIdx) =>
      bIdx === boardIndex
        ? board.map((cell, cIdx) => (cIdx === cellIndex ? currentPlayer : cell))
        : board
    );

    setUltimateBoard(newUltimateBoard);

    // Check if small board is won
    const newBoardWinners = [...boardWinners];
    const smallBoardResult = checkSmallBoardWinner(newUltimateBoard[boardIndex]);
    if (smallBoardResult) {
      newBoardWinners[boardIndex] = smallBoardResult;
      setBoardWinners(newBoardWinners);
    }

    // Check if ultimate game is won
    const ultimateWinner = checkUltimateWinner(newBoardWinners);
    if (ultimateWinner) {
      setWinner(ultimateWinner);
      setGameEnded(true);
      if (ultimateWinner === 'X') setScoreX(scoreX + 1);
      else setScoreO(scoreO + 1);
    } else if (newBoardWinners.every(w => w !== null)) {
      // All small boards are complete
      setGameEnded(true);
    }

    // Set next active board
    if (!gameEnded) {
      const nextActiveBoard = newBoardWinners[cellIndex] ? null : cellIndex;
      setActiveBoard(nextActiveBoard);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setUltimateBoard(Array(9).fill(null).map(() => Array(9).fill(null)));
    setCurrentPlayer('X');
    setActiveBoard(null);
    setBoardWinners(Array(9).fill(null));
    setWinner(null);
    setGameEnded(false);
  };

  const resetAll = () => {
    resetGame();
    setScoreX(0);
    setScoreO(0);
  };

  const getBoardStatus = (boardIndex: number) => {
    if (boardWinners[boardIndex] === 'X') return 'won-x';
    if (boardWinners[boardIndex] === 'O') return 'won-o';
    if (boardWinners[boardIndex] === 'tie') return 'tied';
    if (activeBoard === null || activeBoard === boardIndex) return 'active';
    return 'inactive';
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
        <h2 className="text-2xl font-bold">Ultimate Tic-Tac-Toe</h2>
        <Grid3x3 className="text-purple-500" size={24} />
      </div>

      {/* Rules Explanation */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Target className="text-purple-600 dark:text-purple-400" size={16} />
          <h3 className="font-semibold text-purple-800 dark:text-purple-300">Ultimate Rules!</h3>
        </div>
        <div className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
          <p>• Win small boards to claim them in the ultimate board</p>
          <p>• Your move determines which board your opponent must play in next</p>
          <p>• Win 3 small boards in a row to win the ultimate game!</p>
          {activeBoard !== null && (
            <p className="font-semibold">• Currently playing in board {activeBoard + 1}</p>
          )}
        </div>
      </div>

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
                  Player {winner} Wins the Ultimate Game!
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold">It&apos;s a Draw!</span>
            )}
          </div>
        ) : (
          <div className="text-lg font-semibold">
            Current Player: <span className={currentPlayer === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>{currentPlayer}</span>
            {activeBoard !== null ? (
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Must play in board {activeBoard + 1}
              </div>
            ) : (
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Can play in any available board
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ultimate Game Board */}
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-3 gap-2 p-4 bg-slate-200 dark:bg-slate-700 rounded-lg">
          {ultimateBoard.map((smallBoard, boardIndex) => {
            const boardStatus = getBoardStatus(boardIndex);
            return (
              <div
                key={boardIndex}
                className={`grid grid-cols-3 gap-1 p-2 rounded border-2 transition-all ${
                  boardStatus === 'active' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : boardStatus === 'won-x'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : boardStatus === 'won-o'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : boardStatus === 'tied'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                {boardWinners[boardIndex] && boardWinners[boardIndex] !== 'tie' ? (
                  <div className="col-span-3 flex items-center justify-center h-16">
                    <span className={`text-4xl font-bold ${
                      boardWinners[boardIndex] === 'X' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {boardWinners[boardIndex]}
                    </span>
                  </div>
                ) : boardWinners[boardIndex] === 'tie' ? (
                  <div className="col-span-3 flex items-center justify-center h-16">
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      TIE
                    </span>
                  </div>
                ) : (
                  smallBoard.map((cell, cellIndex) => (
                    <button
                      key={cellIndex}
                      onClick={() => handleCellClick(boardIndex, cellIndex)}
                      className="w-5 h-5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:cursor-not-allowed"
                      disabled={
                        cell !== null || 
                        gameEnded || 
                        boardWinners[boardIndex] !== null || 
                        (activeBoard !== null && activeBoard !== boardIndex)
                      }
                    >
                      <span className={cell === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>
                        {cell}
                      </span>
                    </button>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Board Status Legend */}
      <div className="flex justify-center gap-4 mb-6 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded"></div>
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded"></div>
          <span>X Won</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded"></div>
          <span>O Won</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded"></div>
          <span>Tied</span>
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
