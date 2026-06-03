import { Board, Piece, PieceType, Move } from '../types/chess';

const BOARD_ROWS = 10;
const BOARD_COLS = 9;

const INITIAL_BOARD: (string | null)[][] = [
  ['車', '馬', '相', '仕', '帅', '仕', '相', '馬', '車'],
  [null, null, null, null, null, null, null, null, null],
  [null, '炮', null, null, null, null, null, '炮', null],
  ['兵', null, '兵', null, '兵', null, '兵', null, '兵'],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  ['卒', null, '卒', null, '卒', null, '卒', null, '卒'],
  [null, '砲', null, null, null, null, null, '砲', null],
  [null, null, null, null, null, null, null, null, null],
  ['車', '馬', '象', '士', '将', '士', '象', '馬', '車'],
];

const TYPE_MAP: Record<string, PieceType> = {
  '帅': '帅', '将': '帅',
  '仕': '仕', '士': '仕',
  '相': '相', '象': '相',
  '馬': '馬',
  '車': '車',
  '炮': '炮', '砲': '炮',
  '兵': '兵', '卒': '兵'
};

const DISPLAY_MAP: Record<PieceType, { red: string; black: string }> = {
  '帅': { red: '帥', black: '將' },
  '仕': { red: '仕', black: '士' },
  '相': { red: '相', black: '象' },
  '馬': { red: '馬', black: '馬' },
  '車': { red: '車', black: '車' },
  '炮': { red: '炮', black: '砲' },
  '兵': { red: '兵', black: '卒' }
};

export function createInitialBoard(): Board {
  const board: Board = Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(null));
  
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      const char = INITIAL_BOARD[row][col];
      if (char) {
        const color = row < 5 ? 'red' : 'black';
        const type = TYPE_MAP[char];
        board[row][col] = { type, color, position: [row, col] };
      }
    }
  }
  
  return board;
}

export function getPieceDisplay(piece: Piece): string {
  return DISPLAY_MAP[piece.type][piece.color];
}

function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
}

function isInPalace(row: number, col: number, color: 'red' | 'black'): boolean {
  if (color === 'red') {
    return row >= 0 && row <= 2 && col >= 3 && col <= 5;
  } else {
    return row >= 7 && row <= 9 && col >= 3 && col <= 5;
  }
}

function hasCrossedRiver(row: number, color: 'red' | 'black'): boolean {
  return color === 'red' ? row >= 5 : row <= 4;
}

function countPiecesBetween(board: Board, fromRow: number, fromCol: number, toRow: number, toCol: number): number {
  let count = 0;
  const rowStep = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
  const colStep = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
  
  let r = fromRow + rowStep;
  let c = fromCol + colStep;
  
  while (r !== toRow || c !== toCol) {
    if (board[r][c]) count++;
    r += rowStep;
    c += colStep;
  }
  
  return count;
}

export function getValidMoves(board: Board, piece: Piece): [number, number][] {
  const [row, col] = piece.position;
  const moves: [number, number][] = [];
  
  switch (piece.type) {
    case '帅':
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isInPalace(newRow, newCol, piece.color)) {
          const target = board[newRow][newCol];
          if (!target || target.color !== piece.color) {
            moves.push([newRow, newCol]);
          }
        }
      }
      const enemyColor = piece.color === 'red' ? 'black' : 'red';
      let checkRow = piece.color === 'red' ? row + 1 : row - 1;
      while (isInBounds(checkRow, col)) {
        const target = board[checkRow][col];
        if (target) {
          if (target.type === '帅' && target.color === enemyColor) {
            moves.push([checkRow, col]);
          }
          break;
        }
        checkRow += piece.color === 'red' ? 1 : -1;
      }
      break;
      
    case '仕':
      const shiDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (const [dr, dc] of shiDirs) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isInPalace(newRow, newCol, piece.color)) {
          const target = board[newRow][newCol];
          if (!target || target.color !== piece.color) {
            moves.push([newRow, newCol]);
          }
        }
      }
      break;
      
    case '相':
      const xiangDirs = [[-2, -2], [-2, 2], [2, -2], [2, 2]];
      for (const [dr, dc] of xiangDirs) {
        const newRow = row + dr;
        const newCol = col + dc;
        const blockRow = row + dr / 2;
        const blockCol = col + dc / 2;
        
        if (isInBounds(newRow, newCol) && !board[blockRow][blockCol]) {
          if ((piece.color === 'red' && newRow <= 4) || (piece.color === 'black' && newRow >= 5)) {
            const target = board[newRow][newCol];
            if (!target || target.color !== piece.color) {
              moves.push([newRow, newCol]);
            }
          }
        }
      }
      break;
      
    case '馬':
      const maDirs = [
        [-2, -1, -1, 0], [-2, 1, -1, 0],
        [2, -1, 1, 0], [2, 1, 1, 0],
        [-1, -2, 0, -1], [1, -2, 0, -1],
        [-1, 2, 0, 1], [1, 2, 0, 1]
      ];
      for (const [dr, dc, blockDr, blockDc] of maDirs) {
        const newRow = row + dr;
        const newCol = col + dc;
        const blockRow = row + blockDr;
        const blockCol = col + blockDc;
        
        if (isInBounds(newRow, newCol) && !board[blockRow][blockCol]) {
          const target = board[newRow][newCol];
          if (!target || target.color !== piece.color) {
            moves.push([newRow, newCol]);
          }
        }
      }
      break;
      
    case '車':
      for (let r = row - 1; r >= 0; r--) {
        const target = board[r][col];
        if (!target) {
          moves.push([r, col]);
        } else {
          if (target.color !== piece.color) moves.push([r, col]);
          break;
        }
      }
      for (let r = row + 1; r < BOARD_ROWS; r++) {
        const target = board[r][col];
        if (!target) {
          moves.push([r, col]);
        } else {
          if (target.color !== piece.color) moves.push([r, col]);
          break;
        }
      }
      for (let c = col - 1; c >= 0; c--) {
        const target = board[row][c];
        if (!target) {
          moves.push([row, c]);
        } else {
          if (target.color !== piece.color) moves.push([row, c]);
          break;
        }
      }
      for (let c = col + 1; c < BOARD_COLS; c++) {
        const target = board[row][c];
        if (!target) {
          moves.push([row, c]);
        } else {
          if (target.color !== piece.color) moves.push([row, c]);
          break;
        }
      }
      break;
      
    case '炮':
      let jumping = false;
      for (let r = row - 1; r >= 0; r--) {
        const target = board[r][col];
        if (!jumping) {
          if (!target) {
            moves.push([r, col]);
          } else {
            jumping = true;
          }
        } else {
          if (target) {
            if (target.color !== piece.color) moves.push([r, col]);
            break;
          }
        }
      }
      jumping = false;
      for (let r = row + 1; r < BOARD_ROWS; r++) {
        const target = board[r][col];
        if (!jumping) {
          if (!target) {
            moves.push([r, col]);
          } else {
            jumping = true;
          }
        } else {
          if (target) {
            if (target.color !== piece.color) moves.push([r, col]);
            break;
          }
        }
      }
      jumping = false;
      for (let c = col - 1; c >= 0; c--) {
        const target = board[row][c];
        if (!jumping) {
          if (!target) {
            moves.push([row, c]);
          } else {
            jumping = true;
          }
        } else {
          if (target) {
            if (target.color !== piece.color) moves.push([row, c]);
            break;
          }
        }
      }
      jumping = false;
      for (let c = col + 1; c < BOARD_COLS; c++) {
        const target = board[row][c];
        if (!jumping) {
          if (!target) {
            moves.push([row, c]);
          } else {
            jumping = true;
          }
        } else {
          if (target) {
            if (target.color !== piece.color) moves.push([row, c]);
            break;
          }
        }
      }
      break;
      
    case '兵':
      const forward = piece.color === 'red' ? 1 : -1;
      const newRow = row + forward;
      if (isInBounds(newRow, col)) {
        const target = board[newRow][col];
        if (!target || target.color !== piece.color) {
          moves.push([newRow, col]);
        }
      }
      if (hasCrossedRiver(row, piece.color)) {
        const leftCol = col - 1;
        const rightCol = col + 1;
        if (isInBounds(row, leftCol)) {
          const target = board[row][leftCol];
          if (!target || target.color !== piece.color) {
            moves.push([row, leftCol]);
          }
        }
        if (isInBounds(row, rightCol)) {
          const target = board[row][rightCol];
          if (!target || target.color !== piece.color) {
            moves.push([row, rightCol]);
          }
        }
      }
      break;
  }
  
  return moves;
}

export function cloneBoard(board: Board): Board {
  return board.map(row => row.map(piece => piece ? { ...piece } : null));
}

export function makeMove(board: Board, from: [number, number], to: [number, number]): { board: Board; move: Move; captured?: Piece } {
  const newBoard = cloneBoard(board);
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  
  const piece = newBoard[fromRow][fromCol];
  if (!piece) throw new Error('No piece at source position');
  
  const captured = newBoard[toRow][toCol];
  
  piece.position = [toRow, toCol];
  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;
  
  return {
    board: newBoard,
    move: { from, to, piece, captured },
    captured
  };
}

export function isInCheck(board: Board, color: 'red' | 'black'): boolean {
  let kingPos: [number, number] | null = null;
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece && piece.type === '帅' && piece.color === color) {
        kingPos = [r, c];
        break;
      }
    }
    if (kingPos) break;
  }
  
  if (!kingPos) return false;
  
  const enemyColor = color === 'red' ? 'black' : 'red';
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece && piece.color === enemyColor) {
        const moves = getValidMoves(board, piece);
        if (moves.some(([mr, mc]) => mr === kingPos![0] && mc === kingPos![1])) {
          return true;
        }
      }
    }
  }
  
  return false;
}

export function isCheckmate(board: Board, color: 'red' | 'black'): boolean {
  if (!isInCheck(board, color)) return false;
  
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, piece);
        for (const move of moves) {
          const { board: newBoard } = makeMove(board, [r, c], move);
          if (!isInCheck(newBoard, color)) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
}

const PIECE_VALUES: Record<PieceType, number> = {
  '帅': 10000,
  '車': 1000,
  '馬': 450,
  '炮': 450,
  '相': 200,
  '仕': 200,
  '兵': 100
};

function evaluateBoard(board: Board): number {
  let score = 0;
  
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece) {
        const value = PIECE_VALUES[piece.type];
        const positionBonus = piece.type === '兵' 
          ? (piece.color === 'red' ? r : (9 - r)) * 10
          : 0;
        
        if (piece.color === 'black') {
          score += value + positionBonus;
        } else {
          score -= value + positionBonus;
        }
      }
    }
  }
  
  return score;
}

function minimax(board: Board, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  if (depth === 0) {
    return evaluateBoard(board);
  }
  
  const color = isMaximizing ? 'black' : 'red';
  
  let hasValidMove = false;
  let bestScore = isMaximizing ? -Infinity : Infinity;
  
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, piece);
        for (const move of moves) {
          const { board: newBoard, captured } = makeMove(board, [r, c], move);
          
          if (isInCheck(newBoard, color)) continue;
          
          hasValidMove = true;
          const score = minimax(newBoard, depth - 1, alpha, beta, !isMaximizing);
          
          if (isMaximizing) {
            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, score);
          } else {
            bestScore = Math.min(bestScore, score);
            beta = Math.min(beta, score);
          }
          
          if (beta <= alpha) break;
        }
      }
    }
  }
  
  if (!hasValidMove) {
    return isMaximizing ? -100000 : 100000;
  }
  
  return bestScore;
}

export function getBestMove(board: Board, difficulty: 'easy' | 'medium' | 'hard'): Move | null {
  const depth = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  let bestMove: Move | null = null;
  let bestScore = -Infinity;
  
  const allMoves: { move: Move; board: Board; captured?: Piece }[] = [];
  
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece && piece.color === 'black') {
        const moves = getValidMoves(board, piece);
        for (const movePos of moves) {
          const result = makeMove(board, [r, c], movePos);
          if (!isInCheck(result.board, 'black')) {
            allMoves.push(result);
          }
        }
      }
    }
  }
  
  for (const result of allMoves) {
    const score = minimax(result.board, depth, -Infinity, Infinity, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = result.move;
    }
  }
  
  return bestMove;
}
