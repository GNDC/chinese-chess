import React from 'react';
import { Board, Piece } from '../types/chess';
import { getPieceDisplay, getValidMoves } from '../utils/chessLogic';

interface ChessBoardProps {
  board: Board;
  selectedPiece: Piece | null;
  validMoves: [number, number][];
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  board, 
  selectedPiece, 
  validMoves, 
  onCellClick,
  disabled = false
}) => {
  const cellSize = 56;
  const boardWidth = cellSize * 9;
  const boardHeight = cellSize * 10;
  
  const isValidMove = (row: number, col: number) => {
    return validMoves.some(([r, c]) => r === row && c === col);
  };
  
  const isSelected = (row: number, col: number) => {
    return selectedPiece && selectedPiece.position[0] === row && selectedPiece.position[1] === col;
  };
  
  return (
    <div className="relative p-6">
      <div 
        className="relative bg-amber-100 border-4 border-red-700 rounded-lg shadow-2xl"
        style={{ width: boardWidth + 40, height: boardHeight + 40 }}
      >
        <div className="absolute inset-5 bg-amber-200 rounded">
          <svg 
            width={boardWidth} 
            height={boardHeight}
            className="absolute inset-0"
          >
            {/* 边框 - 四周的外框 */}
            <rect 
              x={cellSize/2} 
              y={cellSize/2} 
              width={boardWidth - cellSize} 
              height={boardHeight - cellSize}
              fill="none" 
              stroke="#C0392B" 
              strokeWidth="3"
            />
            
            {/* 横线 - 全部10条 */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) => (
              <line 
                key={`h-${row}`}
                x1={cellSize / 2} 
                y1={row * cellSize + cellSize / 2} 
                x2={8 * cellSize + cellSize / 2} 
                y2={row * cellSize + cellSize / 2} 
                stroke="#C0392B" 
                strokeWidth="2"
              />
            ))}
            
            {/* 竖线 - 9条，都分两段 */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
              <React.Fragment key={`v-${col}`}>
                {/* 上段：从顶部 (row 0) 到楚河汉界 (row 4) */}
                <line 
                  x1={col * cellSize + cellSize / 2} 
                  y1={cellSize / 2} 
                  x2={col * cellSize + cellSize / 2} 
                  y2={4 * cellSize + cellSize / 2} 
                  stroke="#C0392B" 
                  strokeWidth="2"
                />
                {/* 下段：从楚河汉界 (row 5) 到底部 (row 9) */}
                <line 
                  x1={col * cellSize + cellSize / 2} 
                  y1={5 * cellSize + cellSize / 2} 
                  x2={col * cellSize + cellSize / 2} 
                  y2={9 * cellSize + cellSize / 2} 
                  stroke="#C0392B" 
                  strokeWidth="2"
                />
              </React.Fragment>
            ))}
            
            {/* 九宫格 - 红方和黑方 */}
            <line x1={3 * cellSize + cellSize / 2} y1={cellSize / 2} x2={5 * cellSize + cellSize / 2} y2={2 * cellSize + cellSize / 2} stroke="#C0392B" strokeWidth="2" />
            <line x1={5 * cellSize + cellSize / 2} y1={cellSize / 2} x2={3 * cellSize + cellSize / 2} y2={2 * cellSize + cellSize / 2} stroke="#C0392B" strokeWidth="2" />
            <line x1={3 * cellSize + cellSize / 2} y1={7 * cellSize + cellSize / 2} x2={5 * cellSize + cellSize / 2} y2={9 * cellSize + cellSize / 2} stroke="#C0392B" strokeWidth="2" />
            <line x1={5 * cellSize + cellSize / 2} y1={7 * cellSize + cellSize / 2} x2={3 * cellSize + cellSize / 2} y2={9 * cellSize + cellSize / 2} stroke="#C0392B" strokeWidth="2" />
            
            {/* 拐角标记 - 标准象棋棋盘位置 */}
            {(() => {
              const markers: JSX.Element[] = [];
              const positions = [
                [2, 1], [2, 7],
                [3, 0], [3, 2], [3, 4], [3, 6], [3, 8],
                [6, 0], [6, 2], [6, 4], [6, 6], [6, 8],
                [7, 1], [7, 7],
              ];
              const size = 8;
              
              positions.forEach(([row, col], i) => {
                const cx = col * cellSize + cellSize / 2;
                const cy = row * cellSize + cellSize / 2;
                
                // 左上角标记：┘，开口向右下
                markers.push(
                  <path
                    key={`marker-${i}-tl`}
                    d={`M ${cx - size} ${cy} L ${cx - size} ${cy - size} L ${cx} ${cy - size}`}
                    fill="none"
                    stroke="#C0392B"
                    strokeWidth="2"
                  />
                );
                // 右上角标记：└，开口向左下
                markers.push(
                  <path
                    key={`marker-${i}-tr`}
                    d={`M ${cx} ${cy - size} L ${cx + size} ${cy - size} L ${cx + size} ${cy}`}
                    fill="none"
                    stroke="#C0392B"
                    strokeWidth="2"
                  />
                );
                // 左下角标记：┐，开口向右上
                markers.push(
                  <path
                    key={`marker-${i}-bl`}
                    d={`M ${cx - size} ${cy} L ${cx - size} ${cy + size} L ${cx} ${cy + size}`}
                    fill="none"
                    stroke="#C0392B"
                    strokeWidth="2"
                  />
                );
                // 右下角标记：┌，开口向左上
                markers.push(
                  <path
                    key={`marker-${i}-br`}
                    d={`M ${cx} ${cy + size} L ${cx + size} ${cy + size} L ${cx + size} ${cy}`}
                    fill="none"
                    stroke="#C0392B"
                    strokeWidth="2"
                  />
                );
              });
              
              return markers;
            })()}
          </svg>
          
          <div 
            className="absolute w-full flex justify-center items-center text-4xl font-bold"
            style={{ 
              top: boardHeight / 2 - 20, 
              color: '#C0392B',
              fontFamily: 'KaiTi, STKaiti, serif'
            }}
          >
            <div className="flex gap-20">
              <span className="bg-amber-200">楚&nbsp;&nbsp;河</span>
              <span className="bg-amber-200">汉&nbsp;&nbsp;界</span>
            </div>
          </div>
          
          {Array.from({ length: 10 }).map((_, row) => (
            Array.from({ length: 9 }).map((_, col) => {
              const piece = board[row][col];
              const validMove = isValidMove(row, col);
              const selected = isSelected(row, col);
              
              return (
                <div
                  key={`cell-${row}-${col}`}
                  className={`absolute flex items-center justify-center cursor-pointer transition-all duration-150
                    ${selected ? 'ring-4 ring-yellow-400 rounded-full' : ''}
                    ${validMove ? (piece ? 'ring-4 ring-red-400 rounded-full' : 'after:content-[""] after:w-4 after:h-4 after:bg-green-500 after:rounded-full after:opacity-60') : ''}
                    ${disabled ? 'cursor-not-allowed' : 'hover:bg-amber-300/30'}
                  `}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    left: col * cellSize,
                    top: row * cellSize,
                  }}
                  onClick={() => !disabled && onCellClick(row, col)}
                >
                  {piece && (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg
                        ${piece.color === 'red' ? 'bg-yellow-100 text-red-700 border-2 border-red-700' : 'bg-yellow-100 text-gray-900 border-2 border-gray-900'}
                        ${selected ? 'scale-110' : ''}
                      `}
                    >
                      {getPieceDisplay(piece)}
                    </div>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
