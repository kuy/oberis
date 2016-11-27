import { takeEvery } from 'redux-saga';
import { fork, take, put, select } from 'redux-saga/effects';
import { INPUT_KEY, TIME_TICK, PIECE_DROP, PIECE_RASTERIZE, pieceAdd, pieceRasterize, pieceMove, pieceDrop } from '../actions';
import { rand, canMove, rasterize, shrink } from '../utils';

function* moveDownByGravity() {
  while (true) {
    yield take(TIME_TICK);
    const [{ data, size }, piece] = yield select(state => [state.stage, state.piece]);
    if (typeof piece.type !== 'undefined' && canMove(size, data, piece, 'down')) {
      yield put(pieceMove('down'));
    }
  }
}

function* moveDownByDrop() {
  while (true) {
    yield take(PIECE_DROP);
    while (true) {
      const [{ data, size }, piece] = yield select(state => [state.stage, state.piece]);
      if (typeof piece.type !== 'undefined' && canMove(size, data, piece, 'down')) {
        yield put(pieceMove('down'));
      } else {
        break;
      }
    }
  }
}

function* moveByKeys() {
  while (true) {
    const { payload: key } = yield take(INPUT_KEY);
    const [{ data, size }, piece] = yield select(state => [state.stage, state.piece]);
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
      case 'Enter':
        yield put(pieceDrop());
        break;
      default:
        console.warn(`Unhandled key: '${key}'`);
    }
  }
}

export function* newPiece() {
  const dim = yield select(state => state.stage.size);
  const type = 1 + rand(5);
  const volume = rasterize(dim, { type, position: [0, 0, 0] });
  const [px, py, pz] = shrink(dim, volume);
  const [dx, dy, dz] = dim;
  const [rx, ry, rz] = [dx - (px - 1), dy - (py - 1), dz - (pz - 1)];
  yield put(pieceAdd({ type, position: [rand(rx), rand(ry), rz] }));
}

function* spawnNewPiece() {
  yield takeEvery(PIECE_RASTERIZE, newPiece);
}

function* triggerRasterizePiece() {
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

export default function* pieceSaga() {
  yield fork(moveDownByGravity);
  yield fork(moveDownByDrop);
  yield fork(moveByKeys);
  yield fork(triggerRasterizePiece);
  yield fork(spawnNewPiece);

  // First piece
  yield fork(newPiece);
}
