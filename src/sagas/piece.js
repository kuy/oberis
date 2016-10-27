import { takeEvery } from 'redux-saga';
import { fork, take, put, select } from 'redux-saga/effects';
import { INPUT_KEY, TIME_TICK, PIECE_RASTERIZE, pieceAdd, pieceRasterize, pieceMove } from '../actions';
import { rand, canMove } from '../utils';

function* moveDownByGravity() {
  while (true) {
    yield take(TIME_TICK);
    const [{ data, size }, piece] = yield select(state => [state.stage, state.piece]);
    if (typeof piece.type !== 'undefined') {
      if (!canMove(size, data, piece, 'down')) {
        yield put(pieceRasterize(piece));
      }
    }
  }
}

function* moveByPlayer() {
  while (true) {
    const { payload: key } = yield take(INPUT_KEY);
    const [{ data, size }, piece] = yield select(state => [state.stage, state.piece]);
    let action;
    switch (key) {
      case 'ArrowUp':
        if (canMove(size, data, piece, 'back')) {
          yield put(pieceMove('back'));
        }
        break;
      case 'ArrowRight':
        if (canMove(size, data, piece, 'right')) {
          yield put(pieceMove('right'));
        }
        break;
      case 'ArrowDown':
        if (canMove(size, data, piece, 'front')) {
          yield put(pieceMove('front'));
        }
        break;
      case 'ArrowLeft':
        if (canMove(size, data, piece, 'left')) {
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
