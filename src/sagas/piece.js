import { takeEvery } from 'redux-saga';
import { fork, take, put, select } from 'redux-saga/effects';
import { INPUT_KEY, TIME_TICK, PIECE_RASTERIZE, pieceAdd, pieceRasterize, pieceMove } from '../actions';
import { rand, move } from '../utils';

function* moveDownByGravity() {
  while (true) {
    yield take(TIME_TICK);
    const { type, position, rotate } = yield select(state => state.piece);
    if (typeof type !== 'undefined') {
      const [x, y, z] = position;
      if (z <= 0) {
        yield put(pieceRasterize({ type, position, rotate }));
      }
    }
  }
}

function canMove(dim, pos, dir) {
  const newPos = move(pos, dir);
  return 0 <= newPos[0] && 0 <= newPos[1] && 0 <= newPos[2] &&
    newPos[0] < dim[0] && newPos[1] < dim[1] && newPos[2] < dim[2];
}

function* moveByPlayer() {
  while (true) {
    const { payload: key } = yield take(INPUT_KEY);
    const [size, position] = yield select(state => [state.stage.size, state.piece.position]);
    let action;
    switch (key) {
      case 'ArrowUp':
        if (canMove(size, position, 'back')) {
          yield put(pieceMove('back'));
        }
        break;
      case 'ArrowRight':
        if (canMove(size, position, 'right')) {
          yield put(pieceMove('right'));
        }
        break;
      case 'ArrowDown':
        if (canMove(size, position, 'front')) {
          yield put(pieceMove('front'));
        }
        break;
      case 'ArrowLeft':
        if (canMove(size, position, 'left')) {
          yield put(pieceMove('left'));
        }
        break;
      default:
        console.warn('unhandled key', key);
    }
  }
}

function* newPiece(type = 1) {
  const [dx, dy, dz] = yield select(state => state.stage.size);
  yield put(pieceAdd({ type, position: [rand(dx), rand(dy), dz] }));
}

function* putNewPiece() {
  yield takeEvery(PIECE_RASTERIZE, newPiece);
}

export default function* pieceSaga() {
  yield fork(moveDownByGravity);
  yield fork(moveByPlayer);
  yield fork(putNewPiece);
  yield fork(newPiece);
}
