import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Undo2, Trophy } from 'lucide-react';
import ChessBoard from '../components/ChessBoard';
import { Board, Piece, Move } from '../types/chess';
import { 
  createInitialBoard, 
  getValidMoves, 
  makeMove, 
  isInCheck, 
  isCheckmate,
  getBestMove,
  cloneBoard
} from '../utils/chessLogic';

type Difficulty = 'easy' | 'medium' | 'hard';

const AIGame: React.FC = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'black'>('red');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'red' | 'black' | null>(null);
  const [moveHistory, setMoveHistory] = useState<{ board: Board; player: 'red' | 'black' }[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [thinking, setThinking] = useState(false);
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  
  const resetGame = useCallback(() => {
    const newBoard = createInitialBoard();
    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentPlayer('red');
    setGameOver(false);
    setWinner(null);
    setMoveHistory([]);
    setThinking(false);
  }, []);
  
  useEffect(() => {
    if (!gameOver && currentPlayer === 'black' && !showDifficultySelect) {
      setThinking(true);
      
      const timer = setTimeout(() => {
        const bestMove = getBestMove(board, difficulty);
        
        if (bestMove) {
          setMoveHistory(prev => [...prev, { board: cloneBoard(board), player: currentPlayer }]);
          
          const { board: newBoard } = makeMove(board, bestMove.from, bestMove.to);
          setBoard(newBoard);
          
          if (isCheckmate(newBoard, 'red')) {
            setGameOver(true);
            setWinner('black');
          } else if (isInCheck(newBoard, 'red')) {
          }
          
          setCurrentPlayer('red');
        }
        
        setThinking(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, gameOver, difficulty, showDifficultySelect]);
  
  const handleCellClick = (row: number, col: number) => {
    if (gameOver || currentPlayer === 'black' || thinking || showDifficultySelect) return;
    
    const clickedPiece = board[row][col];
    
    if (selectedPiece) {
      const isValid = validMoves.some(([r, c]) => r === row && c === col);
      
      if (isValid) {
        setMoveHistory(prev => [...prev, { board: cloneBoard(board), player: currentPlayer }]);
        
        const { board: newBoard } = makeMove(board, selectedPiece.position, [row, col]);
        setBoard(newBoard);
        
        if (isCheckmate(newBoard, 'black')) {
          setGameOver(true);
          setWinner('red');
        } else if (isInCheck(newBoard, 'black')) {
        }
        
        setSelectedPiece(null);
        setValidMoves([]);
        setCurrentPlayer('black');
      } else if (clickedPiece && clickedPiece.color === 'red') {
        setSelectedPiece(clickedPiece);
        setValidMoves(getValidMoves(board, clickedPiece));
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else if (clickedPiece && clickedPiece.color === 'red') {
      setSelectedPiece(clickedPiece);
      setValidMoves(getValidMoves(board, clickedPiece));
    }
  };
  
  const undoMove = () => {
    if (moveHistory.length < 2) return;
    
    let prevState = moveHistory[moveHistory.length - 2];
    setBoard(prevState.board);
    setCurrentPlayer(prevState.player);
    setSelectedPiece(null);
    setValidMoves([]);
    setGameOver(false);
    setWinner(null);
    setMoveHistory(prev => prev.slice(0, -2));
  };
  
  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setShowDifficultySelect(false);
    resetGame();
  };
  
  if (showDifficultySelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex flex-col items-center justify-center p-8">
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回主菜单
        </button>
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-900 mb-4">人机对战</h1>
          <p className="text-xl text-amber-700">选择难度开始游戏</p>
        </div>
        
        <div className="flex flex-col gap-6 w-full max-w-md">
          <button
            onClick={() => startGame('easy')}
            className="group px-8 py-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-2xl font-bold">简单</div>
            <div className="text-green-200 text-sm">适合初学者</div>
          </button>
          
          <button
            onClick={() => startGame('medium')}
            className="group px-8 py-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-yellow-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-2xl font-bold">中等</div>
            <div className="text-yellow-200 text-sm">有一定挑战</div>
          </button>
          
          <button
            onClick={() => startGame('hard')}
            className="group px-8 py-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-2xl font-bold">困难</div>
            <div className="text-red-200 text-sm">高级水平</div>
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回主菜单
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-amber-900">
              难度: {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
            </span>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl text-xl font-bold
            ${currentPlayer === 'red' ? 'bg-red-100 text-red-700' : 'bg-gray-800 text-white'}
          `}>
            {thinking && <span className="animate-pulse">思考中...</span>}
            {!thinking && !gameOver && (
              <>{currentPlayer === 'red' ? '🔴 红方（你）走棋' : '⚫ 黑方（AI）走棋'}</>
            )}
            {gameOver && winner && (
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                {winner === 'red' ? '恭喜！红方（你）获胜！' : '黑方（AI）获胜！'}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <ChessBoard
            board={board}
            selectedPiece={selectedPiece}
            validMoves={validMoves}
            onCellClick={handleCellClick}
            disabled={gameOver || currentPlayer === 'black' || thinking}
          />
        </div>
        
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={undoMove}
            disabled={moveHistory.length < 2 || gameOver || thinking}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
              ${moveHistory.length < 2 || gameOver || thinking
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            <Undo2 className="w-5 h-5" />
            悔棋
          </button>
          
          <button
            onClick={() => setShowDifficultySelect(true)}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-all"
          >
            更换难度
          </button>
          
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            重新开始
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGame;
