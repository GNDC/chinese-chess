export type PieceType = '帅' | '仕' | '相' | '馬' | '車' | '炮' | '兵';
export type PieceColor = 'red' | 'black';

export interface Piece {
  type: PieceType;
  color: PieceColor;
  position: [number, number];
}

export type Board = (Piece | null)[][];

export interface Move {
  from: [number, number];
  to: [number, number];
  piece: Piece;
  captured?: Piece;
}
