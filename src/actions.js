import { createAction } from 'redux-actions';

export const SCORE = 'SCORE';
export const GAME_OVER = 'GAME_OVER';
export const RESTART = 'RESTART';
export const score = createAction(SCORE);
export const gameOver = createAction(GAME_OVER);
export const restart = createAction(RESTART);

export const TIME_TICK = 'TIME_TICK';
export const TIME_TOGGLE = 'TIME_TOGGLE';
export const timeTick = createAction(TIME_TICK);
export const timeToggle = createAction(TIME_TOGGLE);

export const INPUT_KEY = 'INPUT_KEY';
export const inputKey = createAction(INPUT_KEY);

export const PIECE_ADD = 'PIECE_ADD';
export const PIECE_MOVE = 'PIECE_MOVE';
export const PIECE_DROP = 'PIECE_DROP';
export const PIECE_ROTATE = 'PIECE_ROTATE';
export const PIECE_RASTERIZE = 'PIECE_RASTERIZE';
export const pieceAdd = createAction(PIECE_ADD);
export const pieceMove = createAction(PIECE_MOVE);
export const pieceDrop = createAction(PIECE_DROP);
export const pieceRotate = createAction(PIECE_ROTATE);
export const pieceRasterize = createAction(PIECE_RASTERIZE);
