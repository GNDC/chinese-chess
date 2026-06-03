import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Undo2, Trophy } from 'lucide-react';
import ChessBoard from '../components/ChessBoard';
import { Board, Piece } from '../types/chess';
import { 
  createInitialBoard, 
  getValidMoves, 
  makeMove, 
  isInCheck, 
  isCheckmate,
  cloneBoard
} from '../utils/chessLogic';

const VsGame: React.FC = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'black'>('red');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'red' | 'black' | null>(null);
  const [moveHistory, setMoveHistory] = useState<{ board: Board; player: 'red' | 'black' }[]>([]);
  
  const resetGame = useCallback(() => {
    const newBoard = createInitialBoard();
    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentPlayer('red');
    setGameOver(false);
    setWinner(null);
    setMoveHistory([]);
  }, []);
  
  const handleCellClick = (row: number, col: number) => {
    if (gameOver) return;
    
    const clickedPiece = board[row][col];
    
    if (selectedPiece) {
      const isValid = validMoves.some(([r, c]) => r === row && c === col);
      
      if (isValid) {
        setMoveHistory(prev => [...prev, { board: cloneBoard(board), player: currentPlayer }]);
        
        const { board: newBoard } = makeMove(board, selectedPiece.position, [row, col]);
        setBoard(newBoard);
        
        const nextPlayer = currentPlayer === 'red' ? 'black' : 'red';
        
        if (isCheckmate(newBoard, nextPlayer)) {
          setGameOver(true);
          setWinner(currentPlayer);
        }
        
        setSelectedPiece(null);
        setValidMoves([]);
        setCurrentPlayer(nextPlayer);
      } else if (clickedPiece && clickedPiece.color === currentPlayer) {
        setSelectedPiece(clickedPiece);
        setValidMoves(getValidMoves(board, clickedPiece));
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else if (clickedPiece && clickedPiece.color === currentPlayer) {
      setSelectedPiece(clickedPiece);
      setValidMoves(getValidMoves(board, clickedPiece));
    }
  };
  
  const undoMove = () => {
    if (moveHistory.length === 0) return;
    
    const lastState = moveHistory[moveHistory.length - 1];
    setBoard(lastState.board);
    setCurrentPlayer(lastState.player);
    setSelectedPiece(null);
    setValidMoves([]);
    setGameOver(false);
    setWinner(null);
    setMoveHistory(prev => prev.slice(0, -1));
  };
  
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
          
          <h1 className="text-3xl font-bold text-amber-900">双人对战</h1>
        </div>
        
        <div className="text-center mb-4">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl text-xl font-bold
            ${currentPlayer === 'red' ? 'bg-red-100 text-red-700' : 'bg-gray-800 text-white'}
          `}>
            {!gameOver && (
              <>{currentPlayer === 'red' ? '🔴 红方走棋' : '⚫ 黑方走棋'}</>
            )}
            {gameOver && winner && (
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                {winner === 'red' ? '红方获胜！' : '黑方获胜！'}
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
            disabled={gameOver}
          />
        </div>
        
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={undoMove}
            disabled={moveHistory.length === 0 || gameOver}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
              ${moveHistory.length === 0 || gameOver
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            <Undo2 className="w-5 h-5" />
            悔棋
          </button>
          
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            重新开始
          </button>
        </div>
        
        <div className="flex justify-center gap-16 mt-8">
          <div className={`text-center px-8 py-4 rounded-xl ${currentPlayer === 'black' ? 'ring-4 ring-gray-600 bg-gray-100' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-gray-800 mb-2">⚫ 黑方</div>
            <div className="text-gray-600">上方</div>
          </div>
          <div className={`text-center px-8 py-4 rounded-xl ${currentPlayer === 'red' ? 'ring-4 ring-red-600 bg-red-50' : 'bg-red-50/50'}`}>
            <div className="text-2xl font-bold text-red-700 mb-2">🔴 红方</div>
            <div className="text-red-600">下方</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VsGame;
